<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResepStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'status' => ['required', Rule::in(['pending', 'disetujui', 'ditolak'])],
            'catatan_apoteker' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status harus pending, disetujui, atau ditolak',
            'catatan_apoteker.max' => 'Catatan apoteker maksimal 1000 karakter',
        ];
    }
}
