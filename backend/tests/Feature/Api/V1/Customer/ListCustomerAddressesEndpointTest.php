<?php

namespace Tests\Feature\Api\V1\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ListCustomerAddressesEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_customer_can_view_their_saved_addresses(): void
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

        $homeAddress = $profile
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

        $workAddress = $profile
            ->addresses()
            ->create([
                'label' => 'Work',
                'recipient_name' =>
                    'Prateek Sharma',
                'address_line_1' =>
                    'Office 12, Business Park',
                'latitude' =>
                    '30.7046486',
                'longitude' =>
                    '76.7178726',
            ]);

        $homeAddress->forceFill([
            'updated_at' => now()->subMinute(),
        ])->save();

        $this->actingAs(
            $account,
            'web',
        );

        $response = $this->getJson(
            '/api/v1/customer/addresses',
        );

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath(
                'data.0.id',
                $workAddress->id,
            )
            ->assertJsonPath(
                'data.0.label',
                'Work',
            )
            ->assertJsonPath(
                'data.1.id',
                $homeAddress->id,
            )
            ->assertJsonPath(
                'data.1.label',
                'Home',
            );
    }

    public function test_a_customer_cannot_view_another_customers_addresses(): void
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

        $secondProfile
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

        $response = $this->getJson(
            '/api/v1/customer/addresses',
        );

        $response
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_a_guest_cannot_view_saved_addresses(): void
    {
        $response = $this->getJson(
            '/api/v1/customer/addresses',
        );

        $response->assertUnauthorized();
    }
}
