<?php

namespace App\Enums;

enum AccountRole: string
{
    case Customer = 'CUSTOMER';

    case RestaurantOwner = 'RESTAURANT_OWNER';

    case DeliveryPartner = 'DELIVERY_PARTNER';
}
