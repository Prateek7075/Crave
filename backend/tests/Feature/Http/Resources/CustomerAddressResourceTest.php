<?php

namespace Tests\Feature\Http\Resources;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Http\Resources\Api\V1\CustomerAddressResource;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

final class CustomerAddressResourceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::get(
            '/testing/customer-address-resource/{addressId}',
            function (
                int $addressId,
            ): CustomerAddressResource {
                $address = \App\Models\CustomerAddress::query()
                    ->findOrFail($addressId);

                return CustomerAddressResource::make(
                    $address,
                );
            },
        );
    }

    public function test_it_transforms_a_customer_address(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $profile = $account
            ->customerProfile()
            ->create([
                'full_name' => 'Prateek Sharma',
            ]);

        $address = $profile
            ->addresses()
            ->create([
                'label' => 'Home',
                'recipient_name' =>
                    'Prateek Sharma',
                'address_line_1' =>
                    'House 21, Sector 10',
                'address_line_2' =>
                    'Near Main Market',
                'landmark' =>
                    'Community Centre',
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
                'delivery_instructions' =>
                    'Call at the main gate.',
            ]);

        $response = $this->getJson(
            "/testing/customer-address-resource/{$address->id}",
        );

        $response->dump();
        $response
            ->assertOk()
            ->assertJsonPath(
                'data.id',
                $address->id,
            )
            ->assertJsonPath(
                'data.label',
                'Home',
            )
            ->assertJsonPath(
                'data.recipientName',
                'Prateek Sharma',
            )
            ->assertJsonPath(
                'data.addressLine1',
                'House 21, Sector 10',
            )
            ->assertJsonPath(
                'data.addressLine2',
                'Near Main Market',
            )
            ->assertJsonPath(
                'data.landmark',
                'Community Centre',
            )
            ->assertJsonPath(
                'data.latitude',
                '30.7333148',
            )
            ->assertJsonPath(
                'data.longitude',
                '76.7794179',
            )
            ->assertJsonPath(
                'data.deliveryInstructions',
                'Call at the main gate.',
            )
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'label',
                    'recipientName',
                    'addressLine1',
                    'addressLine2',
                    'landmark',
                    'latitude',
                    'longitude',
                    'deliveryInstructions',
                    'createdAt',
                    'updatedAt',
                ],
            ]);
    }
}
