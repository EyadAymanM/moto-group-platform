<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'brand_id',
    'name',
    'slug',
    'category',
    'tagline',
    'description',
    'engine_cc',
    'horsepower',
    'torque_nm',
    'weight_kg',
    'top_speed_kmh',
    'acceleration_0_100',
    'fuel_capacity_liters',
    'seat_height_mm',
    'price_starting_at',
    'currency',
    'image_url',
    'gallery_images',
    'color_options',
    'is_featured',
    'is_active',
    'order_index',
])]
class Motorcycle extends Model
{
    use HasFactory;

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function testRideRequests(): HasMany
    {
        return $this->hasMany(TestRideRequest::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'brand_id' => 'integer',
            'engine_cc' => 'integer',
            'horsepower' => 'integer',
            'torque_nm' => 'integer',
            'weight_kg' => 'integer',
            'top_speed_kmh' => 'integer',
            'acceleration_0_100' => 'decimal:1',
            'fuel_capacity_liters' => 'decimal:1',
            'seat_height_mm' => 'integer',
            'price_starting_at' => 'decimal:2',
            'gallery_images' => 'array',
            'color_options' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'order_index' => 'integer',
        ];
    }
}
