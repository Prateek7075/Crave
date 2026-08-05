<?php

namespace App\Services\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Models\CustomerAddress;
use Illuminate\Auth\Access\AuthorizationException;
use LogicException;

final class UpdateCustomerAddressService
{
    /**
     * @param array{
     *     label: string,
     *     recipient_name: string,
     *     address_line_1: string,
     *     address_line_2: string|null,
     *     landmark: string|null,
     *     latitude: int|float|string,
     *     longitude: int|float|string,
     *     delivery_instructions: string|null
     * } $attributes
     */
    public function update(Account $account, int $addressId, array $attributes,): CustomerAddress {
        if ($account->role !== AccountRole::Customer || $account->status !== AccountStatus::Active) {
            throw new AuthorizationException(
                'Only active customers can update saved addresses.',
            );
        }

        $customerProfile = $account->customerProfile()->first();

        if ($customerProfile === null) {
            throw new LogicException(
                'The customer account does not have a customer profile.',
            );
        }

        $address = $customerProfile->addresses()->whereKey($addressId)->firstOrFail();

        $address->fill($attributes);
        $address->save();

        return $address->refresh();
    }
}
