<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use App\Models\MenuCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

final class MenuCategoryService{

    /**
     * @return Collection<int, MenuCategory>
     */
    public function list(Account $account): Collection{

        $restaurant = $account->restaurant()->firstOrFail();

        return MenuCategory::query()
            ->where('restaurant_id', $restaurant->id)
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();
    }

    /**
     * @param array{
     *     name: string,
     *     description?: string|null,
     *     display_order?: int,
     *     is_active?: bool
     * } $attributes
     */
    public function create(Account $account, array $attributes): MenuCategory{
        return DB::transaction(function() use ($attributes, $account): MenuCategory {
           $restaurant = $account->restaurant()->lockForUpdate()->firstOrFail();

           $category = MenuCategory::query()->create([
               'restaurant_id' => $restaurant->id,
               'name' => $attributes['name'],
               'description' => $attributes['description'] ?? null,
               'display_order' => $attributes['display_order'] ?? 0,
               'is_active' => $attributes['is_active'] ?? true,
           ]);

           return $category->refresh();
        });
    }

    /**
     * @param array{
     *     name?: string,
     *     description?: string|null,
     *     display_order?: int,
     *     is_active?: bool
     * } $attributes
     */
    public function update(Account $account, int $categoryId, array $attributes): MenuCategory{
        return DB::transaction(function() use ($categoryId, $account, $attributes): MenuCategory{
             $restaurant = $account->restaurant()->lockForUpdate()->firstOrFail();

             $category = MenuCategory::query()
                 ->where('restaurant_id', $restaurant->id)
                 ->where('id', $categoryId)
                 ->firstOrFail();

             $category->update($attributes);

             return $category->refresh();
        });
    }

    public function delete(Account $account, int $categoryId): void{
        DB::transaction(function() use ($categoryId, $account): void{
            $restaurant = $account->restaurant()->lockForUpdate()->firstOrFail();

            $category = MenuCategory::query()
                ->where('restaurant_id', $restaurant->id)
                ->where('id', $categoryId)
                ->firstOrFail();

            $category->delete();
        });
    }
}
