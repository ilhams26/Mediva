# Panduan Testing Postman Collection Mediva API

## 📋 Ringkasan Cepat

| Item | Detail |
|------|--------|
| **Collection Name** | Mediva API |
| **Environment** | Mediva Local |
| **Total Endpoints** | 26 |
| **Workspace** | Ilham Ghazali's Workspace |
| **Hook Status** | ✅ Active (postman-auto-test) |

> **Note**: Collection ID dan Environment ID disimpan di `.postman.json` (local only)

---

## 🚀 Quick Start Testing

### 1. Pastikan Laravel Server Berjalan
```bash
cd Backend
php artisan serve
```
Server akan berjalan di: `http://localhost:8000`

### 2. Buka Postman
- Ke workspace: "Ilham Ghazali's Workspace"
- Lihat collection: "Mediva API"
- Pilih environment: "Mediva Local"

### 3. Manual Testing Flow
```
1. Health Check (tanpa auth) ✅
   GET /api/health
   
2. Register User
   POST /api/register
   Body: {"username": "testuser", "no_hp": "081234567890", "password": "password123", ...}
   
3. Verify OTP
   POST /api/verify-otp-register
   Body: {"no_hp": "081234567890", "otp": "123456"}
   
4. Login
   POST /api/login
   Body: {"no_hp": "081234567890", "password": "password123"}
   Response: {"token": "xxx"}
   
5. SAVE TOKEN ke environment
   Variable: {{access_token}} = token dari response
   
6. Test Protected Endpoints
   GET /api/user (sekarang bisa dengan token)
   POST /api/logout
   
7. Create Order
   POST /api/orders
   Body: {"items": [{"obat_id": 1, "qty": 2}], "metode_pembayaran": "cash"}
```

---

## 🤖 Automated Testing dengan Hook

### Bagaimana Cara Kerjanya?

```
┌─────────────────────────────────────────────────────┐
│ Developer Edit Controller/Routes                    │
│ Backend/app/Http/Controllers/OrderController.php   │
└────────────────────┬────────────────────────────────┘
                     │
                     ├─ Tekan Ctrl+S (Save)
                     ↓
┌──────────────────────────────────────────────────────┐
│ Hook: PostFileSave terpicu                           │
│ Matcher: Backend/(Controllers|Requests)/.*\.php$    │
└────────────────────┬───────────────────────────────┘
                     │
                     ├─ Hook menjalankan agent prompt
                     ↓
┌──────────────────────────────────────────────────────┐
│ Kiro otomatis:                                       │
│ - Jalankan Postman collection test                  │
│ - Test semua endpoint dengan environment variables │
│ - Kumpulkan hasil                                   │
└────────────────────┬───────────────────────────────┘
                     │
                     ├─ Tampilkan hasil di chat Kiro
                     ↓
┌──────────────────────────────────────────────────────┐
│ HASIL TESTING:                                       │
│ ✅ GET /api/health - 200 OK                         │
│ ❌ POST /api/orders - 500 Error                     │
│ ✅ GET /api/user - 200 OK                           │
│                                                      │
│ REKOMENDASI:                                         │
│ "Error 500 di POST /orders - cek database fields"  │
└──────────────────────────────────────────────────────┘
```

### Kapan Hook Otomatis Berjalan?

Hook terpicu ketika Anda **save file** di folder:
- `Backend/app/Http/Controllers/` - Semua controller
- `Backend/app/Http/Requests/` - Semua request validation
- `Backend/routes/api.php` - Routes file

**Contoh:**
```
✅ Save OrderController.php → Hook berjalan
✅ Save CreateOrderRequest.php → Hook berjalan
✅ Save routes/api.php → Hook berjalan
❌ Save model/Order.php → Hook TIDAK berjalan (bukan pattern)
```

---

## 📊 Endpoint Testing Categories

### 1. **Public Endpoints** (Tanpa Auth)
```
✅ GET    /api/health              - Health check
✅ POST   /api/register             - Register user
✅ POST   /api/verify-otp-register  - Verify OTP register
✅ POST   /api/login                - Login (dapatkan token)
✅ POST   /api/forgot-password      - Request reset password
✅ POST   /api/verify-otp           - Verify OTP reset
✅ POST   /api/reset-password       - Reset password
```

**Testing Tips:**
- Tidak perlu authorization header
- Body JSON harus valid sesuai rules di Request file
- Perhatikan validasi phone number format

### 2. **Protected Endpoints** (Perlu Auth Token)
```
✅ GET    /api/user               - Get user info
✅ POST   /api/logout             - Logout
✅ POST   /api/change-password    - Change password
```

