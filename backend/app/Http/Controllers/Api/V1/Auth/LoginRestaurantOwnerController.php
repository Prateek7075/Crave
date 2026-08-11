<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRestaurantOwnerRequest;
use App\Services\Auth\LoginRestaurantOwnerService;
use Illuminate\Http\JsonResponse;

class LoginRestaurantOwnerController extends Controller
{
    public function __invoke(LoginRestaurantOwnerRequest $request, LoginRestaurantOwnerService $service): JsonResponse{
        $account = $service->authenticate($request->validated());

        auth()->login($account);

        return response()->json([
            'message' => 'Logged in successfully.',
            'account' => [
                'id' => $account->id,
                'role' => $account->role->value,
                'email' => $account->email,
            ],
        ]);
    }
}
