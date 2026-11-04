# 🗺️ FASE 2: AUTENTIKASI & PENGGUNA - Roadmap & Pembagian Tugas

**Estimasi Total:** 6-8 jam kerja efektif  
**Target Selesai:** [Tentukan deadline]  
**Tim:** 3 orang (Anda + 2 Anggota)

---

## 📋 Overview Fase 2

Fase 2 menambahkan fitur:
1. **OTP System** - Forgot password, verify OTP, reset password
2. **Change Password** - User yang login bisa ganti password
3. **User Management** - CRUD user oleh admin
4. **Deactivate User** - Admin bisa nonaktifkan user + revoke token
5. **Testing** - Minimal 15 automated tests

---

## 👥 PEMBAGIAN TUGAS

### 🔷 **ANGGOTA 1: OTP System & Change Password**

**Fokus:** Fitur yang berhubungan dengan password recovery dan security

**Estimasi:** 3-4 jam

#### **Checklist Anggota 1:**

```
FASE 2.1 - OTP SYSTEM
[ ] 2.1.1 - Buat OTPService (generate, send, verify, isExpired)
[ ] 2.1.2 - Buat ForgotPasswordRequest (validation)
[ ] 2.1.3 - Buat VerifyOtpRequest (validation)
[ ] 2.1.4 - Buat ResetPasswordRequest (validation)
[ ] 2.1.5 - Buat ForgotPasswordController (3 method)
[ ] 2.1.6 - Tambahkan route OTP (3 endpoint)
[ ] 2.1.7 - Update AuthService (tambah method resetPassword)
[ ] 2.1.8 - Test manual dengan Postman (3 scenario)

FASE 2.2 - CHANGE PASSWORD
[ ] 2.2.1 - Buat ChangePasswordRequest (validation)
[ ] 2.2.2 - Tambah method changePassword di AuthService
[ ] 2.2.3 - Tambah method changePassword di AuthController
[ ] 2.2.4 - Tambahkan route change-password
[ ] 2.2.5 - Test manual dengan Postman

FASE 2.4 - TESTING (Bagian Anggota 1)
[ ] 2.4.1 - Buat OtpTest.php (7 test)
[ ] 2.4.2 - Buat ChangePasswordTest.php (3 test)
[ ] 2.4.3 - Jalankan test dan pastikan hijau

Status: 0/16 ✅
```

---

### 🔶 **ANGGOTA 2: User Management (Admin)**

**Fokus:** CRUD user dan fitur admin

**Estimasi:** 3-4 jam

#### **Checklist Anggota 2:**

```
FASE 2.3 - USER MANAGEMENT
[ ] 2.3.1 - Buat UserService (CRUD logic)
[ ] 2.3.2 - Buat CreateUserRequest (validation)
[ ] 2.3.3 - Buat UpdateUserRequest (validation)
[ ] 2.3.4 - Buat UserResource (format response)
[ ] 2.3.5 - Buat UserController (CRUD methods)
[ ] 2.3.6 - Tambahkan route user management (5 endpoint)
[ ] 2.3.7 - Buat method deactivateUser di UserService
[ ] 2.3.8 - Tambah endpoint deactivate user
[ ] 2.3.9 - Test manual dengan Postman (5 scenario)

FASE 2.4 - TESTING (Bagian Anggota 2)
[ ] 2.4.4 - Buat UserManagementTest.php (6 test)
[ ] 2.4.5 - Jalankan test dan pastikan hijau

Status: 0/11 ✅
```

---

### 👤 **ANDA (Project Leader): Koordinasi & Verifikasi**

**Fokus:** Setup awal, review code, integrasi, dan finalisasi

**Estimasi:** 1-2 jam

#### **Checklist Anda:**

```
FASE 2.0 - SETUP & KOORDINASI
[ ] 2.0.1 - Brief tim tentang Fase 2 (30 menit)
[ ] 2.0.2 - Assign task ke Anggota 1 dan 2
[ ] 2.0.3 - Setup Git branch (fase-2-otp, fase-2-user-management)
[ ] 2.0.4 - Monitoring progress harian

FASE 2.5 - REVIEW & INTEGRASI
[ ] 2.5.1 - Code review Anggota 1 (OTP & Change Password)
[ ] 2.5.2 - Code review Anggota 2 (User Management)
[ ] 2.5.3 - Merge semua branch ke main
[ ] 2.5.4 - Resolve conflicts (jika ada)
[ ] 2.5.5 - Run semua test (Fase 1 + Fase 2)
[ ] 2.5.6 - Update ENDPOINTS.md (tambah endpoint baru)
[ ] 2.5.7 - Update Postman collection
[ ] 2.5.8 - Buat FASE_2_SUMMARY.md
[ ] 2.5.9 - Verifikasi checklist Definition of Done

Status: 0/13 ✅
```

