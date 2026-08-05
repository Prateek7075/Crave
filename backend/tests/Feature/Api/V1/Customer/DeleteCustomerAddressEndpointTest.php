<?php

namespace Tests\Feature\Api\V1\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DeleteCustomerAddressEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_customer_can_delete_their_address(): void
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
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
            ]);

        $this->actingAs(
            $account,
            'web',
        );

        $response = $this->deleteJson(
            "/api/v1/customer/addresses/{$address->id}",
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing(
            'customer_addresses',
            [
                'id' => $address->id,
            ],
        );
    }

    public function test_a_customer_cannot_delete_another_customers_address(): void
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

        $secondAddress = $secondProfile
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

        $response = $this->deleteJson(
            "/api/v1/customer/addresses/{$secondAddress->id}",
        );

        $response->assertNotFound();

        $this->assertDatabaseHas(
            'customer_addresses',
            [
                'id' => $secondAddress->id,
            ],
        );
    }

    public function test_a_guest_cannot_delete_an_address(): void
    {
        $response = $this->deleteJson(
            '/api/v1/customer/addresses/999',
        );

        $response->assertUnauthorized();
    }
}
