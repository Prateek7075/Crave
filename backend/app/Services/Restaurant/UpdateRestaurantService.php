<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class UpdateRestaurantService{
    /**
     * @param array<string,mixed> $attributes
     */

    public function update(Account $account, array $attributes): Restaurant{
        $restaurant = $account->restaurant()->first();

        if($restaurant === null){
            throw new ModelNotFoundException();
        }

        $restaurant->fill($attributes);

         $restaurant->save();

         return $restaurant->refresh();
    }
}
