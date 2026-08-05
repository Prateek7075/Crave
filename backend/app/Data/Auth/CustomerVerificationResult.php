<?php

namespace App\Data\Auth;

use App\Models\Account;

final readonly class CustomerVerificationResult
{
    public function __construct(
        public Account $account,
        public bool $registeredNow,
    ) {
    }
}
