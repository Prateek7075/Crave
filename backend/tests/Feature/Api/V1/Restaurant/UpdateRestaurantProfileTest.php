<?php

namespace Tests\Feature\Api\V1\Restaurant;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Services\Restaurant\CreateRestaurantService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class UpdateRestaurantProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_complete_profile(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@test.com',
        ]);

        app(CreateRestaurantService::class)->create(
            $owner,
            [
                'name' => 'Initial Name',
                'description' => null,
            ],
        );

        Sanctum::actingAs($owner);

        $payload = [
            'name' => 'Crave Gourmet Kitchen',
            'description' => 'Fine dining experience.',
            'contactNumber' => '+919876543210',
            'contactEmail' => 'contact@crave.com',
            'addressLine1' => '123 Gourmet Street',
            'addressLine2' => 'Suite 100',
            'landmark' => 'Near Central Park',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'pincode' => '400001',
            'latitude' => 18.9226,
            'longitude' => 72.8333,
            'fssaiLicenseNumber' => '12345678901234',
            'gstin' => '22AAAAA0000A1Z5',
        ];

        $response = $this->putJson('/api/v1/restaurants/me', $payload);

        $response
            ->assertOk()
            ->assertJsonPath('data.name', $payload['name'])
            ->assertJsonPath('data.contactNumber', $payload['contactNumber'])
            ->assertJsonPath('data.pincode', $payload['pincode'])
            ->assertJsonPath('data.fssaiLicenseNumber', $payload['fssaiLicenseNumber']);

        $this->assertDatabaseHas('restaurants', [
            'owner_account_id' => $owner->id,
            'name' => $payload['name'],
            'contact_number' => $payload['contactNumber'],
            'city' => $payload['city'],
            'fssai_license_number' => $payload['fssaiLicenseNumber'],
            'gstin' => $payload['gstin'],
        ]);
    }

    public function test_it_validates_profile_fields(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@test.com',
        ]);

        app(CreateRestaurantService::class)->create($owner, ['name' => 'Test']);

        Sanctum::actingAs($owner);

        $response = $this->putJson('/api/v1/restaurants/me', [
            'contactNumber' => 'invalid',
            'pincode' => '123',
            'latitude' => 100, // Invalid range
            'fssaiLicenseNumber' => '123',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonPath('error.details.fields.contactNumber.0', 'The contact number field format is invalid.')
            ->assertJsonPath('error.details.fields.pincode.0', 'The pincode field format is invalid.')
            ->assertJsonPath('error.details.fields.latitude.0', 'The latitude field must be between -90 and 90.')
            ->assertJsonPath('error.details.fields.fssaiLicenseNumber.0', 'The fssai license number field format is invalid.');
    }
}
