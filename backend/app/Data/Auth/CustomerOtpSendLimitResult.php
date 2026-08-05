<?php

namespace App\Data\Auth;

use App\Enums\CustomerOtpSendLimitReason;
use InvalidArgumentException;

final readonly class CustomerOtpSendLimitResult{

    private function __construct(public bool $allowed, public ?CustomerOtpSendLimitReason $reason, public ?int $retryAfterSeconds){
    }

    public static function allowed() : self{
        return new self(
            allowed: true,
            reason: null,
            retryAfterSeconds: null,
        );
    }

    public static function blocked(CustomerOtpSendLimitReason $reason, int $retryAfterSeconds) : self{
        if($retryAfterSeconds < 1){
            throw new InvalidArgumentException("RetryAfterSeconds must be at least 1 ");
        }

        return new self(
            allowed: false,
            reason: $reason,
            retryAfterSeconds: $retryAfterSeconds,
        );
    }
}
