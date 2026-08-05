<?php

namespace App\Enums;

enum CustomerOtpSendLimitReason: string
{
    case Cooldown = 'COOLDOWN';

    case HourlyLimit = 'HOURLY_LIMIT';
}
