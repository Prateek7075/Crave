<?php

namespace App\Http\Requests\Api\V1\Restaurant;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuCategoryRequest extends FormRequest
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
        /** @var \App\Models\Account $account */
        $account = auth()->user();
        $restaurant = $account?->restaurant()->first();
        $restaurantId = $restaurant?->id;

        return [
            'name' => [
                'bail',
                'required',
                'string',
                'max:255',
                Rule::unique('menu_categories', 'name')->where(function ($query) use ($restaurantId) {
                    return $query->where('restaurant_id', $restaurantId);
                }),
            ],
            'description' => ['bail', 'nullable', 'string', 'max:2000'],
            'display_order' => ['bail', 'nullable', 'integer', 'min:0'],
            'is_active' => ['bail', 'sometimes', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->input('name')) ? trim($this->input('name')) : $this->input('name'),
            'description' => $this->normalizeNullableString($this->input('description')),
            'display_order' => $this->input('display_order') !== null ? (int) $this->input('display_order') : 0,
            'is_active' => $this->has('is_active') ? (bool) $this->input('is_active') : true,
        ]);
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
