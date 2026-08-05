<?php

namespace App\Http\Requests\Api\V1\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class CustomerVerifyCodeRequest extends FormRequest
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
            'challengeId' => ['bail', 'required', 'string', 'uuid'],
            'code' => ['bail', 'required', 'string','regex:/^[0-9]{4}$/',],
        ];
    }

    /**
     * @return array<string, string>
     */

    public function messages(): array{
        return [
            'challengeId.required' => 'Challenge ID is required.',
            'challengeId.uuid' => 'Challenge ID must be a valid UUID.',
            'challengeID.string' => 'Challenge ID must be a string',
            'code.required' => 'Verification code is required.',
            'code.string' => 'Verification code must be a string.',
            'code.regex' => 'Verification code must contain exactly 4 digits.',
        ];
    }

    protected function prepareForValidation(): void{
        $preparedInput =[];

        $challengeId = $this->input('challengeId');

        if(is_string($challengeId)){
            $preparedInput['challengeId'] = trim($challengeId);
        }

        $code = $this->input('code');

        if(is_string($code)){
            $preparedInput['code'] = trim($code);
        }

        if($preparedInput !== []){
            $this->merge($preparedInput);
        }

    }
}
