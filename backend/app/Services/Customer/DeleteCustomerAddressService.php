<?php

namespace App\Services\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use Illuminate\Auth\Access\AuthorizationException;
use LogicException;

final class DeleteCustomerAddressService
{
    public function delete(Account $account, int $addressId,): void {
        if ($account->role !== AccountRole::Customer || $account->status !== AccountStatus::Active) {
            throw new AuthorizationException(
                'Only active customers can delete saved addresses.',
            );
        }

        $customerProfile = $account->customerProfile()->first();

        if ($customerProfile === null) {
            throw new LogicException(
                'The customer account does not have a customer profile.',
            );
        }

        $address = $customerProfile->addresses()->whereKey($addressId)->firstOrFail();

        $address->delete();
    }
}