**Testing Tips:**
- Gunakan access_token dari login
- Header: `Authorization: Bearer {{access_token}}`
- Jika 401 Unauthorized: Token expired, login ulang

### 3. **Orders Endpoints**
```
✅ GET    /api/orders                - List orders
✅ POST   /api/orders                - Create order
✅ GET    /api/orders/{id}           - Get order detail
✅ PATCH  /api/orders/{id}/status    - Update status (admin)
✅ POST   /api/orders/{id}/cancel    - Cancel order
```

**Testing Tips:**
- Pembeli hanya bisa lihat order milik sendiri
- Admin bisa lihat semua order
- Status update hanya untuk admin

### 4. **Resep Endpoints**
```
✅ GET    /api/resep               - List resep
✅ POST   /api/resep               - Create resep
✅ GET    /api/resep/{id}          - Get resep detail
✅ POST   /api/resep/{id}/validate - Validate resep (admin)
```

### 5. **Admin Endpoints**
```
✅ GET    /api/obat/count          - Count obat
✅ GET    /api/users               - List users
✅ POST   /api/users               - Create user
✅ GET    /api/users/{id}          - Get user detail
✅ PUT    /api/users/{id}          - Update user
✅ DELETE /api/users/{id}          - Delete user
✅ PATCH  /api/users/{id}/status   - Toggle status
```

---

## 🔧 Environment Variables Setup

**File**: Postman → Environments → "Mediva Local"

```json
{
  "base_url": "http://localhost:8000",
  "access_token": "",              // ← Update setelah login
  "test_phone": "081234567890",
  "test_password": "password123"   // ← Ganti dengan password test Anda
}
```

**Cara Update Token:**
1. Login di Postman
2. Copy `access_token` dari response JSON
3. Set di environment variable

---

## 🐛 Troubleshooting

### Problem: "Connection refused"
**Solution:**
- Pastikan Laravel server berjalan: `php artisan serve`
- Check base_url di environment benar

### Problem: "401 Unauthorized"
**Solution:**
- Access token expired → Login ulang
- Update {{access_token}} di environment
- Check Authorization header: `Bearer {{access_token}}`

### Problem: "Validation failed"
**Solution:**
- Cek format JSON body
- Verifikasi field wajib (required)
- Contoh: phone harus format: 08xxxxx atau +62xxxxx

### Problem: "500 Internal Server Error"
**Solution:**
- Cek Laravel log: `tail -f storage/logs/laravel.log`
- Verifikasi database connection
- Check validation rules di Request file

---

## 📝 Test Case Scenarios

### Scenario 1: User Registration Flow
```
1. POST /api/register
   Body: {
     "username": "ilham",
     "no_hp": "081234567890",
     "password": "Password123!",
     "password_confirmation": "Password123!",
     "jenis_kelamin": "L",
     "tanggal_lahir": "1990-01-01"
   }

2. Response diperoleh OTP (hardcoded atau dari Fonnte service)

3. POST /api/verify-otp-register
   Body: {
     "no_hp": "081234567890",
     "otp": "123456"
   }

4. Account aktif, siap login
```

### Scenario 2: Order Creation Flow
```
1. POST /api/login → dapatkan token

2. POST /api/orders
   Body: {
     "items": [
       {"obat_id": 1, "qty": 2},
       {"obat_id": 3, "qty": 5}
     ],
     "metode_pembayaran": "cash"
   }

3. GET /api/orders → lihat order baru

4. GET /api/orders/{order_id} → detail order

5. PATCH /api/orders/{order_id}/status → admin update status
```

---

## ✅ Checklist Before Testing

- [ ] Laravel server running: `php artisan serve`
- [ ] Database migrated: `php artisan migrate`
- [ ] Postman collection imported atau terbuka
- [ ] Environment "Mediva Local" dipilih
- [ ] base_url benar: http://localhost:8000
- [ ] Access token kosong di awal
- [ ] Hook aktif untuk auto testing
- [ ] Credentials tidak disimpan di repo

---

## 🎯 Next Steps

1. **Test Manual** - Jalankan flow di atas manual untuk familiar
2. **Setup Hook** - Hook sudah dibuat, hanya perlu edit file controller untuk trigger
3. **Monitoring** - Setiap kali save file, lihat test results di Kiro chat
4. **Debug Errors** - Jika ada error, perbaiki code dan hook auto-test ulang
5. **Integration** - Setup CI/CD nanti untuk automated testing di pipeline

---

## 🔒 Security Notes

- Tidak ada credential yang disimpan di file yang di-push
- Collection ID dan Environment ID hanya di `.postman.json` (local)
- Postman API Key tidak disimpan di file yang di-commit
- Semua sensitive data di environment variable lokal

