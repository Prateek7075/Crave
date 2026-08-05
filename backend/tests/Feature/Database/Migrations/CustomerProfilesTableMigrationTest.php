<?php

namespace Tests\Feature\Database\Migrations;

use App\Enums\AccountRole;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

final class CustomerProfilesTableMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_profiles_table_contains_the_required_columns(): void
    {
        $this->assertTrue(
            Schema::hasColumns('customer_profiles', [
                'id',
                'account_id',
                'full_name',
                'created_at',
                'updated_at',
            ]),
        );
    }

    public function test_an_account_can_have_only_one_customer_profile(): void
    {
        $accountId = DB::table('accounts')->insertGetId([
            'role' => AccountRole::Customer->value,
            'mobile' => '+919876543210',
        ]);

        DB::table('customer_profiles')->insert([
            'account_id' => $accountId,
            'full_name' => 'Prateek Sharma',
        ]);

        $this->expectException(QueryException::class);

        DB::table('customer_profiles')->insert([
            'account_id' => $accountId,
            'full_name' => 'Another Customer',
        ]);
    }

    public function test_customer_profile_requires_an_existing_account(): void
    {
        $this->expectException(QueryException::class);

        DB::table('customer_profiles')->insert([
            'account_id' => 999999,
            'full_name' => 'Missing Account',
        ]);
    }

    public function test_customer_profile_is_deleted_when_its_account_is_deleted(): void
    {
        $accountId = DB::table('accounts')->insertGetId([
            'role' => AccountRole::Customer->value,
            'mobile' => '+919876543210',
        ]);

        DB::table('customer_profiles')->insert([
            'account_id' => $accountId,
            'full_name' => 'Prateek Sharma',
        ]);

        DB::table('accounts')
            ->where('id', $accountId)
            ->delete();

        $this->assertDatabaseMissing('customer_profiles', [
            'account_id' => $accountId,
        ]);
    }
}
