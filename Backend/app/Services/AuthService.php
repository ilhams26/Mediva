<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(private OTPService $otpService) {}

    public function registerUser(array $data): array
    {
        $user = new User();
        $user->fill(Arr::only($data, ['username', 'no_hp', 'password', 'jenis_kelamin', 'tanggal_lahir']));
        $user->role = 'pembeli';
        $user->is_active = false;
        $user->save();

        $otpResult = $this->otpService->generateAndSendOTP($user);

        return [
            'user' => $user->only(['id', 'username', 'no_hp']),
            'otp_sent' => $otpResult['sent'],
            'expires_at' => $otpResult['expires_at'],
            'otp' => $otpResult['otp'],
        ];
    }

    public function verifyOtpAndActivate(string $noHp, string $otp): array
    {
        $user = User::where('no_hp', $noHp)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'no_hp' => ['Nomor HP tidak ditemukan']
            ]);
        }

        if ($user->is_active) {
            throw ValidationException::withMessages([
                'no_hp' => ['Akun sudah aktif. Silakan login']
            ]);
        }

        if (!$this->otpService->verifyOTP($user, $otp)) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP tidak valid atau sudah kedaluwarsa']
            ]);
        }

        $user->update(['is_active' => true]);
        $this->otpService->clearOTP($user);

        return [
            'user' => $user,
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
                'login_id' => ['Kredensial yang diberikan tidak sesuai'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'login_id' => ['Akun belum diverifikasi. Silakan verifikasi OTP terlebih dahulu'],
            ]);
        }

        return [
            'user'  => $user,
            'token' => $user->createToken('mediva_auth_token')->plainTextToken,
        ];
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai']
            ]);
        }

        $user->update(['password' => Hash::make($newPassword)]);
        $user->tokens()->delete();
    }
}
