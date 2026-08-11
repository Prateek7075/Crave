<?php

namespace App\Exceptions;

use RuntimeException;

final class RestaurantAlreadyExistsException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('The restaurant owner already has a restaurant.');
    }
}
