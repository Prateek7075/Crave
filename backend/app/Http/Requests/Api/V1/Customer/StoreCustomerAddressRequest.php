<?php

namespace App\Http\Requests\Api\V1\Customer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerAddressRequest extends FormRequest
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
            'label' => ['bail', 'required', 'string', 'max:40'],

            'recipient_name' => ['bail', 'required', 'string', 'max:120'],

            'address_line_1' => ['bail', 'required', 'string', 'max:255'],

            'address_line_2' => ['nullable', 'string', 'max:255'],

            [
                'nullable', 'string', 'max:255',
            ],

            'landmark' => ['nullable', 'string', 'max:160'],

            'latitude' => ['bail', 'required', 'numeric', 'between:-90,90',],

            'longitude' => ['bail', 'required', 'numeric', 'between:-180,180',],

            'delivery_instructions' => ['nullable', 'string', 'max:500'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'label' => $this->normalizeRequiredString($this->input('label')),
            'recipient_name' => $this->normalizeRequiredString($this->input('recipient_name')),
            'address_line_1' => $this->normalizeRequiredString($this->input('address_line_1')),
            'address_line_2' => $this->normalizeNullableString($this->input('address_line_2')),
            'landmark' => $this->normalizeNullableString($this->input('landmark')),
            'latitude' => $this->normalizeRequiredString($this->input('latitude')),
            'longitude' =>$this->normalizeRequiredString($this->input('longitude')),
            'delivery_instructions' =>$this->normalizeNullableString($this->input('delivery_instructions')),
        ]);
    }

    private function normalizeNullableString(mixed $value): mixed{
        if(!is_string($value)){
            return $value;
        }

        $normalizedValue = trim($value);

        return $normalizedValue === '' ? null : $normalizedValue;
    }

    private function normalizeRequiredString(mixed $value): mixed{
        if(!is_string($value)){
            return $value;
        }
        return trim($value);
    }

}
