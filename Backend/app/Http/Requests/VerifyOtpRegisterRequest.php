<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'no_hp' => 'required|string',
            'otp' => 'required|digits:6',
        ];
    }

    public function messages(): array
    {
        return [
            'no_hp.required' => 'Nomor HP wajib diisi',
            'otp.required' => 'Kode OTP wajib diisi',
            'otp.digits' => 'Kode OTP harus 6 digit angka',
        ];
    }
}
