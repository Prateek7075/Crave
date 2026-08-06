<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use App\Models\Restaurant;
use Illuminate\Auth\Access\AuthorizationException;

final class GetRestaurantService{
    public function get(Account $account): Restaurant{
        if($account->restaurant() === null){
            throw new AuthorizationException('Restaurant not found');
        }
        return $account->restaurant()->firstOrFail();
    }
}
