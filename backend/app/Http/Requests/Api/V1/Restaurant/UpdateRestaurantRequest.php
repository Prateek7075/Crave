<?php

namespace App\Http\Requests\Api\V1\Restaurant;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRestaurantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['bail', 'sometimes', 'required', 'string', 'max:120'],
            'description' => ['bail', 'sometimes', 'nullable', 'string', 'max:1000'],
            'contactNumber' => ['bail', 'sometimes', 'required', 'string', 'regex:/^\+91[6-9][0-9]{9}$/'],
            'contactEmail' => ['bail', 'sometimes', 'required', 'email', 'max:255'],
            'addressLine1' => ['bail', 'sometimes', 'required', 'string', 'max:255'],
            'addressLine2' => ['bail', 'sometimes', 'nullable', 'string', 'max:255'],
            'landmark' => ['bail', 'sometimes', 'nullable', 'string', 'max:160'],
            'city' => ['bail', 'sometimes', 'required', 'string', 'max:100'],
            'state' => ['bail', 'sometimes', 'required', 'string', 'max:100'],
            'pincode' => ['bail', 'sometimes', 'required', 'string', 'regex:/^[0-9]{6}$/'],
            'latitude' => ['bail', 'sometimes', 'required', 'numeric', 'between:-90,90'],
            'longitude' => ['bail', 'sometimes', 'required', 'numeric', 'between:-180,180'],
            'fssaiLicenseNumber' => ['bail', 'sometimes', 'nullable', 'string', 'regex:/^[0-9]{14}$/'],
            'gstin' => ['bail', 'sometimes', 'nullable', 'string', 'max:15'],
        ];
    }
    protected function prepareForValidation(): void
    {
        $merged = [];

        $fields = [
            'name', 'description', 'contactNumber', 'contactEmail',
            'addressLine1', 'addressLine2', 'landmark',
            'city', 'state', 'pincode',
            'fssaiLicenseNumber', 'gstin'
        ];

        foreach ($fields as $field) {
            if ($this->has($field)) {
                $merged[$field] = $this->normalizeNullableString($this->input($field));
            }
        }

        if (!empty($merged)) {
            $this->merge($merged);
        }
    }

    private function normalizeNullableString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    /**
     * @return array<string, mixed>
     */
    public function toServiceAttributes(): array
    {
        $validated = $this->validated();
        $mapping = [
            'contactNumber' => 'contact_number',
            'contactEmail' => 'contact_email',
            'addressLine1' => 'address_line_1',
            'addressLine2' => 'address_line_2',
            'landmark' => 'landmark',
            'city' => 'city',
            'state' => 'state',
            'pincode' => 'pincode',
            'fssaiLicenseNumber' => 'fssai_license_number',
            'gstin' => 'gstin',
        ];

        $attributes = [];
        foreach ($validated as $key => $value) {
            $dbKey = $mapping[$key] ?? $key;
            $attributes[$dbKey] = $value;
        }

        return $attributes;
    }
}
