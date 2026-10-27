<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUpdateUserRequest extends FormRequest
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
        $userId = $this->route('user') ?? $this->route('id');

        return [
            'username'      => ['sometimes', 'required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($userId)],
            'no_hp'         => ['sometimes', 'required', 'string', 'max:20', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,11}$/', Rule::unique('users', 'no_hp')->ignore($userId)],
            'password'      => ['nullable', 'string', 'min:8'],
            'role'          => ['sometimes', 'required', 'in:admin,staf,pembeli'],
            'jenis_kelamin' => ['nullable', 'in:L,P'],
            'tanggal_lahir' => ['nullable', 'date', 'before:today'],
            'is_active'     => ['nullable', 'boolean'],
        ];
    }
}
