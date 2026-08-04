<?php

namespace App\Http\Controllers\Api\V1\Health;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\Health\ReadinessCheckService;

class ReadyHealthCheckController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ReadinessCheckService $service):JsonResponse
    {
        $result = $service->check();

        return response()->json([
            'status' => $result['ready'] ? 'ready' : 'not ready',
            'service' => 'crave-api',
            'checks' => $result['checks'],
            ],
            $result['ready'] ? 200 : 503,
        );
    }
}
