<?php

namespace App\Http\Requests\TestRide;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTestRideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // public endpoint
    }

    public function rules(): array
    {
        return [
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'motorcycle_id' => ['nullable', 'integer', 'exists:motorcycles,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'preferred_city' => ['required', 'string', Rule::in(['Dubai', 'Riyadh', 'Doha'])],
            'preferred_date' => ['nullable', 'date', 'after_or_equal:today'],
            'experience_level' => ['nullable', 'string', Rule::in(['Beginner', 'Intermediate', 'Expert'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
