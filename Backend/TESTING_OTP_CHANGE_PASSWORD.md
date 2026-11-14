# Testing Guide - OTP & Change Password

**Fase 2 Testing Manual dengan Postman**

## Prerequisites
- Laravel server berjalan: `php artisan serve`
- Postman environment setup
- User test sudah ada di database

---

## A. OTP System Testing

### A1. Send OTP - Success
**Endpoint:** `POST {{base_url}}/api/forgot-password`

**Body:**
```json
{
    "identifier": "pembeli1"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Kode OTP telah dikirim",
    "data": {
        "expires_at": "2026-11-14 15:30:00"
    }
}
```

**Validasi:**
- ✅ OTP tercatat di logs: `tail -f storage/logs/laravel.log`
- ✅ OTP expire dalam 10 menit
- ✅ Rate limit: max 3 requests per 10 menit

---

### A2. Verify OTP - Success
**Endpoint:** `POST {{base_url}}/api/verify-otp`

**Body:**
```json
{
    "identifier": "pembeli1",
    "otp": "123456"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Kode OTP berhasil diverifikasi"
}
```

**Validasi:**
- ✅ OTP verified_at tercatat
- ✅ Rate limit: max 5 attempts per 10 menit

---

### A3. Reset Password - Success
**Endpoint:** `POST {{base_url}}/api/reset-password`

**Body:**
```json
{
    "identifier": "pembeli1",
    "otp": "123456",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Password berhasil direset. Silakan login dengan password baru"
}
```

**Validasi:**
- ✅ Password berhasil diupdate
- ✅ OTP cleared dari database
- ✅ Semua token revoked
- ✅ Bisa login dengan password baru

---

### A4. Error Cases

#### OTP Expired
**Test:** Tunggu >10 menit setelah send OTP, lalu verify

**Expected (400):**
```json
{
    "success": false,
    "message": "Kode OTP tidak valid atau sudah kedaluwarsa"
}
```

#### OTP Invalid
**Test:** Verify dengan OTP salah

**Expected (400):**
```json
{
    "success": false,
    "message": "Kode OTP tidak valid atau sudah kedaluwarsa"
}
```

#### User Not Found
**Test:** Kirim OTP dengan identifier tidak ada

**Expected (404):**
```json
{
    "success": false,
    "message": "User tidak ditemukan"
}
```

---

## B. Change Password Testing

### B1. Change Password - Success
**Endpoint:** `POST {{base_url}}/api/change-password`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:**
```json
{
    "current_password": "password123",
    "password": "newpassword456",
    "password_confirmation": "newpassword456"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Password berhasil diubah. Silakan login kembali"
}
```

**Validasi:**
- ✅ Password berhasil diupdate
- ✅ Semua token revoked (harus login ulang)

---

### B2. Error Cases

#### Wrong Current Password
**Expected (422):**
```json
{
    "message": "The given data was invalid",
    "errors": {
        "current_password": ["Password saat ini tidak sesuai"]
    }
}
```

#### Same Password
**Body:**
```json
{
    "current_password": "password123",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Expected (422):**
```json
{
    "errors": {
        "password": ["Password baru harus berbeda dari password saat ini"]
    }
}
```

#### Unauthenticated
**Test:** Tanpa Authorization header

**Expected (401):**
```json
{
    "message": "Unauthenticated."
}
```

---

## C. Security Validation

### Rate Limiting
- ✅ `/forgot-password`: max 3 per 10 menit
- ✅ `/verify-otp`: max 5 per 10 menit
- ✅ `/reset-password`: max 3 per 10 menit

### OTP Security
- ✅ OTP di-hash di database (bcrypt)
- ✅ OTP expire 10 menit
- ✅ OTP cleared setelah digunakan
- ✅ OTP verification required sebelum reset

### Token Revocation
- ✅ Reset password → revoke all tokens
- ✅ Change password → revoke all tokens

---

## D. Test Checklist

### OTP System
- [ ] Send OTP - Success
- [ ] Send OTP - User not found
- [ ] Send OTP - Rate limit
- [ ] Verify OTP - Success
- [ ] Verify OTP - Invalid
- [ ] Verify OTP - Expired
- [ ] Reset password - Success
- [ ] Reset password - OTP not verified

### Change Password
- [ ] Change password - Success
- [ ] Change password - Wrong current password
- [ ] Change password - Same password
- [ ] Change password - Unauthenticated

---

## E. Debug Tips

**Check OTP in logs:**
```bash
tail -f storage/logs/laravel.log | grep OTP
```

**Check database:**
```sql
SELECT id, username, otp, otp_expired_at, otp_verified_at 
FROM users 
WHERE username = 'pembeli1';
```

**Check tokens:**
```sql
SELECT * FROM personal_access_tokens WHERE tokenable_id = 2;
```

---

## Next Steps
- Automated tests akan dijalankan di CI/CD pipeline
- Manual testing cukup untuk development phase
- Production: Monitor rate limiting & OTP abuse