---

## 📘 DETAIL TASK - ANGGOTA 1

### **FASE 2.1.1 - Buat OTPService**

**File:** `app/Services/OTPService.php`

**Isi:**
```php
<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OTPService
{
    /**
     * Generate OTP 6 digit random
     */
    public function generate(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Kirim OTP ke user (di-hash dan disimpan)
     */
    public function sendOTP(User $user, string $otp): void
    {
        $user->otp = Hash::make($otp);
        $user->otp_expired_at = now()->addMinutes(5);
        $user->save();

        // Development: Log OTP
        if (!app()->isProduction()) {
            Log::info("OTP untuk {$user->no_hp}: {$otp}");
        }

        // TODO Fase lanjutan: Kirim SMS
        // SMSGateway::send($user->no_hp, "Kode OTP Mediva: {$otp}");
    }

    /**
     * Verify OTP yang diinput user
     */
    public function verify(User $user, string $inputOtp): bool
    {
        if (!$user->otp || !$user->otp_expired_at) {
            return false;
        }

        if ($this->isExpired($user)) {
            return false;
        }

        return Hash::check($inputOtp, $user->otp);
    }

    /**
     * Cek apakah OTP sudah expired
     */
    public function isExpired(User $user): bool
    {
        if (!$user->otp_expired_at) {
            return true;
        }

        return $user->otp_expired_at->isPast();
    }

    /**
     * Clear OTP setelah berhasil diverifikasi atau expired
     */
    public function clear(User $user): void
    {
        $user->otp = null;
        $user->otp_expired_at = null;
        $user->otp_verified_at = now();
        $user->save();
    }
}
```

**Estimasi:** 30 menit

---

### **FASE 2.1.2-2.1.4 - Buat Request Validation**

**File 1:** `app/Http/Requests/ForgotPasswordRequest.php`
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'no_hp' => ['required', 'string', 'exists:users,no_hp'],
        ];
    }

    public function messages(): array
    {
        return [
            'no_hp.exists' => 'Nomor HP tidak terdaftar.',
        ];
    }
}
```

**File 2:** `app/Http/Requests/VerifyOtpRequest.php`
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'no_hp' => ['required', 'string', 'exists:users,no_hp'],
            'otp' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'no_hp.exists' => 'Nomor HP tidak terdaftar.',
            'otp.size' => 'OTP harus 6 digit.',
            'otp.regex' => 'OTP harus berupa angka.',
        ];
    }
}
```

**File 3:** `app/Http/Requests/ResetPasswordRequest.php`
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reset_token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
```

**Estimasi:** 20 menit

---

### **FASE 2.1.5 - Buat ForgotPasswordController**

**File:** `app/Http/Controllers/ForgotPasswordController.php`

**Isi:**
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Models\User;
use App\Services\OTPService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    protected $otpService;

    public function __construct(OTPService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Step 1: Request OTP
     */
    public function requestOtp(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('no_hp', $request->no_hp)->first();

        // Rate limit: 1 OTP per 1 menit per nomor
        if ($user->otp_expired_at && $user->otp_expired_at->isFuture()) {
            $remaining = $user->otp_expired_at->diffInSeconds(now());
            
            if ($remaining > 240) { // Masih lebih dari 4 menit (baru request)
                return $this->error(
                    'OTP masih berlaku. Tunggu hingga expired.',
                    429
                );
            }
        }

        // Generate dan kirim OTP
        $otp = $this->otpService->generate();
        $this->otpService->sendOTP($user, $otp);

        return $this->success(
            null,
            'OTP telah dikirim ke nomor Anda. Berlaku 5 menit.'
        );
    }

    /**
     * Step 2: Verify OTP
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $user = User::where('no_hp', $request->no_hp)->first();

        // Verify OTP
        if (!$this->otpService->verify($user, $request->otp)) {
            return $this->error('OTP tidak valid atau sudah expired.', 422);
        }

        // Generate reset token (valid 15 menit)
        $resetToken = Str::random(64);
        Cache::put("reset_token:{$resetToken}", $user->id, now()->addMinutes(15));

        // Clear OTP
        $this->otpService->clear($user);

        return $this->success([
            'reset_token' => $resetToken,
        ], 'OTP valid. Silakan reset password Anda.');
    }

    /**
     * Step 3: Reset Password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        // Validate reset token
        $userId = Cache::get("reset_token:{$request->reset_token}");

        if (!$userId) {
            return $this->error('Reset token tidak valid atau sudah expired.', 422);
        }

        // Update password
        $user = User::find($userId);
        $user->password = Hash::make($request->password);
        $user->save();

        // Revoke semua token (logout dari semua device)
        $user->tokens()->delete();

        // Delete reset token
        Cache::forget("reset_token:{$request->reset_token}");

        return $this->success(
            null,
            'Password berhasil diubah. Silakan login dengan password baru.'
        );
    }
}
```

