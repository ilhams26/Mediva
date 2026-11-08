<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ValidateResepRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'status' => ['required', Rule::in(['disetujui', 'ditolak'])],
        ];
    }

    public function messages()
    {
        return [
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status harus disetujui atau ditolak',
        ];
    }
}
