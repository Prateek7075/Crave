<?php

namespace App\Enums;

enum RestaurantOperatingStatus: string
{
    case Closed = 'CLOSED';

    case Open = 'OPEN';
}
