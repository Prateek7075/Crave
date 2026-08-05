<?php

namespace App\Support\Auth;

final class DevelopmentOtpCode{

    public static function value() : string{

        $environment = config('app.env');

        if($environment === 'production'){
            throw new \LogicException('Development OTP code is not configured for production environment.');
        }

        $configuredCode = config('crave.auth.customer_otp.development_code');

        if(!is_string($configuredCode) || preg_match('/^[0-9]{4}$/', $configuredCode) !== 1 ){
            throw new \LogicException('Development OTP code must contain 4 digits.');
        }

        return $configuredCode;
    }

    public static function assertConfigurationIsSafe() : void{

        $environment = config('app.env');

        $configuredCode = config('crave.auth.customer_otp.development_code');

        if($environment === 'production'){
            if($configuredCode !== null && $configuredCode !== ''){
                throw new \LogicException('Development OTP code is not configured for production environment.');
            }
            return;
        }
        self::value();

    }
}
