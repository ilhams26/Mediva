<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'no_hp' => [
                'required',
                'string',
                'max:20',
                'exists:users,no_hp'
            ],
            'otp' => [
                'required',
                'string',
                'size:6',
                'regex:/^[0-9]{6}$/'
            ],
        ];
    }
}