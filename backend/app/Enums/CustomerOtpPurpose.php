<?php

namespace App\Enums;

enum CustomerOtpPurpose: string{

    case Login = 'CUSTOMER_LOGIN';

    case Registration = 'CUSTOMER_REGISTRATION';
}
