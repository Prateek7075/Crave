<?php

namespace App\Services\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

final class RegisterRestaurantOwnerService{

    /**
     * @param array{
     *     name: string,
     *     email: string,
     *     mobile?: string,
     *     password: string
     * } $attributes
     */
    public function register(array $attributes): Account{
        return DB::transaction(function () use ($attributes): Account {

            // 1. Create the Account safely using null coalescing for optional/unvalidated fields
            $account = Account::query()->create([
                'role' => AccountRole::RestaurantOwner,
                'status' => AccountStatus::Active,
                'email' => $attributes['email'] ?? null,
                'mobile' => $attributes['mobile'] ?? null,
                'password_hash' => Hash::make($attributes['password']),
            ]);

            // 2. Create the Restaurant Profile using the business name
            Restaurant::query()->create([
                'owner_account_id' => $account->id,
                'name' => $attributes['name'],
                'slug' => Str::slug($attributes['name']),
            ]);

            return $account->refresh();
        });
    }
}
