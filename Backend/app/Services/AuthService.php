<?php

// Letakkan di: app/Services/AuthService.php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function registerUser(array $data): array
    {
        $user = new User();
        $user->fill(Arr::only($data, ['username', 'no_hp', 'password', 'jenis_kelamin', 'tanggal_lahir']));
        $user->role = 'pembeli';
        $user->is_active = true;
        $user->save();

        return [
            'user'  => $user,
            'token' => $user->createToken('mediva_auth_token')->plainTextToken,
        ];
    }

    public function loginUser(array $credentials): array
    {
        $user = User::where('username', $credentials['login_id'])
            ->orWhere('no_hp', $credentials['login_id'])
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login_id' => ['Kredensial yang diberikan tidak sesuai.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'login_id' => ['Akun Anda telah dinonaktifkan. Silakan hubungi staf atau admin.'],
            ]);
        }

        return [
            'user'  => $user,
            'token' => $user->createToken('mediva_auth_token')->plainTextToken,
        ];
    }
    
    public function resetPassword(User $user, string $newPassword): void
    {
        $user->password = $newPassword;
        $user->otp = null;
        $user->otp_expired_at = null;
        $user->save();

        $user->tokens()->delete();
    }
    
    public function changePassword(User $user,string $curretPassword, string $newPassword): void
    {
        if (! Hash::check($curretPassword, $user->password)){
            throw ValidationException::withMessages([
                'current_password' => [
                    'Password saat ini tidak sesuai.'
                ],
            ]);
        }

        $user->password = $newPassword;
        $user->tokens()->delete();
    }
}