<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\CustomerRequestCodeRequest;
use App\Services\Auth\CustomerRequestCodeService;
use Illuminate\Http\JsonResponse;

class CustomerRequestCodeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(CustomerRequestCodeRequest $request, CustomerRequestCodeService $service): JsonResponse
    {
        /**
         * @var array{
         *     mobile: string,
         *     fullName?: string
         * } $validated
         */
        $validated = $request->validated();

        $result = $service->handle(mobile: $validated['mobile'], fullName: $validated['fullName'] ?? null,);

        return response()->json($result);
    }
}
