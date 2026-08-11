<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class RegisterRestaurantOwnerRequest extends FormRequest{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:254', 'unique:accounts,email'],
            'mobile' => ['required', 'string', 'max:13'], // Ensure mobile is validated here
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => is_string($this->input('full_name')) ? trim($this->input('full_name')) : $this->input('full_name'),
            'email' => is_string($this->input('email')) ? mb_strtolower(trim($this->input('email'))) : $this->input('email'),
        ]);
    }
}
