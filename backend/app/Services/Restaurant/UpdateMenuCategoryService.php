<?php
namespace App\Services\Restaurant;

use App\Models\Account;
use App\Models\MenuCategory;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class UpdateMenuCategoryService{

    public function update(Account $account, int $categoryId, array $attributes): MenuCategory{
        $restaurant = $account->restaurant()->first();

        if($restaurant === null){
            throw new ModelNotFoundException();
        }

        $category = $restaurant->menuCategories()->findOrFail($categoryId);

        $category->fill($attributes);

        $category->save();

        return $category->refresh();
    }
}
