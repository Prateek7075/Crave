<?php

namespace Tests\Feature\Api\V1\Restaurant;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Services\Restaurant\CreateRestaurantService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class UpdateRestaurantEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_restaurant(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@test.com',
        ]);

        app(CreateRestaurantService::class)->create(
            $owner,
            [
                'name' => 'Old Name',
                'description' => null,
            ],
        );

        Sanctum::actingAs($owner);

        $response = $this->putJson(
            '/api/v1/restaurants/me',
            [
                'name' => 'New Name',
                'description' => 'Updated',
            ],
        );

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas(
            'restaurants',
            [
                'name' => 'New Name',
                'description' => 'Updated',
            ],
        );
    }

    public function test_guest_cannot_update_restaurant(): void
    {
        $this->putJson(
            '/api/v1/restaurants/me',
            [
                'name' => 'Test',
            ],
        )->assertUnauthorized();
    }

    public function test_owner_without_restaurant_gets_not_found(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@test.com',
        ]);

        Sanctum::actingAs($owner);

        $this->putJson(
            '/api/v1/restaurants/me',
            [
                'name' => 'Test',
            ],
        )->assertNotFound();
    }
}
