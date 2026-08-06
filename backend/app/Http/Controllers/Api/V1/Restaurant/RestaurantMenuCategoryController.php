<?php

namespace App\Http\Controllers\Api\V1\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Restaurant\StoreMenuCategoryRequest;
use App\Http\Requests\Api\V1\Restaurant\UpdateMenuCategoryRequest;
use App\Http\Resources\MenuCategoryResource;
use App\Services\Restaurant\CreateMenuCategoryService;
use App\Services\Restaurant\DeleteMenuCategoryService;
use App\Services\Restaurant\GetMenuCategoriesService;
use App\Services\Restaurant\UpdateMenuCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RestaurantMenuCategoryController extends Controller
{
    public function index(Request $request, GetMenuCategoriesService $service): AnonymousResourceCollection{
        return MenuCategoryResource::collection($service->get($request->user()));
    }

    public function store(StoreMenuCategoryRequest $request, CreateMenuCategoryService $service): JsonResponse{
        return MenuCategoryResource::make($service->create($request->user(), $request->validated()))->response()->setStatusCode(201);
    }

    public function update(UpdateMenuCategoryRequest $request, int $categoryId, UpdateMenuCategoryService $service): JsonResponse{
        return MenuCategoryResource::make($service->update($request->user(), $categoryId, $request->validated()))->response();
    }

    public function destroy(Request $request, int $categoryId, DeleteMenuCategoryService $service): JsonResponse{
        $service->delete($request->user(), $categoryId);

        return response()->json(status: 204);
    }
}
