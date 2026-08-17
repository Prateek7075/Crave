<?php

namespace App\Services\Restaurant;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Exceptions\RestaurantAlreadyExistsException;
use App\Models\Account;
use App\Models\Restaurant;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class CreateRestaurantService
{
    /**
     * @param array{
     *     name: string,
     *     description: string|null
     * } $attributes
     */
    public function create(Account $account, array $attributes): Restaurant
    {
        return DB::transaction(function () use ($attributes, $account): Restaurant {
            $lockedAccount = Account::query()
                ->whereKey($account->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedAccount->role !== AccountRole::RestaurantOwner || $lockedAccount->status !== AccountStatus::Active) {
                throw new AuthorizationException('Only active restaurant owners can create a restaurant.');
            }

            if ($lockedAccount->restaurant()->exists()) {
                throw new RestaurantAlreadyExistsException();
            }

            $restaurant = $lockedAccount->restaurant()->create([
                'name' => $attributes['name'],
                'slug' => $this->generateUniqueSlug($attributes['name']),
                'description' => $attributes['description'] ?? null,
            ]);

            return $restaurant->refresh();
        });
    }

    private function generateUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug = 'restaurant';
        }

        $slug = $baseSlug;
        $suffix = 2;

        while (Restaurant::query()->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
