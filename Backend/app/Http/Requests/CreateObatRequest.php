<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateObatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kategori_id' => ['required', 'integer', 'exists:kategoris,id'],
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'harga' => ['required', 'numeric', 'min:0'],
            'jenis' => ['nullable', 'in:biasa,keras'],
            'stok_minimum' => ['nullable', 'integer', 'min:0'],
            'foto' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'kategori_id.required' => 'Kategori wajib dipilih.',
            'kategori_id.exists' => 'Kategori tidak ditemukan.',
            'nama.required' => 'Nama obat wajib diisi.',
            'harga.required' => 'Harga wajib diisi.',
            'harga.min' => 'Harga tidak boleh negatif.',
            'jenis.in' => 'Jenis harus biasa atau keras.',
        ];
    }
}
