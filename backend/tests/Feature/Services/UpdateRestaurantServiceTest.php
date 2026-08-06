<?php

namespace Tests\Feature\Services;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Services\Restaurant\CreateRestaurantService;
use App\Services\Restaurant\UpdateRestaurantService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class UpdateRestaurantServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_updates_the_restaurant(): void
    {
        $owner = Account::query()->create([
            'role' => AccountRole::RestaurantOwner,
            'status' => AccountStatus::Active,
            'email' => 'owner@test.com',
        ]);

        $restaurant = app(CreateRestaurantService::class)->create(
            $owner,
            [
                'name' => 'Old Name',
                'description' => null,
            ],
        );

        $updated = app(UpdateRestaurantService::class)->update(
            $owner,
            [
                'name' => 'New Name',
                'description' => 'Updated Description',
            ],
        );

        $this->assertSame(
            $restaurant->id,
            $updated->id,
        );

        $this->assertSame(
            'New Name',
            $updated->name,
        );

        $this->assertSame(
            'Updated Description',
            $updated->description,
        );
    }
}
