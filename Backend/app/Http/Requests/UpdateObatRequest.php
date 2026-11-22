<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateObatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kategori_id' => ['nullable', 'integer', 'exists:kategoris,id'],
            'nama' => ['nullable', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'harga' => ['nullable', 'numeric', 'min:0'],
            'jenis' => ['nullable', 'in:biasa,keras'],
            'stok_minimum' => ['nullable', 'integer', 'min:0'],
            'foto' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'kategori_id.exists' => 'Kategori tidak ditemukan.',
            'nama.max' => 'Nama obat maksimal 255 karakter.',
            'harga.min' => 'Harga tidak boleh negatif.',
            'jenis.in' => 'Jenis harus biasa atau keras.',
        ];
    }
}
