<?php

namespace App\Services\Restaurant;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Models\Restaurant;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use LogicException;
use App\Exceptions\RestaurantAlreadyExistsException;

final class CreateRestaurantService{

    /**
     * @param array{
     *     name: string,
     *     description: string|null
     * } $attributes
     *
     * @throws AuthorizationException
     * @throws LogicException
     */

    public function create(Account $account, array $attributes): Restaurant{
        return DB::transaction(function () use ($attributes, $account) {
            $lockedAccount = Account::query()->whereKey($account->id)->lockForUpdate()->firstOrFail();

            if($lockedAccount->role !== AccountRole::RestaurantOwner || $lockedAccount->status !== AccountStatus::Active){
                throw new AuthorizationException(
                    'Only active restaurant owners can create a restaurant.'
                );
            }

            if($lockedAccount->restaurant()->exists()){
                throw new HttpResponseException(
                    response()->json([
                        'error' => [
                            'code' => 'RESTAURANT_ALREADY_EXISTS',
                            'message' => 'The restaurant owner already has a restaurant.',
                        ],
                    ], 409)
                );
            }

            $restaurant = $lockedAccount->restaurant()->create([
                'name' => $attributes['name'],

                'slug' =>$this->generateUniqueSlug($attributes['name']),

                'description' => $attributes['description'],
            ]);

            return $restaurant->refresh();
        });
    }

    private function generateUniqueSlug(string $name): string{
        $baseSlug = Str::slug($name);

        if($baseSlug === ''){
            $baseSlug = 'restaurant';
        }

        $slug = $baseSlug;

        $suffix = 2;

        while(Restaurant::query()->where('slug', $slug)->exists()){
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}

