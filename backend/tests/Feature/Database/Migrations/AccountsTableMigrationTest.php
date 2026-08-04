<?php

namespace Tests\Feature\Database\Migrations;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class AccountsTableMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_accounts_table_contains_the_required_columns_and_default_status(): void
    {
        $this->assertTrue(
            Schema::hasColumns('accounts', [
                'id',
                'role',
                'status',
                'mobile',
                'email',
                'password_hash',
                'created_at',
                'updated_at',
            ]),
        );

        $accountId = DB::table('accounts')->insertGetId([
            'role' => AccountRole::Customer->value,
            'mobile' => '+919876543210',
        ]);

        $this->assertSame(
            AccountStatus::Active->value,
            DB::table('accounts')
                ->where('id', $accountId)
                ->value('status'),
        );
    }

    public function test_mobile_numbers_are_globally_unique(): void
    {
        DB::table('accounts')->insert([
            'role' => AccountRole::Customer->value,
            'mobile' => '+919876543210',
        ]);

        $this->expectException(QueryException::class);

        DB::table('accounts')->insert([
            'role' => AccountRole::DeliveryPartner->value,
            'mobile' => '+919876543210',
        ]);
    }

    public function test_email_addresses_are_unique_without_case_sensitivity(): void
    {
        DB::table('accounts')->insert([
            'role' => AccountRole::RestaurantOwner->value,
            'email' => 'owner@example.com',
            'password_hash' => 'first-hash',
        ]);

        $this->expectException(QueryException::class);

        DB::table('accounts')->insert([
            'role' => AccountRole::RestaurantOwner->value,
            'email' => 'OWNER@EXAMPLE.COM',
            'password_hash' => 'second-hash',
        ]);
    }

    public function test_an_account_requires_a_mobile_number_or_email_address(): void
    {
        $this->expectException(QueryException::class);

        DB::table('accounts')->insert([
            'role' => AccountRole::Customer->value,
        ]);
    }

    public function test_invalid_mobile_format_is_rejected_by_the_database(): void
    {
        $this->expectException(QueryException::class);

        DB::table('accounts')->insert([
            'role' => AccountRole::Customer->value,
            'mobile' => '+911234567890',
        ]);
    }
}
