<?php

namespace Tests\Feature\Models;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class AccountModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_casts_role_and_status_to_enums(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $account->refresh();

        $this->assertSame(
            AccountRole::Customer,
            $account->role,
        );

        $this->assertSame(
            AccountStatus::Active,
            $account->status,
        );
    }

    public function test_it_hides_the_password_hash_when_serialized(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
            'password_hash' => 'stored-password-hash',
        ]);

        $this->assertArrayNotHasKey(
            'password_hash',
            $account->toArray(),
        );
    }

    public function test_it_uses_password_hash_as_the_authentication_password(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
            'password_hash' => 'stored-password-hash',
        ]);

        $this->assertSame(
            'password_hash',
            $account->getAuthPasswordName(),
        );

        $this->assertSame(
            'stored-password-hash',
            $account->getAuthPassword(),
        );
    }
}
