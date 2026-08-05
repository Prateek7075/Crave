<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Support\Auth\IndianMobileNormalizer;

class CustomerRequestCodeRequest extends FormRequest
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
            'mobile' => ['bail', 'required', 'string', 'regex:/^\+91[6-9][0-9]{9}$/',],
            'fullName' => ['bail', 'sometimes', 'string', 'min: 3', 'max:120'],
        ];
    }

    /**
     * @return array<string,string>
     */
    public function messages(): array{
        return [
            'mobile.required' => 'Mobile is required.',
            'mobile.regex' => 'Enter a valid Indian mobile number.',
            'mobile.string' => 'Mobile must be a string.',
            'fullName.max' => 'Full name must not be more than 120 characters.',
            'fullName.min' => 'Full name must not be less than 3 characters.',
            'fullName.string' => 'Full name must be a string.',
        ];
    }

    protected function prepareForValidation():void {
        $rawMobile = $this->input('mobile');

        $normalizedMobile = IndianMobileNormalizer::normalize($rawMobile);

        $preparedInput = [
            'mobile'=> $normalizedMobile ?? (is_string($rawMobile) ? trim($rawMobile) : $rawMobile),
        ];

        $rawFullName = $this->input('fullName');

        if(is_string($rawFullName)){
            $preparedInput['fullName'] = trim($rawFullName);
        }

        $this->merge($preparedInput);
    }
}
