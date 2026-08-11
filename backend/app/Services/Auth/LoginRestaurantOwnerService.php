<?php
namespace App\Services\Auth;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Exceptions\ApiException;
use App\Models\Account;
use Illuminate\Support\Facades\Hash;

final class LoginRestaurantOwnerService{
    /**
     * @param array{
     *     email: string,
     *     password: string
     * } $attributes
     */
    public function authenticate(array $attributes): Account{
        $account = Account::query()->where(
            'email', $attributes['email']
        )->first();

        if($account === null || !Hash::check($attributes['password'], $account->password_hash)){
            throw new ApiException(
                errorCode: 'INVALID_CREDENTIALS',
                message: 'The provided credentials are incorrect.',
                statusCode: 422,
            );
        }

        if($account->role !== AccountRole::RestaurantOwner){
            throw new ApiException(
                errorCode: 'ACCOUNT_ROLE_CONFLICT',
                message: 'This email address is registered for a different account type.',
                statusCode: 409,
            );
        }

        if($account->status !== AccountStatus::Active){
            throw new ApiException(
                errorCode: 'ACCOUNT_NOT_ACTIVE',
                message: 'This account is currently unavailable.',
                statusCode: 403,
            );
        }

        return $account;
    }

}
