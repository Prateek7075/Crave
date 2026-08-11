<?php

namespace App\Services\Restaurant;

use App\Models\Account;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class UpdateRestaurantService{

    /**
     * @param array{
     *     name?: string,
     *     description?: string|null
     * } $attributes
     */
    public function update(Account $account, array $attributes): Restaurant{
        return DB::transaction(function () use ( $account, $attributes){
            $restaurant = $account->restaurant()->lockForUpdate()->firstOrFail();

            $data =[];

            if(isset($attributes['name']) && $attributes['name'] !== $restaurant->name){
                $data['name'] = $attributes['name'];
                $data['slug'] = $this->generateUniqueSlug($attributes['name'], $restaurant->id);
            }

            if(array_key_exists('description', $attributes)){
                $data['description'] = $attributes['description'];
            }

            if(!empty($data)){
                $restaurant->update($data);
            }

            return $restaurant->refresh();
        });
    }

    private function generateUniqueSlug(string $name, int $restaurantId): string
    {
        $baseSlug = Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug = 'restaurant';
        }

        $slug = $baseSlug;
        $suffix = 2;

        while (Restaurant::query()->where('slug', $slug)->where('id', '!=', $restaurantId)->exists()) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
