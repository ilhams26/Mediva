# Testing Guide - OTP Registration with Fonnte

**Fase 2.5: OTP WhatsApp Integration untuk Registrasi**

---

## 🎯 DUAL MODE: Testing vs Production

### Testing Mode (Default)
```env
FONNTE_ENABLED=false
```
- ✅ OTP **TIDAK** dikirim ke WhatsApp
- ✅ OTP logged ke `storage/logs/otp.log`
- ✅ Response include OTP untuk testing
- ✅ No quota usage

### Production Mode
```env
FONNTE_ENABLED=true
FONNTE_TOKEN=your_token_here
```
- ✅ OTP **DIKIRIM** via Fonnte WhatsApp API
- ✅ OTP logged for audit trail
- ✅ Response **TIDAK** include OTP
- ✅ Quota tracking di Fonnte dashboard

---

## A. TESTING MODE (Development)

### A1. Register - Success
**Endpoint:** `POST {{base_url}}/api/register`

**Body:**
```json
{
    "username": "pembeli_test",
    "no_hp": "081234567890",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Expected Response (201):**
```json
{
    "success": true,
    "message": "Pendaftaran berhasil. Kode OTP: 123456",
    "data": {
        "user": {
            "id": 5,
            "username": "pembeli_test",
            "no_hp": "081234567890"
        },
        "otp_sent": true,
        "expires_at": "2026-11-14 16:30:00",
        "otp": "123456"
    }
}
```

**Validasi:**
- ✅ User created dengan `is_active = false`
- ✅ OTP di-generate & hash di database
- ✅ OTP muncul di response (testing mode)
- ✅ Check log: `tail -f storage/logs/otp.log`

---

### A2. Verify OTP - Success
**Endpoint:** `POST {{base_url}}/api/verify-otp-register`

**Body:**
```json
{
    "no_hp": "081234567890",
    "otp": "123456"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Akun berhasil diverifikasi. Selamat datang di Mediva!",
    "data": {
        "user": {
            "id": 5,
            "username": "pembeli_test",
            "no_hp": "081234567890",
            "role": "pembeli",
            "is_active": true
        },
        "token": "5|xxxxxxxxxxxxxxx"
    }
}
```

**Validasi:**
- ✅ `is_active` berubah ke `true`
- ✅ OTP cleared dari database
- ✅ Token generated (auto-login)
- ✅ Bisa akses protected endpoints

---

### A3. Login Before Verification - Error
**Endpoint:** `POST {{base_url}}/api/login`

**Body:**
```json
{
    "login_id": "081234567890",
    "password": "password123"
}
```

**Expected Response (422):**
```json
{
    "message": "The given data was invalid",
    "errors": {
        "login_id": ["Akun belum diverifikasi. Silakan verifikasi OTP terlebih dahulu"]
    }
}
```

---

### A4. Verify OTP - Invalid
**Body:**
```json
{
    "no_hp": "081234567890",
    "otp": "999999"
}
```

**Expected Response (422):**
```json
{
    "errors": {
        "otp": ["Kode OTP tidak valid atau sudah kedaluwarsa"]
    }
}
```

---

### A5. Verify OTP - Expired
**Test:** Tunggu >10 menit setelah register

**Expected Response (422):**
```json
{
    "errors": {
        "otp": ["Kode OTP tidak valid atau sudah kedaluwarsa"]
    }
}
```

---

### A6. Rate Limiting

#### Register Rate Limit
**Test:** Request `/register` 2× dengan no_hp sama dalam 5 menit

**Expected (429 on 2nd request):**
```json
{
    "message": "Too Many Attempts."
}
```

#### Verify OTP Rate Limit
**Test:** Request `/verify-otp-register` 6× dalam 10 menit

**Expected (429 on 6th request):**
```json
{
    "message": "Too Many Attempts."
}
```

---

## B. PRODUCTION MODE (with Fonnte)

### B1. Enable Fonnte
Update `.env`:
```env
FONNTE_ENABLED=true
FONNTE_TOKEN=your_actual_token_from_fonnte_dashboard
```

### B2. Register - Production
**Endpoint:** `POST {{base_url}}/api/register`

**Body:**
```json
{
    "username": "real_user",
    "no_hp": "081234567890",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Expected Response (201):**
```json
{
    "success": true,
    "message": "Pendaftaran berhasil. Kode OTP telah dikirim ke WhatsApp Anda",
    "data": {
        "user": {
            "id": 6,
            "username": "real_user",
            "no_hp": "081234567890"
        },
        "otp_sent": true,
        "expires_at": "2026-11-14 16:40:00",
        "otp": null
    }
}
```

**Validasi:**
- ✅ OTP **TIDAK** muncul di response (production)
- ✅ User terima WhatsApp message:
  ```
  🏥 MEDIVA - Smart Medicine Platform
  
  Kode verifikasi Anda: 123456
  
  Berlaku 10 menit.
  
  Jangan bagikan kode ini ke siapa pun.
  ```
- ✅ Check Fonnte quota di dashboard

### B3. Verify OTP - Production
Same as Testing Mode, user input OTP dari WhatsApp.

---

## C. Phone Number Sanitization

Laravel backend otomatis convert format:

| Input | Sanitized (Sent to Fonnte) |
|---|---|
| `081234567890` | `628123456789` |
| `8123456789` | `628123456789` |
| `628123456789` | `628123456789` |
| `+628123456789` | `628123456789` |

---

## D. Check Logs

### OTP Log (Testing Mode)
```bash
tail -f storage/logs/otp.log
```

**Sample Output:**
```json
{
    "phone": "628123456789",
    "otp": "123456",
    "expires_at": "2026-11-14 16:30:00",
    "message": "🏥 MEDIVA - Smart Medicine Platform..."
}
```

### Laravel Log (All Modes)
```bash
tail -f storage/logs/laravel.log | grep OTP
```

---

## E. Database Check

```sql
-- Check user registration status
SELECT id, username, no_hp, is_active, otp, otp_expired_at 
FROM users 
WHERE username = 'pembeli_test';

-- Check OTP verification
SELECT id, username, is_active, otp_verified_at 
FROM users 
WHERE no_hp = '081234567890';
```

---

## F. Test Checklist

### Registration Flow
- [ ] Register dengan data valid - Success (201)
- [ ] Register dengan no_hp duplicate - Error (422)
- [ ] Register dengan username duplicate - Error (422)
- [ ] Register rate limit (1 per 5 min) - Error (429)
- [ ] OTP logged ke storage/logs/otp.log
- [ ] User created dengan `is_active = false`

### OTP Verification
- [ ] Verify dengan OTP valid - Success (200)
- [ ] Verify dengan OTP invalid - Error (422)
- [ ] Verify dengan OTP expired - Error (422)
- [ ] Verify dengan no_hp tidak ada - Error (422)
- [ ] Verify rate limit (5 per 10 min) - Error (429)
- [ ] User `is_active` berubah ke `true`
- [ ] OTP cleared dari database
- [ ] Token generated (auto-login)

### Login Flow
- [ ] Login sebelum OTP verified - Error (422)
- [ ] Login setelah OTP verified - Success (200)
- [ ] Login dengan password salah - Error (422)

### Production (Fonnte)
- [ ] Enable FONNTE_ENABLED=true
- [ ] OTP dikirim ke WhatsApp
- [ ] OTP **TIDAK** muncul di response
- [ ] Message format sesuai template
- [ ] Quota Fonnte tracked

---

## G. Troubleshooting

### OTP tidak terkirim (Production)
1. Check `.env`: `FONNTE_ENABLED=true`
2. Check Fonnte token valid
3. Check Fonnte quota tersisa
4. Check logs: `storage/logs/laravel.log`

### OTP selalu invalid
1. Check OTP belum expired (10 menit)
2. Check phone number format match
3. Check database: OTP hash tersimpan

### Rate limit hit saat testing
1. Wait atau clear cache: `php artisan cache:clear`
2. Atau gunakan phone number berbeda

---

## Next Steps
1. Test manual dengan Postman (Testing Mode)
2. Enable Production Mode
3. Test dengan real WhatsApp number
4. Monitor Fonnte quota
5. Ready untuk Flutter/React integration
