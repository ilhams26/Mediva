<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login_id'     => ['required', 'string'],
            'otp'          => ['required', 'string', 'size:6'],
            'password'     => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * Custom message for validation errors.
     */
    public function messages(): array
    {
        return [
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min'       => 'Password baru minimal harus 8 karakter.',
            'otp.size'           => 'Kode OTP harus 6 digit.',
        ];
    }
}
