<?php

namespace App\Http\Controllers\Api\V1\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Restaurant\StoreRestaurantRequest;
use App\Http\Requests\Api\V1\Restaurant\UpdateRestaurantRequest;
use App\Services\Restaurant\CreateRestaurantService;
use App\Services\Restaurant\UpdateRestaurantService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
final class RestaurantController extends Controller
{
    public function show() : JsonResponse
        /** @var \App\Models\Account $account */
    {
        $account = auth()->user();

        $restaurant = $account->restaurant()->first();

        if($restaurant === null) {
            return response()->json([
                'error' => [
                    'code' => 'RESTAURANT_NOT_FOUND',
                    'message' => 'No restaurant profile found for this account.',
                ]
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'data' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'slug' => $restaurant->slug,
                'description' => $restaurant->description,
                'verification_status' => $restaurant->verification_status,
                'operating_status' => $restaurant->operating_status,
            ]
        ]);
    }

    public function store(StoreRestaurantRequest $request, CreateRestaurantService $service) : JsonResponse{
        /** @var \App\Models\Account $account */

        $account = auth()->user();
        $restaurant = $service->create($account, $request->validated());

        return response()->json([
            'message' => 'Restaurant successfully created.',
            'data' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'slug' => $restaurant->slug,
                'description' => $restaurant->description,
                'verification_status' => $restaurant->verification_status,
                'operating_status' => $restaurant->operating_status,
            ],
        ], Response::HTTP_CREATED);
    }

    public function update(UpdateRestaurantRequest $request, UpdateRestaurantService $service) : JsonResponse{
        /** @var \App\Models\Account $account */

        $account = auth()->user();
        $restaurant = $service->update($account, $request->validated());

        return response()->json([
            'message' => 'Restaurant updated successfully.',
            'data' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'slug' => $restaurant->slug,
                'description' => $restaurant->description,
                'verification_status' => $restaurant->verification_status,
                'operating_status' => $restaurant->operating_status,
            ]
        ]);
    }
}
