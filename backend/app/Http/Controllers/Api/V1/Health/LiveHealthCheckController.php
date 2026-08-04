<?php

namespace App\Http\Controllers\Api\V1\Health;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

final class LiveHealthCheckController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => 'crave-api',
        ]);
    }
}
