<?php

namespace Tests\Feature\Api\V1\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class UpdateCustomerAddressEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_customer_can_update_their_address(): void
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
                    'Old Address',
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
            ]);

        $this->actingAs(
            $account,
            'web',
        );

        $response = $this->putJson(
            "/api/v1/customer/addresses/{$address->id}",
            [
                'label' => '  Work  ',
                'recipient_name' =>
                    '  Prateek Sharma  ',
                'address_line_1' =>
                    '  Office 12, Business Park  ',
                'address_line_2' => '   ',
                'landmark' =>
                    '  Main Gate  ',
                'latitude' =>
                    '30.7046486',
                'longitude' =>
                    '76.7178726',
                'delivery_instructions' =>
                    '  Call on arrival.  ',
            ],
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.id',
                $address->id,
            )
            ->assertJsonPath(
                'data.label',
                'Work',
            )
            ->assertJsonPath(
                'data.addressLine1',
                'Office 12, Business Park',
            )
            ->assertJsonPath(
                'data.addressLine2',
                null,
            )
            ->assertJsonPath(
                'data.landmark',
                'Main Gate',
            )
            ->assertJsonPath(
                'data.deliveryInstructions',
                'Call on arrival.',
            );

        $this->assertDatabaseHas(
            'customer_addresses',
            [
                'id' => $address->id,
                'customer_profile_id' =>
                    $profile->id,
                'label' => 'Work',
                'address_line_1' =>
                    'Office 12, Business Park',
                'address_line_2' => null,
                'landmark' => 'Main Gate',
            ],
        );
    }

    public function test_a_customer_cannot_update_another_customers_address(): void
    {
        $firstAccount = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $firstAccount
            ->customerProfile()
            ->create([
                'full_name' => 'First Customer',
            ]);

        $secondAccount = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543211',
        ]);

        $secondProfile = $secondAccount
            ->customerProfile()
            ->create([
                'full_name' => 'Second Customer',
            ]);

        $address = $secondProfile
            ->addresses()
            ->create([
                'label' => 'Home',
                'recipient_name' =>
                    'Second Customer',
                'address_line_1' =>
                    'Second Customer Address',
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
            ]);

        $this->actingAs(
            $firstAccount,
            'web',
        );

        $response = $this->putJson(
            "/api/v1/customer/addresses/{$address->id}",
            [
                'label' => 'Work',
                'recipient_name' =>
                    'First Customer',
                'address_line_1' =>
                    'Unauthorized Update',
                'address_line_2' => null,
                'landmark' => null,
                'latitude' =>
                    '30.7046486',
                'longitude' =>
                    '76.7178726',
                'delivery_instructions' => null,
            ],
        );

        $response->assertNotFound();

        $this->assertDatabaseHas(
            'customer_addresses',
            [
                'id' => $address->id,
                'label' => 'Home',
                'address_line_1' =>
                    'Second Customer Address',
            ],
        );
    }

    public function test_a_guest_cannot_update_an_address(): void
    {
        $response = $this->putJson(
            '/api/v1/customer/addresses/999',
            [
                'label' => 'Home',
                'recipient_name' =>
                    'Prateek Sharma',
                'address_line_1' =>
                    'House 21',
                'address_line_2' => null,
                'landmark' => null,
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
                'delivery_instructions' => null,
            ],
        );

        $response->assertUnauthorized();
    }
}
