<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Mendaftarkan pengguna baru (role pembeli).
     *
     * @param  array  $data
     * @return array
     */
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

    /**
     * Melakukan autentikasi pengguna berdasarkan username atau no_hp.
     *
     * @param  array  $credentials
     * @return array
     * @throws ValidationException
     */
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

    /**
     * Mengganti password user yang sedang login.
     *
     * @param  User  $user
     * @param  string  $currentPassword
     * @param  string  $newPassword
     * @return void
     * @throws ValidationException
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai.'],
            ]);
        }

        $user->password = $newPassword; // Casts akan otomatis melakukan hashing
        $user->save();
    }

    /**
     * Membuat dan mengirimkan OTP untuk reset password.
     * OTP disimpan dalam bentuk hash SHA-256 dan kedaluwarsa dalam 5 menit.
     *
     * @param  string  $loginId
     * @return array
     * @throws ValidationException
     */
    public function sendOtp(string $loginId): array
    {
        $user = User::where('username', $loginId)
            ->orWhere('no_hp', $loginId)
            ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'login_id' => ['Pengguna dengan username atau nomor HP tersebut tidak ditemukan.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'login_id' => ['Akun Anda sedang dinonaktifkan. Silakan hubungi admin.'],
            ]);
        }

        // Generate 6 digit angka random
        $plainOtp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->otp = hash('sha256', $plainOtp);
        $user->otp_attempts = 0;
        $user->otp_expired_at = now()->addMinutes(5);
        $user->otp_verified_at = null;
        $user->save();

        $result = [
            'message'            => 'Kode OTP berhasil dikirim.',
            'expires_in_minutes' => 5,
        ];

        // Sediakan kode plainOtp untuk keperluan testing atau local environment
        if (config('app.env') === 'local' || config('app.env') === 'testing') {
            $result['debug_otp'] = $plainOtp;
        }

        return $result;
    }

    /**
     * Memverifikasi kode OTP yang dimasukkan pengguna.
     *
     * @param  string  $loginId
     * @param  string  $otp
     * @return bool
     * @throws ValidationException
     */
    public function verifyOtp(string $loginId, string $otp): bool
    {
        $user = User::where('username', $loginId)
            ->orWhere('no_hp', $loginId)
            ->first();

        if (!$user || !$user->otp) {
            throw ValidationException::withMessages([
                'otp' => ['Tidak ada permintaan OTP aktif untuk akun ini.'],
            ]);
        }

        // Cek batas percobaan (maksimal 5 kali salah)
        if ($user->otp_attempts >= 5) {
            $user->otp = null;
            $user->otp_expired_at = null;
            $user->save();

            throw ValidationException::withMessages([
                'otp' => ['Percobaan verifikasi telah melebihi batas (maksimal 5 kali). Silakan minta kode OTP baru.'],
            ]);
        }

        // Cek kedaluwarsa (5 menit)
        if (!$user->otp_expired_at || now()->isAfter($user->otp_expired_at)) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP telah kedaluwarsa. Silakan minta kode OTP baru.'],
            ]);
        }

        // Verifikasi hash OTP
        $otpHash = hash('sha256', $otp);
        if (!hash_equals($user->otp, $otpHash)) {
            $user->increment('otp_attempts');

            throw ValidationException::withMessages([
                'otp' => ['Kode OTP tidak valid. Sisa percobaan: ' . (5 - $user->otp_attempts)],
            ]);
        }

        // Sukses verifikasi
        $user->otp_verified_at = now();
        $user->save();

        return true;
    }

    /**
     * Mereset password pengguna setelah validasi OTP berhasil.
     *
     * @param  string  $loginId
     * @param  string  $otp
     * @param  string  $newPassword
     * @return void
     * @throws ValidationException
     */
    public function resetPassword(string $loginId, string $otp, string $newPassword): void
    {
        $this->verifyOtp($loginId, $otp);

        $user = User::where('username', $loginId)
            ->orWhere('no_hp', $loginId)
            ->first();

        $user->password = $newPassword;
        $user->otp = null;
        $user->otp_expired_at = null;
        $user->otp_attempts = 0;
        $user->save();
    }
}