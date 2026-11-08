# 🧪 Panduan Testing API Mediva dengan Postman

Dokumen ini menjelaskan langkah-langkah testing manual API Mediva menggunakan Postman.

---

## 📥 Setup Awal

### 1. Import Postman Collection

1. Buka Postman
2. Klik **Import** di pojok kiri atas
3. Pilih file: `Mediva_API_Postman_Collection.json`
4. Collection "Mediva API - Fase 1" akan muncul di sidebar

### 2. Setup Environment (Opsional tapi Disarankan)

**Cara 1: Pakai Variable di Collection**
- Collection sudah punya variable `base_url` dan `token`
- Tidak perlu setup environment

**Cara 2: Buat Environment Terpisah (Lebih Rapi)**
1. Klik ⚙️ (Manage Environments) di pojok kanan atas
2. Klik **Add** / **Create Environment**
3. Nama: `Mediva Local`
4. Tambahkan 2 variable:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8000/api` | `http://localhost:8000/api` |
| `token` | (kosongkan) | (kosongkan) |

5. **Save**
6. Pilih environment "Mediva Local" di dropdown pojok kanan atas

---

## 🚀 Jalankan Laravel Server

Sebelum testing, pastikan Laravel server sudah jalan:

```bash
cd C:\laragon\www\Mediva\Backend
php artisan serve
```

Output yang benar:
```
Starting Laravel development server: http://127.0.0.1:8000
```

Biarkan terminal ini tetap jalan selama testing.

---

## ✅ Skenario Testing - FASE 1

### **Skenario 1: Health Check**

**Tujuan:** Memastikan API dan database jalan normal.

**Langkah:**
1. Buka request: **Public Endpoints** → **Health Check**
2. Klik **Send**
3. Cek response:

**Expected Response (200 OK):**
```json
{
  "status": "success",
  "message": "API berjalan normal.",
  "data": {
    "app": "Mediva",
    "env": "local",
    "version": "1.0.0",
    "server": "ok",
    "database": "ok",  // ✅ INI YANG PENTING - harus "ok"
    "db_error": null,
    "time": "2026-11-03T10:30:00+00:00"
  }
}
```

**✅ Pass jika:**
- Status code: 200
- `database`: "ok"
- `db_error`: null

**❌ Fail jika:**
- Status code: 503
- `database`: "error"
- Ada pesan error di `db_error`

**Troubleshooting jika fail:**
```bash
# Cek koneksi database di .env
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-northeast-2.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.xgnytjgkrxelkcvdzxck
DB_PASSWORD="Mediva.s99m"

# Test koneksi manual
php artisan tinker
>>> DB::connection()->getPdo();
```

---

### **Skenario 2: Register User Baru**

**Tujuan:** Mendaftarkan user baru dan mendapatkan token.

**Langkah:**
1. Buka request: **Public Endpoints** → **Register (Pembeli)**
2. Edit Body JSON (ganti username dan no_hp supaya unique):

```json
{
  "username": "johndoe1",
  "no_hp": "081234567890",
  "password": "password123",
  "password_confirmation": "password123",
  "jenis_kelamin": "L",
  "tanggal_lahir": "1995-05-15"
}
```

3. Klik **Send**

**Expected Response (201 Created):**
```json
{
  "status": "success",
  "message": "Pendaftaran Berhasil",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe1",
      "no_hp": "081234567890",
      "role": "pembeli",
      "is_active": true
    },
    "token": "1|abcdef123456..."  // ✅ TOKEN OTOMATIS TERSIMPAN
  }
}
```

**✅ Pass jika:**
- Status code: 201
- Ada `token` di response
- Role otomatis jadi "pembeli"
- Token otomatis tersimpan ke environment variable `{{token}}`

**Cek token tersimpan:**
- Klik tab **Console** di bawah Postman
- Lihat log: `Token saved: 1|abcdef...`

**❌ Common Errors:**

