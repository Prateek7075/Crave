<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class CustomerAddress extends Model
{
    protected $fillable = ['label', 'recipient_name', 'address_line_1', 'address_line_2', 'landmark', 'latitude', 'longitude', 'delivery_instructions'];

    protected function casts() : array{
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    protected function customerProfile(): BelongsTo {
        return $this->belongsTo(CustomerProfile::class);
    }
}
