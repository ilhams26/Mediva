<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminCreateUserRequest extends FormRequest
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
            'username'      => ['required', 'string', 'max:255', 'unique:users,username'],
            'no_hp'         => ['required', 'string', 'max:20', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,11}$/', 'unique:users,no_hp'],
            'password'      => ['required', 'string', 'min:8'],
            'role'          => ['required', 'in:admin,staf,pembeli'],
            'jenis_kelamin' => ['nullable', 'in:L,P'],
            'tanggal_lahir' => ['nullable', 'date', 'before:today'],
            'is_active'     => ['nullable', 'boolean'],
        ];
    }
}
