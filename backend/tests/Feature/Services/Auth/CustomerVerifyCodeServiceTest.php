<?php

namespace Tests\Feature\Services\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Exceptions\ApiException;
use App\Models\Account;
use App\Services\Auth\CustomerVerifyCodeService;
use App\Stores\Auth\CustomerOtpChallengeStore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CustomerVerifyCodeServiceTest extends TestCase
{
    use RefreshDatabase;

    private const MOBILE = '+919876543215';

    private CustomerVerifyCodeService $service;

    private CustomerOtpChallengeStore $challengeStore;

    /**
     * @var list<string>
     */
    private array $challengeIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(
            CustomerVerifyCodeService::class,
        );

        $this->challengeStore = app(
            CustomerOtpChallengeStore::class,
        );
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

        parent::tearDown();
    }

    public function test_it_verifies_an_existing_customer_login(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        $challenge =
            $this->challengeStore->createLogin(
                self::MOBILE,
            );

        $this->challengeIds[] = $challenge->id;

        $result = $this->service->handle(
            challengeId: $challenge->id,
            code: '1234',
        );

        $this->assertSame(
            $account->id,
            $result->account->id,
        );

        $this->assertFalse(
            $result->registeredNow,
        );

        $this->assertNull(
            $this->challengeStore->find(
                $challenge->id,
            ),
        );
    }

    public function test_it_creates_a_new_customer_after_successful_registration_verification(): void
    {
        $challenge =
            $this->challengeStore
                ->createRegistration(
                    mobile: self::MOBILE,
                    fullName: 'Prateek Sharma',
                );

        $this->challengeIds[] = $challenge->id;

        $result = $this->service->handle(
            challengeId: $challenge->id,
            code: '1234',
        );

        $this->assertTrue(
            $result->registeredNow,
        );

        $this->assertSame(
            AccountRole::Customer,
            $result->account->role,
        );

        $this->assertSame(
            AccountStatus::Active,
            $result->account->status,
        );

        $this->assertSame(
            self::MOBILE,
            $result->account->mobile,
        );

        $this->assertDatabaseHas(
            'customer_profiles',
            [
                'account_id' =>
                    $result->account->id,
                'full_name' =>
                    'Prateek Sharma',
            ],
        );
    }

    public function test_it_records_an_incorrect_code_attempt(): void
    {
        $challenge =
            $this->challengeStore->createLogin(
                self::MOBILE,
            );

        $this->challengeIds[] = $challenge->id;

        try {
            $this->service->handle(
                challengeId: $challenge->id,
                code: '0000',
            );

            $this->fail(
                'Expected ApiException was not thrown.',
            );
        } catch (ApiException $exception) {
            $this->assertSame(
                'OTP_CODE_INVALID',
                $exception->errorCode(),
            );

            $this->assertSame(
                422,
                $exception->statusCode(),
            );

            $this->assertSame(
                4,
                $exception->details()[
                'remainingAttempts'
                ],
            );
        }

        $storedChallenge =
            $this->challengeStore->find(
                $challenge->id,
            );

        $this->assertNotNull(
            $storedChallenge,
        );

        $this->assertSame(
            1,
            $storedChallenge->failedAttempts,
        );
    }

    public function test_it_deletes_the_challenge_after_five_incorrect_codes(): void
    {
        $challenge =
            $this->challengeStore->createLogin(
                self::MOBILE,
            );

        $this->challengeIds[] = $challenge->id;

        for (
            $attempt = 1;
            $attempt <=
            CustomerOtpChallengeStore::MAX_FAILED_ATTEMPTS;
            $attempt++
        ) {
            try {
                $this->service->handle(
                    challengeId:
                    $challenge->id,
                    code: '0000',
                );

                $this->fail(
                    'Expected ApiException was not thrown.',
                );
            } catch (ApiException $exception) {
                $expectedCode =
                    $attempt <
                    CustomerOtpChallengeStore::MAX_FAILED_ATTEMPTS
                        ? 'OTP_CODE_INVALID'
                        : 'OTP_ATTEMPTS_EXCEEDED';

                $this->assertSame(
                    $expectedCode,
                    $exception->errorCode(),
                );
            }
        }

        $this->assertNull(
            $this->challengeStore->find(
                $challenge->id,
            ),
        );
    }

    public function test_it_rejects_a_missing_or_expired_challenge(): void
    {
        try {
            $this->service->handle(
                challengeId:
                '550e8400-e29b-41d4-a716-446655440000',
                code: '1234',
            );

            $this->fail(
                'Expected ApiException was not thrown.',
            );
        } catch (ApiException $exception) {
            $this->assertSame(
                'OTP_CHALLENGE_EXPIRED',
                $exception->errorCode(),
            );

            $this->assertSame(
                410,
                $exception->statusCode(),
            );
        }
    }

    public function test_it_rejects_another_account_role_during_registration_verification(): void
    {
        $challenge =
            $this->challengeStore
                ->createRegistration(
                    mobile: self::MOBILE,
                    fullName: 'Prateek Sharma',
                );

        $this->challengeIds[] = $challenge->id;

        Account::query()->create([
            'role' =>
                AccountRole::DeliveryPartner,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        try {
            $this->service->handle(
                challengeId: $challenge->id,
                code: '1234',
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

    public function test_it_reuses_an_existing_active_customer_during_registration_verification(): void
    {
        $challenge =
            $this->challengeStore
                ->createRegistration(
                    mobile: self::MOBILE,
                    fullName: 'New Submitted Name',
                );

        $this->challengeIds[] = $challenge->id;

        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        $account->customerProfile()->create([
            'full_name' => 'Existing Name',
        ]);

        $result = $this->service->handle(
            challengeId: $challenge->id,
            code: '1234',
        );

        $this->assertSame(
            $account->id,
            $result->account->id,
        );

        $this->assertFalse(
            $result->registeredNow,
        );

        $this->assertDatabaseHas(
            'customer_profiles',
            [
                'account_id' => $account->id,
                'full_name' => 'Existing Name',
            ],
        );

        $this->assertDatabaseMissing(
            'customer_profiles',
            [
                'account_id' => $account->id,
                'full_name' =>
                    'New Submitted Name',
            ],
        );
    }
}
