<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Endpoint pendaftaran pembeli baru.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->registerUser($request->validated());

        return $this->successResponse($result, 'Pendaftaran berhasil.', 201);
    }

    /**
     * Endpoint login pengguna (username / no_hp).
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginUser($request->validated());

        return $this->successResponse($result, 'Login berhasil.', 200);
    }

    /**
     * Endpoint logout pengguna (menghapus token akses saat ini).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout berhasil.', 200);
    }

    /**
     * Endpoint profil pengguna yang sedang login.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->successResponse($request->user(), 'Data pengguna berhasil diambil.', 200);
    }

    /**
     * Endpoint mengganti password pengguna.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword(
            $request->user(),
            $request->input('current_password'),
            $request->input('new_password')
        );

        return $this->successResponse(null, 'Password berhasil diperbarui.', 200);
    }

    /**
     * Endpoint meminta kode OTP lupa password.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->authService->sendOtp($request->input('login_id'));

        return $this->successResponse($result, 'Kode OTP berhasil dikirim.', 200);
    }

    /**
     * Endpoint verifikasi kode OTP.
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $this->authService->verifyOtp(
            $request->input('login_id'),
            $request->input('otp')
        );

        return $this->successResponse(null, 'Kode OTP valid.', 200);
    }

    /**
     * Endpoint reset password dengan kode OTP.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $this->authService->resetPassword(
            $request->input('login_id'),
            $request->input('otp'),
            $request->input('password')
        );

        return $this->successResponse(null, 'Password berhasil direset. Silakan login kembali.', 200);
    }
}
