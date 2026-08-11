<?php

namespace App\Models;

use App\Enums\RestaurantOperatingStatus;
use App\Enums\RestaurantVerificationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    protected $fillable = [
        'name', 'slug', 'description',
        'owner_account_id'
    ];


    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'verification_status' => RestaurantVerificationStatus::class,
            'operating_status' => RestaurantOperatingStatus::class,
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'owner_account_id',);
    }

    public function menuCategories(): HasMany{
        return $this->hasMany(MenuCategory::class);
    }
}
