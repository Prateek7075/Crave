<?php

namespace App\Http\Controllers\Api\V1\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Restaurant\StoreMenuCategoryRequest;
use App\Http\Requests\Api\V1\Restaurant\UpdateMenuCategoryRequest;
use App\Services\Restaurant\MenuCategoryService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RestaurantMenuCategoryController extends Controller
{
    public function index(MenuCategoryService $service): JsonResponse{

        $account = auth()->user();

        $categories = $service->list($account);

        return response()->json([
           'data' => $categories->map(fn ($category) => [
               'id' => $category->id,
               'name' => $category->name,
               'description' => $category->description,
               'display_order' => $category->display_order,
               'is_active' => $category->is_active,
           ])
        ]);
    }

    public function store(StoreMenuCategoryRequest $request, MenuCategoryService $service): JsonResponse{
        $account = auth()->user();
        $category = $service->create($account, $request->validated());

        return response()->json([
            'message' => 'Menu Category created successfully.',
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'display_order' => $category->display_order,
                'is_active' => $category->is_active,
            ]
        ], Response::HTTP_CREATED);
    }

    public function update(UpdateMenuCategoryRequest $request, int $categoryId, MenuCategoryService $service): JsonResponse{
        $account = auth()->user();
        $category = $service->update($account, $categoryId, $request->validated());

        return response()->json([
            'message' => 'Menu Category updated successfully.',
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'display_order' => $category->display_order,
                'is_active' => $category->is_active,
            ]
        ]);
    }

    public function destroy(int $categoryId, MenuCategoryService $service): JsonResponse{
        $account = auth()->user();
        $service->delete($account, $categoryId);

        return response()->json([
            'message' => 'Menu Category deleted successfully.',
        ], Response::HTTP_OK);
    }
}
