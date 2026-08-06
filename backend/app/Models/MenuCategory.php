<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuCategory extends Model
{
    /** @use HasFactory<\Database\Factories\MenuCategoryFactory> */
    use HasFactory;

    protected $fillable =[
        'restaurant_id',
        'name',
        'description',
        'display_order',
        'is_active',
    ];

    protected function casts(): array{
        return[
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function restaurant(): BelongsTo{
        return $this->belongsTo(Restaurant::class);
    }
}
