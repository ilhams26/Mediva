<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateResepRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'obat_id' => 'required|exists:obat,id',
            'deskripsi_keluhan' => 'required|string|max:1000',
            'foto_resep' => 'nullable|string|max:500',
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'User ID wajib diisi',
            'user_id.exists' => 'User tidak ditemukan',
            'obat_id.required' => 'Obat ID wajib diisi',
            'obat_id.exists' => 'Obat tidak ditemukan',
            'deskripsi_keluhan.required' => 'Deskripsi keluhan wajib diisi',
            'deskripsi_keluhan.max' => 'Deskripsi keluhan maksimal 1000 karakter',
            'foto_resep.max' => 'URL foto resep maksimal 500 karakter',
        ];
    }
}