**Error 422 - Username sudah dipakai:**
```json
{
  "status": "error",
  "message": "Data yang dikirim tidak valid.",
  "errors": {
    "username": ["The username has already been taken."]
  }
}
```
**Solusi:** Ganti username jadi `johndoe2`, `johndoe3`, dst.

**Error 422 - Format nomor HP salah:**
```json
{
  "errors": {
    "no_hp": ["Format nomor HP tidak valid."]
  }
}
```
**Solusi:** Nomor HP harus dimulai 08 atau +62 atau 62, contoh: `081234567890`

**Error 429 - Rate limit:**
```json
{
  "status": "error",
  "message": "Terlalu banyak percobaan login. Coba lagi dalam 1 menit."
}
```
**Solusi:** Tunggu 1 menit. Rate limit: 7 request per menit.

---

### **Skenario 3: Login dengan User yang Sudah Ada**

**Tujuan:** Login dan mendapatkan token baru.

**Langkah:**
1. Buka request: **Public Endpoints** → **Login**
2. Edit Body JSON (sesuaikan dengan user yang sudah register):

```json
{
  "login_id": "johndoe1",
  "password": "password123"
}
```

**Note:** `login_id` bisa diisi `username` ATAU `no_hp`

3. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe1",
      "role": "pembeli"
    },
    "token": "2|xyz789abc..."  // ✅ TOKEN BARU
  }
}
```

**✅ Pass jika:**
- Status code: 200
- Token baru tersimpan (cek Console log)

**❌ Common Errors:**

**Error 422 - Kredensial salah:**
```json
{
  "errors": {
    "login_id": ["Kredensial yang diberikan tidak sesuai."]
  }
}
```
**Solusi:** Cek username dan password. Pastikan sesuai dengan data register.

---

### **Skenario 4: Get Current User (Protected Endpoint)**

**Tujuan:** Mengakses endpoint yang perlu authentication.

**Langkah:**
1. Pastikan sudah login di Skenario 2 atau 3 (token tersimpan)
2. Buka request: **Protected Endpoints** → **Get Current User**
3. Cek tab **Authorization**:
   - Type: **Bearer Token**
   - Token: `{{token}}` ✅ (otomatis pakai token dari environment)
4. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe1",
  "no_hp": "081234567890",
  "role": "pembeli",
  "is_active": true,
  "created_at": "...",
  "updated_at": "..."
}
```

**✅ Pass jika:**
- Status code: 200
- Data user sesuai dengan user yang login

**❌ Error 401 - Token tidak valid:**
```json
{
  "status": "error",
  "message": "Tidak terautentikasi. Silakan login terlebih dahulu."
}
```

**Solusi:**
1. Cek variable `{{token}}` terisi atau tidak:
   - Klik ⚙️ Manage Environments
   - Cek variable `token` ada value-nya
2. Kalau kosong, login ulang (Skenario 3)
3. Atau copy-paste token manual dari response login

---

### **Skenario 5: Test Role Middleware (Admin Only)**

**Tujuan:** Membuktikan middleware role bekerja.

**Langkah:**
1. Login sebagai pembeli (Skenario 3)
2. Buka request: **Protected Endpoints** → **Get Obat Count (Admin Only)**
3. Klik **Send**

**Expected Response (403 Forbidden):**
```json
{
  "status": "error",
  "message": "Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini."
}
```

**✅ Pass jika:**
- Status code: 403
- Pembeli TIDAK bisa akses endpoint admin

---

**Untuk test dengan role admin:**

**Cara manual (sementara - nanti di Fase 2 akan ada endpoint create user):**

```bash
# Di terminal Laravel:
php artisan tinker

# Buat user admin:
>>> $admin = new App\Models\User;
>>> $admin->username = 'admintest';
>>> $admin->no_hp = '081111111111';
>>> $admin->password = bcrypt('admin123');
>>> $admin->role = 'admin';
>>> $admin->is_active = true;
>>> $admin->save();
>>> exit
```

