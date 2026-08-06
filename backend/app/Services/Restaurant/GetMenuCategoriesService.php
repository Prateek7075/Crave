<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class GetMenuCategoriesService{
    /**
     * @return Collection<int,\App\Models\MenuCategory>
     */
    public function get(Account $account): Collection{
        $restaurant = $account->restaurant()->first();

        if($restaurant === null){
            throw new ModelNotFoundException();
        }

        return $restaurant->menuCategories()->orderBy('display_order')->orderBy('id')->get();
    }
}
