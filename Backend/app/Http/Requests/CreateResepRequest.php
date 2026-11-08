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
            'order_id' => 'nullable|exists:orders,id',
            'foto_resep' => 'required|string|max:500',
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'User ID wajib diisi',
            'user_id.exists' => 'User tidak ditemukan',
            'order_id.exists' => 'Order tidak ditemukan',
            'foto_resep.required' => 'Foto resep wajib diisi',
            'foto_resep.max' => 'URL foto resep maksimal 500 karakter',
        ];
    }
}
