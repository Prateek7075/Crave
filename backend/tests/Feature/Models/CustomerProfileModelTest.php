<?php

namespace Tests\Feature\Models;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Models\CustomerProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CustomerProfileModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_account_has_one_customer_profile(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $profile = $account->customerProfile()->create([
            'full_name' => 'Prateek Sharma',
        ]);

        $this->assertInstanceOf(
            CustomerProfile::class,
            $account->fresh()->customerProfile,
        );

        $this->assertTrue(
            $account
                ->fresh()
                ->customerProfile
                ->is($profile),
        );

        $this->assertSame(
            $account->id,
            $profile->account_id,
        );
    }

    public function test_a_customer_profile_belongs_to_an_account(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $profile = CustomerProfile::query()->create([
            'account_id' => $account->id,
            'full_name' => 'Prateek Sharma',
        ]);

        $this->assertInstanceOf(
            Account::class,
            $profile->account,
        );

        $this->assertTrue(
            $profile->account->is($account),
        );
    }
}
