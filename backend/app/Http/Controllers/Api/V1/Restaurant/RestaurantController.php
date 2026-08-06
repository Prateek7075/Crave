<?php

namespace App\Http\Controllers\Api\V1\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Restaurant\StoreRestaurantRequest;
use App\Http\Requests\Api\V1\Restaurant\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use App\Services\Restaurant\CreateRestaurantService;
use App\Services\Restaurant\GetRestaurantService;
use App\Services\Restaurant\UpdateRestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class RestaurantController extends Controller
{
    public function store(StoreRestaurantRequest $request, CreateRestaurantService $service): JsonResponse{
        $restaurant = $service->create($request->user(), $request->validated());

        return RestaurantResource::make($restaurant)->response()->setStatusCode(201);
    }

    public function show(Request $request, GetRestaurantService $service): JsonResponse{
        return RestaurantResource::make($service->get($request->user()))->response()->setStatusCode(200);
    }

    public function update(UpdateRestaurantRequest $request, UpdateRestaurantService $service): JsonResponse{
        return RestaurantResource::make($service->update($request->user(), $request->validated()))->response()->setStatusCode(200);
    }
}
