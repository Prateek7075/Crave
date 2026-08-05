<?php

namespace App\Queries\Auth;

use App\Models\Account;

final class FindAccountByMobile
{
    public function __invoke(string $mobile): ?Account
    {
        return Account::query()
            ->select(['id', 'role', 'status', 'mobile'])
            ->where('mobile', $mobile)
            ->first();
    }
}
