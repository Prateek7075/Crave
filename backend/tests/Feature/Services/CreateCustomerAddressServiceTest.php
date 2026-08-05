<?php

namespace Tests\Feature\Services;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Services\Customer\CreateCustomerAddressService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CreateCustomerAddressServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_address_for_an_active_customer(): void
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

        $service = app(
            CreateCustomerAddressService::class,
        );

        $address = $service->create(
            $account->fresh(),
            [
                'label' => 'Home',
                'recipient_name' =>
                    'Prateek Sharma',
                'address_line_1' =>
                    'House 21, Sector 10',
                'address_line_2' => null,
                'landmark' =>
                    'Community Centre',
                'latitude' =>
                    '30.7333148',
                'longitude' =>
                    '76.7794179',
                'delivery_instructions' =>
                    'Call at the main gate.',
            ],
        );

        $this->assertSame(
            $profile->id,
            $address->customer_profile_id,
        );

        $this->assertSame(
            'Home',
            $address->label,
        );

        $this->assertDatabaseHas(
            'customer_addresses',
            [
                'id' => $address->id,
                'customer_profile_id' =>
                    $profile->id,
                'recipient_name' =>
                    'Prateek Sharma',
                'address_line_1' =>
                    'House 21, Sector 10',
            ],
        );
    }
}
