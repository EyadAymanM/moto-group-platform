<?php

namespace App\Http\Requests\Motorcycle;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMotorcycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $user = $this->user();

        return [
            'brand_id' => $user->isAdmin()
                ? ['required', 'integer', 'exists:brands,id']
                : ['nullable', 'integer', Rule::in([$user->brand_id])],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:motorcycles,slug'],
            'category' => ['required', 'string', Rule::in(['Performance', 'Adventure & Touring', 'Urban Mobility', 'Premium Heritage'])],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'engine_cc' => ['nullable', 'integer', 'min:0', 'max:5000'],
            'horsepower' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'torque_nm' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'weight_kg' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'top_speed_kmh' => ['nullable', 'integer', 'min:0', 'max:500'],
            'acceleration_0_100' => ['nullable', 'numeric', 'min:0', 'max:30'],
            'fuel_capacity_liters' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'seat_height_mm' => ['nullable', 'integer', 'min:0', 'max:1500'],
            'price_starting_at' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'image_url' => ['required', 'string', 'url'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['string', 'url'],
            'color_options' => ['nullable', 'array'],
            'color_options.*' => ['string', 'max:100'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'order_index' => ['nullable', 'integer'],
        ];
    }
}
