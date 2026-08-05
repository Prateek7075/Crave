<?php

namespace App\Services\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Models\CustomerAddress;
use Illuminate\Auth\Access\AuthorizationException;
use LogicException;

final class GetCustomerAddressService{

    public function get(Account $account, int $addressId): CustomerAddress{
        if ($account->role !== AccountRole::Customer || $account->status !== AccountStatus::Active) {
            throw new AuthorizationException(
                'Only active customers can view saved addresses.',
            );
        }

        $customerProfile = $account->customerProfile()->first();

        if ($customerProfile === null) {
            throw new LogicException(
                'The customer account does not have a customer profile.',
            );
        }

        return $customerProfile
            ->addresses()
            ->whereKey($addressId)
            ->firstOrFail();
    }
}
