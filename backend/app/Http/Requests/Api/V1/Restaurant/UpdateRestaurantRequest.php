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
            'description' => ['bail', 'nullable', 'string', 'max:1000'],
        ];
    }
    protected function prepareForValidation(): void
    {
        $merged = [];

        if ($this->has('name')) {
            $merged['name'] = is_string($this->input('name')) ? trim($this->input('name')) : $this->input('name');
        }

        if ($this->has('description')) {
            $merged['description'] = $this->normalizeNullableString($this->input('description'));
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
}
