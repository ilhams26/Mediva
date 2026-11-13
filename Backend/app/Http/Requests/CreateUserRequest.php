<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'username'      => [
                'required',
                'string',
                'max:50',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
            'no_hp'         => [
                'required',
                'string',
                'max:20',
                'regex:/^(\+62|62|0)8[1-9][0-9]{6,11}$/',
            ],
            'password'      => ['required', 'string', 'min:8', 'confirmed'],
            'role'          => ['required', 'in:admin,staf'],
            'jenis_kelamin' => ['nullable', 'in:L,P'],
            'tanggal_lahir' => ['nullable', 'date', 'before:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required'      => 'Username wajib diisi.',
            'username.unique'        => 'Username sudah digunakan.',
            'username.regex'         => 'Username hanya boleh mengandung huruf, angka, dan underscore.',
            'no_hp.required'         => 'Nomor HP wajib diisi.',
            'no_hp.regex'            => 'Format nomor HP tidak valid. Gunakan format Indonesia (08xx / +62xx).',
            'password.required'      => 'Password wajib diisi.',
            'password.min'           => 'Password minimal 8 karakter.',
            'password.confirmed'     => 'Konfirmasi password tidak cocok.',
            'role.required'          => 'Role wajib dipilih.',
            'role.in'                => 'Role hanya boleh admin atau staf.',
            'jenis_kelamin.in'       => 'Jenis kelamin hanya boleh L atau P.',
            'tanggal_lahir.date'     => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before'   => 'Tanggal lahir harus sebelum hari ini.',
        ];
    }
}
