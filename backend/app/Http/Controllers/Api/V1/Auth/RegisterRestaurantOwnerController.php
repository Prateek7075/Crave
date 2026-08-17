<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\RegisterRestaurantOwnerRequest;
use App\Services\Auth\RegisterRestaurantOwnerService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RegisterRestaurantOwnerController extends Controller
{
    public function __invoke(RegisterRestaurantOwnerRequest $request, RegisterRestaurantOwnerService $service): JsonResponse{
        $account = $service->register($request->validated());

        auth()->login($account);
        request()->session()->regenerate();

        return response()->json([
            'message' => 'Restaurant owner account registered successfully.',
            'account' => [
                'id' => $account->id,
                'role' => $account->role->value,
                'email' => $account->email
            ]
        ], Response::HTTP_CREATED);
    }
}
