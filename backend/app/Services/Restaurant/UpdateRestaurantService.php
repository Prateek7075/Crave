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
     *     description?: string|null,
     *     contact_number?: string|null,
     *     contact_email?: string|null,
     *     address_line_1?: string|null,
     *     address_line_2?: string|null,
     *     landmark?: string|null,
     *     city?: string|null,
     *     state?: string|null,
     *     pincode?: string|null,
     *     latitude?: float|null,
     *     longitude?: float|null,
     *     fssai_license_number?: string|null,
     *     gstin?: string|null
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

            $fields = [
                'description', 'contact_number', 'contact_email',
                'address_line_1', 'address_line_2', 'landmark',
                'city', 'state', 'pincode',
                'latitude', 'longitude',
                'fssai_license_number', 'gstin'
            ];

            foreach ($fields as $field) {
                if (array_key_exists($field, $attributes)) {
                    $data[$field] = $attributes[$field];
                }
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
