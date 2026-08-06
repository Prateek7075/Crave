<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use App\Models\MenuCategory;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class CreateMenuCategoryService{
    /**
     * @param array<string,mixed> $attributes
     */

    public function create(Account $account, array $attributes): MenuCategory{
        $restaurant = $account->restaurant()->first();

        if($restaurant === null){
            throw new ModelNotFoundException();
        }

        return $restaurant->menuCategories()->create($attributes);
    }

}
