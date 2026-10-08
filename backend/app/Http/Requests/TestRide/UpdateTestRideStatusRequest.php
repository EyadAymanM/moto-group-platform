<?php

namespace App\Http\Requests\TestRide;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTestRideStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(['pending', 'confirmed', 'completed', 'cancelled'])],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
