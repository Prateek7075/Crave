<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Data\Auth\CustomerVerificationResult;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\CustomerVerifyCodeRequest;
use App\Services\Auth\CustomerVerifyCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

class CustomerVerifyCodeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(CustomerVerifyCodeRequest $request, CustomerVerifyCodeService $service): JsonResponse{
        /**
         * @var array{
         *     challengeId : string,
         *     code: string
         * } $validated
         */
        $validated = $request->validated();

        $result = $service->handle(challengeId: $validated['challengeId'], code: $validated['code']);

        $account = $result->account;
        $account->loadMissing('customerProfile');

        $customerProfile = $account->customerProfile;

        if($customerProfile == null){
            throw new RuntimeException('Authenticated customer profile is missing.');
        }

        Auth::guard('web')->login($account);

        $request->session()->regenerate();

        return response()->json([
            'authenticated' => true,
            'registeredNow' => $result->registeredNow,
            'account' => [
                'id' => $account->id,
                'role' => $account->role,
                'mobile' => $account->mobile
            ],

            'customerProfile' => [
                'fullName' => $customerProfile->full_name,
            ]
        ]);
    }
}
