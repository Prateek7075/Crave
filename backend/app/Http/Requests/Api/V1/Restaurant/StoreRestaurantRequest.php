<?php

namespace App\Http\Requests\Api\V1\Restaurant;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantRequest extends FormRequest
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
            'name' => [
                'bail',
                'required',
                'string',
                'max:120',
            ],

            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->normalizeRequiredString(
                $this->input('name'),
            ),

            'description' =>
                $this->normalizeNullableString(
                    $this->input('description'),
                ),
        ]);
    }

    private function normalizeRequiredString(
        mixed $value,
    ): mixed {
        return is_string($value)
            ? trim($value)
            : $value;
    }

    private function normalizeNullableString(
        mixed $value,
    ): mixed {
        if ($value === null) {
            return null;
        }

        if (!is_string($value)) {
            return $value;
        }

        $normalizedValue = trim($value);

        return $normalizedValue === ''
            ? null
            : $normalizedValue;
    }
}
