<?php

namespace App\Support\Auth;

final class IndianMobileNormalizer{
    private const LOCAL_PATTERN = '/^[6-9][0-9]{9}$/';

    private const NORMALIZED_PATTERN = '/^\+91[6-9][0-9]{9}$/';

    public static function normalize(mixed $value) : ?string{
        if(! is_string($value)){
            return null;
        }

        $mobile = trim($value);
        if(preg_match(self::LOCAL_PATTERN, $mobile) === 1){
            return '+91'.$mobile;
        }

        if(preg_match(self::NORMALIZED_PATTERN, $mobile) === 1){
            return $mobile;
        }

        return null;

    }
}
