<?php

namespace Tests\Feature\Services\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Enums\CustomerOtpPurpose;
use App\Exceptions\ApiException;
use App\Models\Account;
use App\Services\Auth\CustomerRequestCodeService;
use App\Stores\Auth\CustomerOtpChallengeStore;
use App\Stores\Auth\CustomerOtpSendLimitStore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Tests\TestCase;

final class CustomerRequestCodeServiceTest extends TestCase
{
    use RefreshDatabase;

    private const MOBILE = '+919876543218';

    /**
     * @var list<string>
     */
    private array $challengeIds = [];

    private CustomerRequestCodeService $service;

    private CustomerOtpChallengeStore $challengeStore;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clearLimitKeys();

        $this->service = app(
            CustomerRequestCodeService::class,
        );

        $this->challengeStore = app(
            CustomerOtpChallengeStore::class,
        );
    }

    protected function tearDown(): void
    {
        foreach ($this->challengeIds as $challengeId) {
            $this->challengeStore->delete(
                $challengeId,
            );
        }

        $this->clearLimitKeys();

        parent::tearDown();
    }

    public function test_it_requests_registration_details_for_an_unused_mobile_without_a_name(): void
    {
        $result = $this->service->handle(
            mobile: self::MOBILE,
            fullName: null,
        );

        $this->assertSame([
            'nextStep' =>
                'ENTER_REGISTRATION_DETAILS',
        ], $result);
    }

    public function test_it_creates_a_login_challenge_for_an_active_customer(): void
    {
        Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        $result = $this->service->handle(
            mobile: self::MOBILE,
            fullName: null,
        );

        $this->assertSame(
            'VERIFY_CODE',
            $result['nextStep'],
        );

        $this->assertTrue(
            Str::isUuid($result['challengeId']),
        );

        $this->assertSame(
            CustomerOtpChallengeStore::TTL_SECONDS,
            $result['expiresInSeconds'],
        );

        $this->assertSame(
            CustomerOtpSendLimitStore::COOLDOWN_SECONDS,
            $result['resendAfterSeconds'],
        );

        $this->assertSame(
            '1234',
            $result['developmentCode'],
        );

        $this->challengeIds[] =
            $result['challengeId'];

        $challenge = $this->challengeStore->find(
            $result['challengeId'],
        );

        $this->assertNotNull($challenge);

        $this->assertSame(
            CustomerOtpPurpose::Login,
            $challenge->purpose,
        );
    }

    public function test_it_creates_a_registration_challenge_for_an_unused_mobile_with_a_name(): void
    {
        $result = $this->service->handle(
            mobile: self::MOBILE,
            fullName: 'Prateek Sharma',
        );

        $this->assertSame(
            'VERIFY_CODE',
            $result['nextStep'],
        );

        $this->challengeIds[] =
            $result['challengeId'];

        $challenge = $this->challengeStore->find(
            $result['challengeId'],
        );

        $this->assertNotNull($challenge);

        $this->assertSame(
            CustomerOtpPurpose::Registration,
            $challenge->purpose,
        );

        $this->assertSame(
            'Prateek Sharma',
            $challenge->fullName,
        );
    }

    public function test_it_rejects_a_mobile_registered_for_another_role(): void
    {
        Account::query()->create([
            'role' => AccountRole::DeliveryPartner,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        try {
            $this->service->handle(
                mobile: self::MOBILE,
                fullName: null,
            );

            $this->fail(
                'Expected ApiException was not thrown.',
            );
        } catch (ApiException $exception) {
            $this->assertSame(
                'ACCOUNT_ROLE_CONFLICT',
                $exception->errorCode(),
            );

            $this->assertSame(
                409,
                $exception->statusCode(),
            );
        }
    }

    public function test_it_rejects_an_inactive_customer(): void
    {
        Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Suspended,
            'mobile' => self::MOBILE,
        ]);

        try {
            $this->service->handle(
                mobile: self::MOBILE,
                fullName: null,
            );

            $this->fail(
                'Expected ApiException was not thrown.',
            );
        } catch (ApiException $exception) {
            $this->assertSame(
                'ACCOUNT_NOT_ACTIVE',
                $exception->errorCode(),
            );

            $this->assertSame(
                403,
                $exception->statusCode(),
            );
        }
    }

    public function test_it_translates_a_cooldown_block_to_an_api_exception(): void
    {
        Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        $firstResult = $this->service->handle(
            mobile: self::MOBILE,
            fullName: null,
        );

        $this->challengeIds[] =
            $firstResult['challengeId'];

        try {
            $this->service->handle(
                mobile: self::MOBILE,
                fullName: null,
            );

            $this->fail(
                'Expected ApiException was not thrown.',
            );
        } catch (ApiException $exception) {
            $this->assertSame(
                'OTP_COOLDOWN',
                $exception->errorCode(),
            );

            $this->assertSame(
                429,
                $exception->statusCode(),
            );

            $this->assertArrayHasKey(
                'retryAfterSeconds',
                $exception->details(),
            );
        }
    }

    public function test_it_translates_the_hourly_limit_to_an_api_exception(): void
    {
        Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        Redis::connection()->set(
            $this->hourlyKey(),
            (string)
            CustomerOtpSendLimitStore::MAX_SENDS_PER_HOUR,
        );

        Redis::connection()->expire(
            $this->hourlyKey(),
            CustomerOtpSendLimitStore::HOURLY_WINDOW_SECONDS,
        );

        try {
            $this->service->handle(
                mobile: self::MOBILE,
                fullName: null,
            );

            $this->fail(
                'Expected ApiException was not thrown.',
            );
        } catch (ApiException $exception) {
            $this->assertSame(
                'OTP_LIMIT_EXCEEDED',
                $exception->errorCode(),
            );

            $this->assertSame(
                429,
                $exception->statusCode(),
            );

            $this->assertArrayHasKey(
                'retryAfterSeconds',
                $exception->details(),
            );
        }
    }

    private function clearLimitKeys(): void
    {
        Redis::connection()->del(
            $this->cooldownKey(),
            $this->hourlyKey(),
        );
    }

    private function cooldownKey(): string
    {
        return
            'auth:customer:otp:cooldown:'.
            self::MOBILE;
    }

    private function hourlyKey(): string
    {
        return
            'auth:customer:otp:hourly:'.
            self::MOBILE;
    }
}