**Estimasi:** 45 menit

---

### **FASE 2.1.6 - Tambahkan Route OTP**

**File:** `routes/api.php`

**Tambahkan:**
```php
// Forgot Password Flow (OTP)
Route::post('/forgot-password', [ForgotPasswordController::class, 'requestOtp'])
    ->middleware('throttle:otp');
Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);
```

**Import di atas:**
```php
use App\Http\Controllers\ForgotPasswordController;
```

**Estimasi:** 5 menit

---

### **FASE 2.2.1-2.2.5 - Change Password**

**Detail lengkap ada di brief terpisah yang akan saya berikan ke Anggota 1**

**Estimasi:** 1 jam

---

### **FASE 2.4.1-2.4.3 - Testing**

**File:** `tests/Feature/OtpTest.php`

**Test cases:**
1. `test_user_can_request_otp()`
2. `test_otp_expires_after_5_minutes()`
3. `test_cannot_request_otp_twice_within_1_minute()`
4. `test_can_verify_valid_otp()`
5. `test_cannot_verify_invalid_otp()`
6. `test_cannot_verify_expired_otp()`
7. `test_can_reset_password_with_valid_token()`

**Estimasi:** 1 jam

---

## 📘 DETAIL TASK - ANGGOTA 2

### **FASE 2.3.1 - Buat UserService**

**File:** `app/Services/UserService.php`

**Method yang perlu dibuat:**
```php
public function getAllUsers($perPage = 15)
public function getUserById($id)
public function createUser(array $data)
public function updateUser($id, array $data)
public function deleteUser($id) // Soft delete
public function deactivateUser($id)
public function activateUser($id)
```

**Estimasi:** 1 jam

---

### **FASE 2.3.2-2.3.3 - Request Validation**

**File:** `app/Http/Requests/CreateUserRequest.php`

**Validation rules:**
```php
'username' => 'required|unique:users',
'no_hp' => 'required|unique:users|regex:...',
'password' => 'required|min:8',
'role' => 'required|in:admin,staf',  // Pembeli tidak bisa dibuat admin
'jenis_kelamin' => 'nullable|in:L,P',
'tanggal_lahir' => 'nullable|date|before:today',
```

**File:** `app/Http/Requests/UpdateUserRequest.php`

**Estimasi:** 20 menit

---

### **FASE 2.3.4 - Buat UserResource**

**File:** `app/Http/Resources/UserResource.php`

**Format response:**
```json
{
  "id": 1,
  "username": "adminuser",
  "no_hp": "081234567890",
  "role": "admin",
  "jenis_kelamin": "L",
  "tanggal_lahir": "1990-01-01",
  "is_active": true,
  "created_at": "2026-11-03T10:00:00.000000Z"
}
```

**Estimasi:** 15 menit

---

### **FASE 2.3.5-2.3.6 - UserController & Routes**

**File:** `app/Http/Controllers/UserController.php`

**Endpoints:**
```
GET    /api/users           - List users (pagination)
POST   /api/users           - Create user (admin only)
GET    /api/users/{id}      - Show user detail
PUT    /api/users/{id}      - Update user
DELETE /api/users/{id}      - Delete user
PATCH  /api/users/{id}/deactivate  - Deactivate user
```

**Middleware:** `auth:sanctum` + `role:admin`

**Estimasi:** 1.5 jam

---

### **FASE 2.4.4-2.4.5 - Testing**

