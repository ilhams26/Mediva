6# 📡 Mediva API Endpoints Documentation

**Base URL:** `http://localhost:8000/api`  
**Authentication:** Bearer Token (Sanctum)  
**Response Format:** JSON

---

## 🟢 Public Endpoints (Tidak perlu authentication)

### Health Check

Mengecek status kesehatan API dan koneksi database.

```http
GET /api/health
```

**Response 200 OK:**
```json
{
  "status": "success",
  "message": "API berjalan normal.",
  "data": {
    "app": "Mediva",
    "env": "local",
    "version": "1.0.0",
    "server": "ok",
    "database": "ok",
    "db_error": null,
    "time": "2026-11-03T10:30:00+00:00",
    "timezone": "UTC"
  }
}
```

**Response 503 Service Unavailable (jika database error):**
```json
{
  "status": "success",
  "message": "API berjalan, tapi ada masalah.",
  "data": {
    "app": "Mediva",
    "server": "ok",
    "database": "error",
    "db_error": "Koneksi database gagal."
  }
}
```

---

### Register (Pendaftaran Pembeli)

Mendaftarkan user baru dengan role `pembeli`.

```http
POST /api/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe",
  "no_hp": "081234567890",
  "password": "password123",
  "password_confirmation": "password123",
  "jenis_kelamin": "L",
  "tanggal_lahir": "1995-05-15"
}
```

**Field Rules:**
- `username`: required, string, max 255, unique
- `no_hp`: required, format Indonesia (081234567890 atau +6281234567890), unique
- `password`: required, min 8 karakter, harus sama dengan confirmation
- `jenis_kelamin`: optional, "L" atau "P"
- `tanggal_lahir`: optional, format YYYY-MM-DD, harus tanggal masa lalu

**Response 201 Created:**
```json
{
  "status": "success",
  "message": "Pendaftaran Berhasil",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "no_hp": "081234567890",
      "role": "pembeli",
      "jenis_kelamin": "L",
      "tanggal_lahir": "1995-05-15",
      "is_active": true
    },
    "token": "1|abcdef123456..."
  }
}
```

**Response 422 Validation Error:**
```json
{
  "status": "error",
  "message": "Data yang dikirim tidak valid.",
  "errors": {
    "username": ["The username has already been taken."],
    "no_hp": ["Format nomor HP tidak valid."]
  }
}
```

**Response 429 Too Many Requests:**
```json
{
  "status": "error",
  "message": "Terlalu banyak percobaan login. Coba lagi dalam 1 menit."
}
```

**Rate Limit:** 7 request per menit per IP

---

### Login

Login untuk semua role (pembeli, staf, admin).

```http
POST /api/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "login_id": "johndoe",
  "password": "password123"
}
```

**Notes:**
- `login_id` bisa diisi dengan `username` ATAU `no_hp`
- User yang `is_active = false` tidak bisa login

**Response 200 OK:**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "no_hp": "081234567890",
      "role": "pembeli",
      "is_active": true
    },
    "token": "2|xyz789abc..."
  }
}
```

**Response 422 Validation Error (kredensial salah):**
```json
{
  "status": "error",
  "message": "Data yang dikirim tidak valid.",
  "errors": {
    "login_id": ["Kredensial yang diberikan tidak sesuai."]
  }
}
```

**Response 422 Validation Error (user non-aktif):**
```json
{
  "status": "error",
  "message": "Data yang dikirim tidak valid.",
  "errors": {
    "login_id": ["Akun Anda telah dinonaktifkan. Silakan hubungi staf atau admin."]
  }
}
```

**Rate Limit:** 5 request per menit per IP

---

## 🔒 Protected Endpoints (Perlu Bearer Token)

Untuk mengakses endpoint ini, sertakan token di header:

```http
Authorization: Bearer {your_token_here}
```

---

### Get Current User

Mendapatkan informasi user yang sedang login.

```http
GET /api/user
Authorization: Bearer {token}
```

**Response 200 OK:**
```json
{
  "id": 1,
  "username": "johndoe",
  "no_hp": "081234567890",
  "role": "pembeli",
  "jenis_kelamin": "L",
  "tanggal_lahir": "1995-05-15",
  "is_active": true,
  "created_at": "2026-11-03T10:00:00.000000Z",
  "updated_at": "2026-11-03T10:00:00.000000Z"
}
```

**Response 401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Tidak terautentikasi. Silakan login terlebih dahulu."
}
```

---

### Logout

Menghapus token saat ini (logout dari device ini saja).

```http
POST /api/logout
Authorization: Bearer {token}
```

**Response 200 OK:**
```json
{
  "status": "success",
  "message": "Logout berhasil",
  "data": null
}
```

**Response 401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Tidak terautentikasi. Silakan login terlebih dahulu."
}
```

---

### Get Obat Count (Admin Only)

Mendapatkan jumlah total obat. Hanya untuk testing middleware role.

```http
GET /api/obat/count
Authorization: Bearer {token}
```

**Response 200 OK (jika role = admin):**
```json
{
  "status": "success",
  "message": "Jumlah obat berhasil diambil.",
  "data": {
    "total": 0
  }
}
```

**Response 403 Forbidden (jika role bukan admin):**
```json
{
  "status": "error",
  "message": "Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini."
}
```

---

## 📊 Response Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource baru berhasil dibuat (register) |
| 401 | Unauthorized | Token tidak valid atau tidak ada |
| 403 | Forbidden | User tidak punya akses ke resource |
| 404 | Not Found | Endpoint atau resource tidak ditemukan |
| 422 | Validation Error | Data yang dikirim tidak valid |
| 429 | Too Many Requests | Rate limit terlampaui |
| 500 | Internal Server Error | Error di server |
| 503 | Service Unavailable | Service tidak tersedia (misal database down) |

---

## 🔐 Authentication Flow

### 1. Register/Login
```
POST /api/register atau /api/login
  ↓
Dapat response dengan token
  ↓
Simpan token di client (state/sessionStorage)
```

### 2. Akses Protected Endpoint
```
GET /api/user
Header: Authorization: Bearer {token}
  ↓
Dapat data user
```

### 3. Logout
```
POST /api/logout
Header: Authorization: Bearer {token}
  ↓
Token dihapus dari database
  ↓
Hapus token dari client
```

---

## 🧪 Testing dengan Postman

### Setup Environment

1. Buat environment baru "Mediva Local"
2. Tambahkan variable:
   - `base_url`: `http://localhost:8000/api`
   - `token`: (kosongkan dulu, akan diisi otomatis)

### Auto-set Token setelah Login

Di tab **Tests** request Login, tambahkan script:

```javascript
// Parse response
var jsonData = pm.response.json();

// Jika login berhasil, simpan token
if (jsonData.status === "success" && jsonData.data.token) {
    pm.environment.set("token", jsonData.data.token);
    console.log("Token saved:", jsonData.data.token);
}
```

### Setup Authorization

Untuk protected endpoints:
1. Tab **Authorization**
2. Type: **Bearer Token**
3. Token: `{{token}}`

---

## 📝 Notes

- Token expiration: **480 menit (8 jam)** untuk web staf/admin
- Token mobile bisa lebih lama (akan diatur di fase berikutnya)
- Semua endpoint mengembalikan JSON
- Error di production tidak menampilkan stack trace
- Database menggunakan PostgreSQL (Supabase)

---

## 🚀 Update History

| Date | Version | Changes |
|------|---------|---------|
| 2026-11-03 | 1.0.0 | Fase 1: Fondasi API - Health check, Auth basic, Role middleware |

---

## 📞 Support

Untuk pertanyaan teknis, hubungi backend developer team.
