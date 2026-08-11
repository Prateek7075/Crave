<?php

namespace Tests\Feature\Services;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Enums\RestaurantOperatingStatus;
use App\Enums\RestaurantVerificationStatus;
use App\Exceptions\RestaurantAlreadyExistsException;
use App\Models\Account;
use App\Services\Restaurant\CreateRestaurantService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class CreateRestaurantServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_draft_restaurant_for_an_active_owner(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
        ]);

        $service = app(CreateRestaurantService::class);

        $restaurant = $service->create($account, [
            'name' => 'Crave Test Kitchen',
            'description' => 'Fresh meals prepared daily.',
        ]);

        $this->assertSame($account->id, $restaurant->owner_account_id);
        $this->assertSame('Crave Test Kitchen', $restaurant->name);
        $this->assertSame('crave-test-kitchen', $restaurant->slug);
        $this->assertSame(RestaurantVerificationStatus::Draft, $restaurant->verification_status);
        $this->assertSame(RestaurantOperatingStatus::Closed, $restaurant->operating_status);

        $this->assertDatabaseHas('restaurants', [
            'id' => $restaurant->id,
            'owner_account_id' => $account->id,
            'name' => 'Crave Test Kitchen',
            'slug' => 'crave-test-kitchen',
            'description' => 'Fresh meals prepared daily.',
            'verification_status' => RestaurantVerificationStatus::Draft->value,
            'operating_status' => RestaurantOperatingStatus::Closed->value,
        ]);
    }

    public function test_it_generates_a_unique_slug_for_restaurants_with_the_same_name(): void
    {
        $firstAccount = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'first@example.com',
        ]);

        $secondAccount = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'second@example.com',
        ]);

        $service = app(CreateRestaurantService::class);

        $firstRestaurant = $service->create($firstAccount, [
            'name' => 'Crave Test Kitchen',
            'description' => null,
        ]);

        $secondRestaurant = $service->create($secondAccount, [
            'name' => 'Crave Test Kitchen',
            'description' => null,
        ]);

        $this->assertSame('crave-test-kitchen', $firstRestaurant->slug);
        $this->assertSame('crave-test-kitchen-2', $secondRestaurant->slug);
    }

    public function test_an_owner_cannot_create_more_than_one_restaurant(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@example.com',
        ]);

        $service = app(CreateRestaurantService::class);

        $service->create($account, [
            'name' => 'First Restaurant',
            'description' => null,
        ]);

        $this->expectException(RestaurantAlreadyExistsException::class);
        $this->expectExceptionMessage('The restaurant owner already has a restaurant.');

        $service->create($account, [
            'name' => 'Second Restaurant',
            'description' => null,
        ]);
    }

    public function test_a_customer_cannot_create_a_restaurant(): void
    {
        $account = Account::query()->create([
            'role' => AccountRole::Customer,
            'status' => AccountStatus::Active,
            'mobile' => '+919876543210',
        ]);

        $service = app(CreateRestaurantService::class);

        $this->expectException(AuthorizationException::class);

        $service->create($account, [
            'name' => 'Unauthorized Restaurant',
            'description' => null,
        ]);
    }
}
