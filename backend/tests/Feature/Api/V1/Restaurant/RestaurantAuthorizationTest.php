<?php

namespace Tests\Feature\Api\V1\Restaurant;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class RestaurantAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_restaurant_management_routes(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $this->actingAs($account)->getJson('/api/v1/restaurants/me')->assertForbidden();
    }

    public function test_restaurant_owner_can_access_restaurant_management_routes(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
            'password_hash' => bcrypt('password'),
        ]);

        $this->actingAs($account)->getJson('/api/v1/restaurants/me')->assertNotFound();
    }
}
