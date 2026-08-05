<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\AccountRole;
use App\Exceptions\ApiException;
use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class CurrentCustomerController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $account = $request->user();

        if(!$account instanceof Account){
            throw new RuntimeException(
                'Authenticated identity is not an Account.'
            );
        }

        if($account->role !== AccountRole::Customer){
            throw new ApiException(
                errorCode : 'CUSTOMER_ACCESS_REQUIRED',
                message    : 'This endpoint is available only to customer accounts.',
                statusCode : 403,
            );
        }

        $account->loadMissing('customerProfile');

        $customerProfile = $account->customerProfile;

        if($customerProfile === null){
            throw new RuntimeException(
                'Authenticated customer profile is missing.'
            );
        }

        return response()->json([
            'authenticated' => true,

            'account' => [
                'id' => $account->id,
                'role' => $account->role,
                'mobile' => $account->mobile,
            ],
            'customerProfile' => [
                'fullName' => $customerProfile->full_name,
            ]
        ]);
    }
}