**Sekarang login dengan user admin:**

Request: **Login**
```json
{
  "login_id": "admintest",
  "password": "admin123"
}
```

Token admin tersimpan.

**Test akses endpoint admin:**

Request: **Get Obat Count (Admin Only)**

**Expected Response (200 OK):**
```json
{
  "status": "success",
  "message": "Jumlah obat berhasil diambil.",
  "data": {
    "total": 0
  }
}
```

**✅ Pass jika:**
- Admin BISA akses (200)
- Pembeli TIDAK bisa akses (403)

---

### **Skenario 6: Logout**

**Tujuan:** Menghapus token (logout dari device ini).

**Langkah:**
1. Pastikan sudah login (ada token)
2. Buka request: **Protected Endpoints** → **Logout**
3. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "status": "success",
  "message": "Logout berhasil",
  "data": null
}
```

**✅ Pass jika:**
- Status code: 200

**Verifikasi logout berhasil:**
1. Setelah logout, coba hit **Get Current User** lagi
2. Harus error 401 (token sudah tidak valid)

**Note:** Token masih tersimpan di environment variable Postman, tapi sudah tidak valid di database. Untuk test ulang, harus login lagi.

---

## 🔄 Flow Testing Lengkap (End-to-End)

Urutan testing yang disarankan:

```
1. Health Check           → Pastikan API & DB OK
2. Register               → Buat user baru (dapat token)
3. Get Current User       → Test token valid
4. Get Obat Count         → Test middleware (harus 403 untuk pembeli)
5. Logout                 → Hapus token
6. Get Current User lagi  → Harus 401 (token tidak valid)
7. Login                  → Login lagi dengan user yang sama
8. Get Current User       → Token baru valid lagi
```

---

## 📊 Checklist Testing Fase 1

Gunakan checklist ini untuk memastikan semua sudah ditest:

```
[ ] Health check berhasil (200, database: ok)
[ ] Register user baru berhasil (201, dapat token)
[ ] Token otomatis tersimpan di environment
[ ] Login berhasil (200, dapat token baru)
[ ] Login dengan username berhasil
[ ] Login dengan no_hp berhasil
[ ] Login dengan password salah ditolak (422)
[ ] Get current user dengan token valid (200)
[ ] Get current user tanpa token ditolak (401)
[ ] Pembeli tidak bisa akses endpoint admin (403)
[ ] Admin bisa akses endpoint admin (200)
[ ] Logout berhasil (200)
[ ] Token setelah logout tidak valid lagi (401)
```

---

## 🐛 Troubleshooting

### Problem: "Failed to fetch" / "Could not get any response"

**Penyebab:** Laravel server tidak jalan.

**Solusi:**
```bash
php artisan serve
```

---

### Problem: Token tidak tersimpan otomatis

**Solusi manual:**
1. Copy token dari response login/register
2. Klik ⚙️ Manage Environments
3. Paste token ke variable `token`
4. Save

**Atau cek script di tab Tests:**
```javascript
var jsonData = pm.response.json();
if (jsonData.status === "success" && jsonData.data.token) {
    pm.environment.set("token", jsonData.data.token);
}
```

---

### Problem: Database error di health check

**Cek:**
```bash
# .env harus benar
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-northeast-2.pooler.supabase.com

# Test manual
php artisan tinker
>>> DB::connection()->getPdo();
```

---

## 📞 Support

Jika ada error yang tidak bisa diselesaikan:
1. Screenshot response error
2. Screenshot request (URL, Headers, Body)
3. Cek Laravel log: `storage/logs/laravel.log`

---

## ✅ Kesimpulan

Setelah semua skenario ditest dan checklist selesai, **Fase 1 Testing dengan Postman SELESAI**.

Next: Automated testing dengan PHPUnit (`php artisan test`).
