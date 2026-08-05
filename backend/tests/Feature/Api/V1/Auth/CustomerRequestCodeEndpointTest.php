<?php

namespace Tests\Feature\Api\V1\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Enums\CustomerOtpPurpose;
use App\Http\Middleware\AssignRequestId;
use App\Models\Account;
use App\Stores\Auth\CustomerOtpChallengeStore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Tests\TestCase;

final class CustomerRequestCodeEndpointTest extends TestCase
{
    use RefreshDatabase;

    private const LOCAL_MOBILE = '9876543218';

    private const NORMALIZED_MOBILE =
        '+919876543218';

    /**
     * @var list<string>
     */
    private array $challengeIds = [];

    private CustomerOtpChallengeStore $challengeStore;

    protected function setUp(): void
    {
        parent::setUp();

        $this->challengeStore = app(
            CustomerOtpChallengeStore::class,
        );

        $this->clearOtpKeys();
    }

    protected function tearDown(): void
    {
        foreach (
            $this->challengeIds as $challengeId
        ) {
            $this->challengeStore->delete(
                $challengeId,
            );
        }

        $this->clearOtpKeys();

        parent::tearDown();
    }

    public function test_it_requests_registration_details_for_a_new_mobile_without_a_name(): void
    {
        $response = $this->postJson(
            '/api/v1/auth/customer/request-code',
            [
                'mobile' => self::LOCAL_MOBILE,
            ],
        );

        $response
            ->assertOk()
            ->assertExactJson([
                'nextStep' =>
                    'ENTER_REGISTRATION_DETAILS',
            ]);
    }

    public function test_it_creates_a_registration_challenge_for_a_new_mobile_with_a_name(): void
    {
        $response = $this->postJson(
            '/api/v1/auth/customer/request-code',
            [
                'mobile' => self::LOCAL_MOBILE,
                'fullName' => '  Prateek Sharma  ',
            ],
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'nextStep',
                'VERIFY_CODE',
            )
            ->assertJsonPath(
                'expiresInSeconds',
                300,
            )
            ->assertJsonPath(
                'resendAfterSeconds',
                30,
            )
            ->assertJsonPath(
                'developmentCode',
                '1234',
            );

        $challengeId = $response->json(
            'challengeId',
        );

        $this->assertIsString($challengeId);
        $this->assertTrue(
            Str::isUuid($challengeId),
        );

        $this->challengeIds[] = $challengeId;

        $challenge = $this->challengeStore->find(
            $challengeId,
        );

        $this->assertNotNull($challenge);

        $this->assertSame(
            CustomerOtpPurpose::Registration,
            $challenge->purpose,
        );

        $this->assertSame(
            self::NORMALIZED_MOBILE,
            $challenge->mobile,
        );

        $this->assertSame(
            'Prateek Sharma',
            $challenge->fullName,
        );
    }

    public function test_it_creates_a_login_challenge_for_an_active_customer(): void
    {
        Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::NORMALIZED_MOBILE,
        ]);

        $response = $this->postJson(
            '/api/v1/auth/customer/request-code',
            [
                'mobile' => self::LOCAL_MOBILE,
            ],
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'nextStep',
                'VERIFY_CODE',
            )
            ->assertJsonPath(
                'developmentCode',
                '1234',
            );

        $challengeId = $response->json(
            'challengeId',
        );

        $this->assertIsString($challengeId);

        $this->challengeIds[] = $challengeId;

        $challenge = $this->challengeStore->find(
            $challengeId,
        );

        $this->assertNotNull($challenge);

        $this->assertSame(
            CustomerOtpPurpose::Login,
            $challenge->purpose,
        );

        $this->assertNull(
            $challenge->fullName,
        );
    }

    public function test_it_rejects_a_mobile_registered_for_another_role(): void
    {
        Account::query()->create([
            'role' =>
                AccountRole::DeliveryPartner,
            'status' => AccountStatus::Active,
            'mobile' => self::NORMALIZED_MOBILE,
        ]);

        $response = $this
            ->withHeader(
                AssignRequestId::HEADER_NAME,
                'customer-auth-request-101',
            )
            ->postJson(
                '/api/v1/auth/customer/request-code',
                [
                    'mobile' => self::LOCAL_MOBILE,
                ],
            );

        $response
            ->assertStatus(409)
            ->assertHeader(
                AssignRequestId::HEADER_NAME,
                'customer-auth-request-101',
            )
            ->assertExactJson([
                'error' => [
                    'code' =>
                        'ACCOUNT_ROLE_CONFLICT',
                    'message' =>
                        'This mobile number is registered for a different account type',
                ],
                'requestId' =>
                    'customer-auth-request-101',
            ]);
    }

    public function test_it_rejects_an_inactive_customer(): void
    {
        Account::query()->create([
            'role' => AccountRole::Customer,
            'status' =>
                AccountStatus::Suspended,
            'mobile' => self::NORMALIZED_MOBILE,
        ]);

        $response = $this->postJson(
            '/api/v1/auth/customer/request-code',
            [
                'mobile' => self::LOCAL_MOBILE,
            ],
        );

        $response
            ->assertStatus(403)
            ->assertJsonPath(
                'error.code',
                'ACCOUNT_NOT_ACTIVE',
            )
            ->assertJsonPath(
                'error.message',
                'This account is currently unavailable',
            );
    }

    public function test_it_returns_the_standard_validation_error_for_an_invalid_mobile(): void
    {
        $response = $this->postJson(
            '/api/v1/auth/customer/request-code',
            [
                'mobile' => '1234567890',
            ],
        );

        $response
            ->assertStatus(422)
            ->assertJsonPath(
                'error.code',
                'VALIDATION_ERROR',
            )
            ->assertJsonPath(
                'error.details.fields.mobile.0',
                'Enter a valid Indian mobile number.',
            );
    }

    private function clearOtpKeys(): void
    {
        Redis::connection()->del(
            'auth:customer:otp:cooldown:'.
            self::NORMALIZED_MOBILE,

            'auth:customer:otp:hourly:'.
            self::NORMALIZED_MOBILE,
        );
    }
}
