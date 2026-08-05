<?php

namespace Tests\Feature\Api\V1\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CustomerSessionEndpointTest extends TestCase
{
    use RefreshDatabase;

    private const MOBILE = '+919876543213';

    protected function setUp(): void
    {
        parent::setUp();

        config()->set(
            'sanctum.stateful',
            ['localhost'],
        );
    }

    public function test_an_authenticated_customer_can_get_their_current_account(): void
    {
        $account = $this->createCustomer();

        $response = $this
            ->actingAs($account, 'web')
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->getJson(
                '/api/v1/auth/me',
            );

        $response
            ->assertOk()
            ->assertExactJson([
                'authenticated' => true,

                'account' => [
                    'id' => $account->id,
                    'role' => 'CUSTOMER',
                    'mobile' => self::MOBILE,
                ],

                'customerProfile' => [
                    'fullName' =>
                        'Prateek Sharma',
                ],
            ]);
    }

    public function test_a_guest_cannot_access_the_current_account_endpoint(): void
    {
        $response = $this
            ->withHeaders([
                'Origin' =>
                    'http://localhost',

                'X-Request-ID' =>
                    'guest-auth-me-request',
            ])
            ->getJson(
                '/api/v1/auth/me',
            );

        $response
            ->assertStatus(401)
            ->assertExactJson([
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' =>
                        'Authentication is required.',
                ],

                'requestId' =>
                    'guest-auth-me-request',
            ]);
    }

    public function test_an_authenticated_customer_can_log_out(): void
    {
        $account = $this->createCustomer();

        $response = $this
            ->actingAs($account, 'web')
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->postJson(
                '/api/v1/auth/logout',
            );

        $response
            ->assertOk()
            ->assertExactJson([
                'authenticated' => false,
            ]);

        $this->assertGuest('web');
    }

    public function test_a_guest_cannot_access_the_logout_endpoint(): void
    {
        $response = $this
            ->withHeader(
                'Origin',
                'http://localhost',
            )
            ->postJson(
                '/api/v1/auth/logout',
            );

        $response
            ->assertStatus(401)
            ->assertJsonPath(
                'error.code',
                'UNAUTHENTICATED',
            );
    }

    private function createCustomer(): Account
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => self::MOBILE,
        ]);

        $account->customerProfile()->create([
            'full_name' => 'Prateek Sharma',
        ]);

        return $account;
    }
}
