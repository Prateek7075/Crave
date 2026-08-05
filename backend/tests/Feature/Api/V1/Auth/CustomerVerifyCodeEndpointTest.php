<?php

namespace Tests\Feature\Api\V1\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Stores\Auth\CustomerOtpChallengeStore;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CustomerVerifyCodeEndpointTest extends TestCase
{
    use RefreshDatabase;

    private const MOBILE = '+919876543214';

    private CustomerOtpChallengeStore $challengeStore;

    /**
     * @var list<string>
     */
    private array $challengeIds = [];

    protected function setUp(): void
    {
        parent::setUp();

        config()->set(
            'sanctum.stateful',
            ['localhost'],
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

    public function test_it_registers_and_authenticates_a_new_customer(): void
    {
        $challenge =
            $this->challengeStore
                ->createRegistration(
                    mobile: self::MOBILE,
                    fullName: 'Prateek Sharma',
                );

        $this->challengeIds[] = $challenge->id;

        $response = $this
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->postJson(
                '/api/v1/auth/customer/verify-code',
                [
                    'challengeId' =>
                        $challenge->id,
                    'code' => '1234',
                ],
            );

        $account = Account::query()
            ->where('mobile', self::MOBILE)
            ->firstOrFail();

        $response
            ->assertOk()
            ->assertExactJson([
                'authenticated' => true,
                'registeredNow' => true,

                'account' => [
                    'id' => $account->id,
                    'role' => 'CUSTOMER',
                    'mobile' => self::MOBILE,
                ],

                'customerProfile' => [
                    'fullName' => 'Prateek Sharma',
                ],
            ]);

        $this->assertAuthenticatedAs(
            $account,
            'web',
        );

        $this->assertDatabaseHas(
            'customer_profiles',
            [
                'account_id' => $account->id,
                'full_name' =>
                    'Prateek Sharma',
            ],
        );
    }

    public function test_it_authenticates_an_existing_customer(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        $account->customerProfile()->create([
            'full_name' => 'Existing Customer',
        ]);

        $challenge =
            $this->challengeStore->createLogin(
                self::MOBILE,
            );

        $this->challengeIds[] = $challenge->id;

        $response = $this
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->postJson(
                '/api/v1/auth/customer/verify-code',
                [
                    'challengeId' =>
                        $challenge->id,
                    'code' => '1234',
                ],
            );

        $response
            ->assertOk()
            ->assertJsonPath(
                'authenticated',
                true,
            )
            ->assertJsonPath(
                'registeredNow',
                false,
            )
            ->assertJsonPath(
                'account.id',
                $account->id,
            )
            ->assertJsonPath(
                'account.role',
                'CUSTOMER',
            )
            ->assertJsonPath(
                'customerProfile.fullName',
                'Existing Customer',
            );

        $this->assertAuthenticatedAs(
            $account,
            'web',
        );
    }

    public function test_it_rejects_an_incorrect_code_without_authenticating(): void
    {
        $challenge =
            $this->challengeStore->createLogin(
                self::MOBILE,
            );

        $this->challengeIds[] = $challenge->id;

        $response = $this
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->postJson(
                '/api/v1/auth/customer/verify-code',
                [
                    'challengeId' =>
                        $challenge->id,
                    'code' => '0000',
                ],
            );

        $response
            ->assertStatus(422)
            ->assertJsonPath(
                'error.code',
                'OTP_CODE_INVALID',
            )
            ->assertJsonPath(
                'error.details.remainingAttempts',
                4,
            );

        $this->assertGuest('web');
    }

    public function test_it_rejects_a_missing_or_expired_challenge(): void
    {
        $response = $this
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->postJson(
                '/api/v1/auth/customer/verify-code',
                [
                    'challengeId' =>
                        '550e8400-e29b-41d4-a716-446655440000',
                    'code' => '1234',
                ],
            );

        $response
            ->assertStatus(410)
            ->assertJsonPath(
                'error.code',
                'OTP_CHALLENGE_EXPIRED',
            );

        $this->assertGuest('web');
    }
}
