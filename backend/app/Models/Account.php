<?php

namespace App\Models;
use App\Enums\AccountRole;
use App\Enums\AccountStatus;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

final class Account extends Authenticatable
{
    /**
     *@var list<string>
     */

    protected $fillable = ['role', 'status', 'mobile', 'email', 'password_hash', 'full_name'];

    /**
     *@var list<string>
     */

    protected $hidden = ['password_hash'];

    /**
     * @return array<string, string>
     */

    protected function casts() : array{
        return [
            'role' => AccountRole::class,
            'status' => AccountStatus::class,
        ];
    }

    public function getAuthPasswordName() : string{
        return 'password_hash';
    }

    /**
     * @return HasOne<CustomerProfile, $this>
     */

    public function customerProfile() : HasOne{
        return $this->hasOne(CustomerProfile::class);
    }

}
