<?php

namespace App\Data\Auth;

use App\Enums\CustomerOtpPurpose;

final readonly class CustomerOtpChallenge{
    public function __construct( public string $id, public CustomerOtpPurpose $purpose, public string $mobile, public ?string $fullName, public int $failedAttempts){
    }
}
