<?php

namespace Tests\Feature\Api\V1\Restaurant;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Enums\RestaurantOperatingStatus;
use App\Enums\RestaurantVerificationStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class CreateRestaurantEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_restaurant_owner_can_create_a_restaurant(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
        ]);

        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/v1/restaurants', [
            'name' => 'Crave Test Kitchen',
            'description' => 'Fresh meals prepared daily.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.name', 'Crave Test Kitchen')
            ->assertJsonPath('data.slug', 'crave-test-kitchen')
            ->assertJsonPath('data.verificationStatus', RestaurantVerificationStatus::Draft->value)
            ->assertJsonPath('data.operatingStatus', RestaurantOperatingStatus::Closed->value);

        $this->assertDatabaseHas('restaurants', [
            'owner_account_id' => $owner->id,
            'name' => 'Crave Test Kitchen',
            'slug' => 'crave-test-kitchen',
        ]);
    }

    public function test_a_customer_cannot_create_a_restaurant(): void
    {
        $customer = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919999999999',
        ]);

        Sanctum::actingAs($customer);

        $response = $this->postJson('/api/v1/restaurants', [
            'name' => 'Illegal Restaurant',
            'description' => null,
        ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('restaurants', [
            'name' => 'Illegal Restaurant',
        ]);
    }

    public function test_a_guest_cannot_create_a_restaurant(): void
    {
        $response = $this->postJson('/api/v1/restaurants', [
            'name' => 'Guest Restaurant',
        ]);

        $response->assertUnauthorized();
    }

    public function test_an_owner_cannot_create_more_than_one_restaurant(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
        ]);

        Sanctum::actingAs($owner);

        $this->postJson('/api/v1/restaurants', [
            'name' => 'First Restaurant',
        ])->assertCreated();

        $response = $this->postJson('/api/v1/restaurants', [
            'name' => 'Second Restaurant',
        ]);

        $response
            ->assertConflict()
            ->assertJsonPath('error.code', 'RESTAURANT_ALREADY_EXISTS')
            ->assertJsonPath('error.message', 'The restaurant owner already has a restaurant.');

        $this->assertDatabaseCount('restaurants', 1);
    }
}
