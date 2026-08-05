<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class CustomerProfile extends Model
{
    /**
     * @var list<string>
     */

    protected $fillable = ['account_id', 'full_name'];

    /**
     * @return BelongsTo<Account, $this>
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function addresses(): HasMany {
        return $this->hasMany(CustomerAddress::class, 'customer_profile_id');
    }
}
