<?php

namespace Tests\Feature\Services;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Services\Restaurant\CreateRestaurantService;
use App\Services\Restaurant\GetRestaurantService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class GetRestaurantServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_the_restaurant(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@test.com',
        ]);

        app(CreateRestaurantService::class)
            ->create(
                $owner,
                [
                    'name' => 'Crave',
                    'description' => null,
                ],
            );

        $restaurant = app(
            GetRestaurantService::class,
        )->get($owner);

        $this->assertSame(
            'Crave',
            $restaurant->name,
        );
    }
}