**File:** `tests/Feature/UserManagementTest.php`

**Test cases:**
1. `test_admin_can_list_users()`
2. `test_admin_can_create_staff_user()`
3. `test_admin_cannot_create_pembeli_via_api()`
4. `test_admin_can_update_user()`
5. `test_admin_can_deactivate_user()`
6. `test_staff_cannot_access_user_management()`

**Estimasi:** 1 jam

---

## 🔄 WORKFLOW TIM

### Day 1: Setup & Development
```
Pagi (09:00 - 12:00):
- ANDA: Brief tim, assign task, setup branch
- ANGGOTA 1: Mulai OTPService
- ANGGOTA 2: Mulai UserService

Siang (13:00 - 17:00):
- ANGGOTA 1: Lanjut controller & route OTP
- ANGGOTA 2: Lanjut controller & route User
- ANDA: Monitoring & code review berkala

Sore (17:00 - 18:00):
- ANGGOTA 1: Test manual Postman OTP
- ANGGOTA 2: Test manual Postman User
- ANDA: Review hasil hari ini
```

### Day 2: Testing & Integration
```
Pagi (09:00 - 12:00):
- ANGGOTA 1: Buat automated tests
- ANGGOTA 2: Buat automated tests
- ANDA: Review & merge preparation

Siang (13:00 - 17:00):
- ANDA: Merge semua branch
- TIM: Fix conflicts bersama
- TIM: Run semua test
- ANDA: Update dokumentasi

Sore (17:00 - 18:00):
- ANDA: Final verification
- TIM: Demo hasil Fase 2
```

---

## 📊 DEFINITION OF DONE - FASE 2

```
[ ] Semua task Anggota 1 selesai (16/16)
[ ] Semua task Anggota 2 selesai (11/11)
[ ] Semua task Anda selesai (13/13)
[ ] Total 15+ automated tests (semua hijau)
[ ] Test Fase 1 tetap hijau
[ ] Code sudah direview dan dimerge
[ ] No conflicts
[ ] Dokumentasi API updated
[ ] Postman collection updated
[ ] Manual testing dengan Postman sukses
[ ] FASE_2_SUMMARY.md dibuat
```

---

## 🎯 TIPS KOLABORASI

### Untuk Anggota 1 & 2:
1. **Commit sering:** Jangan tunggu selesai semua, commit per task kecil
2. **Push teratur:** Push ke branch masing-masing setiap selesai 1-2 task
3. **Komunikasi:** Update progress di group chat
4. **Tanya kalau buntu:** Jangan diam, tanya ke project leader
5. **Follow convention:** Ikuti naming dan structure yang sudah ada

### Untuk Project Leader:
1. **Daily standup:** 15 menit pagi untuk sync
2. **Code review:** Review commit secara berkala, bukan di akhir
3. **Unblock:** Bantu anggota yang stuck
4. **Test integration:** Tes gabungan code sebelum merge
5. **Documentation:** Update docs sendiri, jangan serahkan ke anggota

---

## 🚨 POTENTIAL ISSUES & SOLUTIONS

### Issue 1: Merge Conflict
**Prevention:**
- Buat branch terpisah (fase-2-otp, fase-2-user)
- Koordinasi file yang diubah
- Jangan edit file yang sama

**Solution jika terjadi:**
- Meeting 15 menit
- Resolve conflict bersama
- Test ulang setelah merge

### Issue 2: Anggota Stuck
**Solution:**
- Pair programming via screen share
- Tunjukkan contoh code yang mirip
- Beri referensi dokumentasi

### Issue 3: Test Fail
**Solution:**
- Run test per file: `php artisan test --filter=OtpTest`
- Debug dengan `dd()` atau `dump()`
- Cek database test sudah migrate

---

## 📞 SUPPORT

**Project Leader:** [Nama Anda]  
**Contact:** [WhatsApp/Telegram]

**Meeting:** Daily standup via [Google Meet/Zoom]  
**Chat:** Group WhatsApp/Telegram Tim Backend

---

## ✅ NEXT STEPS

1. **Print roadmap ini** dan bagikan ke Anggota 1 & 2
2. **Schedule meeting** untuk brief (30-60 menit)
3. **Setup Git branch** untuk masing-masing anggota
4. **Kick-off Fase 2** dan mulai development!

---

**Semangat! Fase 2 lebih kompleks tapi kalau dibagi jadi mudah! 💪**
