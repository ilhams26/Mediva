<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{

    public function registerUser(array $data): array
    {
        $user = User::create($data);

        $token = $user->createToken('mediva_auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function loginUser(array $credentials): array
    {
        $user = User::where('username', $credentials['login_id'])
            ->orWhere('no_hp', $credentials['login_id'])
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login_id' => ['Kredensial yang diberikan tidak cocok dengan data kami.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'login_id' => ['Akun Anda telah dinonaktifkan. Silakan hubungi staf atau admin.'],
            ]);
        }

        $token = $user->createToken('mediva_auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
