<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class DeleteMenuCategoryService{

    public function delete(Account $account, int $categoryId,): void{
        $restaurant = $account->restaurant()->first();

        if($restaurant === null){
            throw new ModelNotFoundException();
        }

        $menuCategory = $restaurant->menuCategories()->findOrFail($categoryId)->delete();
    }
}
