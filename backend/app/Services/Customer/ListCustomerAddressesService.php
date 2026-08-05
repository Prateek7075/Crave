<?php

namespace App\Services\Customer;

use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use App\Models\Account;
use App\Models\CustomerAddress;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use LogicException;
use Symfony\Component\HttpKernel\Exception\LockedHttpException;

final class ListCustomerAddressesService{
    /**
     * @return Collection<int, CustomerAddress>
     *
     * @throws AuthorizationException
     */

    public function list(Account $account): Collection {
        if($account->role !== AccountRole::Customer || $account->status !== AccountStatus::Active){
            throw new AuthorizationException(
                'Only active customers can view saved addresses. '
            );
        }

        $customerProfile = $account->customerProfile;

        if($customerProfile === null){
            throw new LogicException(
                'The customer account does not have a customer profile.'
            );
        }

        return $customerProfile->addresses()
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->get();
    }
}
