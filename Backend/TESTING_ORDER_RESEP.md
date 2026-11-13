# Testing Guide - Order Management & Resep (UPDATED)

**SECURITY UPDATE:** Authorization telah diperbaiki. Pembeli hanya bisa akses data miliknya.

## Prerequisites

1. **Server Laravel berjalan**: `php artisan serve`
2. **Database sudah di-migrate**: `php artisan migrate`
3. **Postman sudah setup** dengan environment Mediva
4. **Token authentication** sudah tersedia (login sebagai admin dan pembeli)

---

## PENTING: Perubahan Authorization

### Yang Berubah:
1. **POST /api/resep**: `user_id` sekarang otomatis diambil dari user yang login (tidak bisa atas nama orang lain)
2. **GET /api/resep**: Pembeli hanya melihat resep miliknya, Admin/Staf bisa filter atau lihat semua
3. **GET /api/resep/{id}**: Pembeli tidak bisa akses resep user lain (403 Forbidden)

### Request Body Update:

**OLD (DEPRECATED):**
```json
{
    "user_id": 2,
    "foto_resep": "https://example.com/resep.jpg"
}
```

**NEW (CORRECT):**
```json
{
    "foto_resep": "https://example.com/resep.jpg",
    "order_id": 1
}
```

`user_id` diambil otomatis dari `Authorization: Bearer {{token}}`

---

## Alur Pengujian Lengkap

### Setup: Login dan Dapatkan Token

#### 1. Login sebagai Admin
**Endpoint:** `POST {{base_url}}/api/login`

**Body (JSON):**
```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Action:** Simpan token ke `{{admin_token}}`

#### 2. Login sebagai Pembeli
**Endpoint:** `POST {{base_url}}/api/login`

**Body (JSON):**
```json
{
    "username": "pembeli1",
    "password": "password123"
}
```

**Action:** Simpan token ke `{{pembeli_token}}`

---

## A. Testing Order Management

### A1. Membuat Order Baru (Pembeli)

**Endpoint:** `POST {{base_url}}/api/orders`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "items": [
        {
            "obat_id": 1,
            "quantity": 2,
            "harga": 50000
        }
    ],
    "metode_pembayaran": "cash",
    "alamat_pengiriman": "Jl. Merdeka No. 123, Jakarta"
}
```

**Validasi:**
- ✅ Order code format: `ORD-YYYYMMDD-XXX`
- ✅ Status awal: `pending`
- ✅ Stok obat berkurang (FEFO)

---

## B. Testing Resep Management (UPDATED)

### B1. Upload Resep Baru (Pembeli)

**Endpoint:** `POST {{base_url}}/api/resep`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "order_id": 1,
    "foto_resep": "https://example.com/resep/12345.jpg"
}
```

**Validasi:**
- ✅ `user_id` otomatis dari token
- ✅ Status awal: `pending`

---

### B2. Melihat Daftar Resep

#### Sebagai Pembeli:
**Endpoint:** `GET {{base_url}}/api/resep`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Validasi:**
- ✅ Hanya menampilkan resep milik pembeli yang login
- ❌ Tidak bisa filter `user_id` lain (otomatis filtered)

#### Sebagai Admin/Staf:
**Endpoint:** `GET {{base_url}}/api/resep?user_id=2&status=pending`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Validasi:**
- ✅ Bisa filter by `user_id`
- ✅ Bisa filter by `status`
- ✅ Bisa lihat semua resep

---

### B3. Melihat Detail Resep (Authorization Test)

#### Test Case 1: Pembeli Akses Resep Sendiri
**Endpoint:** `GET {{base_url}}/api/resep/1`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Ekspektasi:** ✅ 200 OK (jika resep milik pembeli)

---

#### Test Case 2: Pembeli Akses Resep Orang Lain
**Endpoint:** `GET {{base_url}}/api/resep/99`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Ekspektasi:** ❌ 403 Forbidden
```json
{
    "success": false,
    "message": "Anda tidak memiliki akses ke resep ini"
}
```

---

#### Test Case 3: Admin Akses Resep Siapa Saja
**Endpoint:** `GET {{base_url}}/api/resep/1`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Ekspektasi:** ✅ 200 OK (admin bisa akses semua)

---

### B4. Validasi Resep (Admin Only)

**Endpoint:** `POST {{base_url}}/api/resep/1/validate`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "status": "disetujui"
}
```

**Validasi:**
- ✅ Admin bisa validate
- ❌ Pembeli tidak bisa validate (403)
- ✅ validated_by dan validated_at terisi otomatis

---

## C. Test Cases Error Handling (NEW)

### C1. Resep - Unauthorized Access

**Endpoint:** `GET {{base_url}}/api/resep/999`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Scenario:** Resep ID 999 milik user lain

**Ekspektasi Response (403):**
```json
{
    "success": false,
    "message": "Anda tidak memiliki akses ke resep ini"
}
```

---

### C2. Resep - Create Impersonation Attempt (BLOCKED)

**Endpoint:** `POST {{base_url}}/api/resep`

**Body (user_id akan diabaikan):**
```json
{
    "user_id": 999,
    "foto_resep": "https://example.com/fake.jpg"
}
```

**Validasi:**
- ✅ `user_id` dari body diabaikan
- ✅ `user_id` diambil dari `$request->user()->id`
- ✅ Tidak bisa create resep atas nama orang lain

---

## D. Checklist Testing Completion (UPDATED)

### Resep Authorization (NEW)
- [ ] Pembeli hanya bisa GET own resep
- [ ] Pembeli tidak bisa GET resep orang lain (403)
- [ ] Admin bisa GET all resep
- [ ] POST resep force user_id dari auth
- [ ] POST resep ignore user_id dari body
- [ ] Pembeli tidak bisa validate resep (403)
- [ ] Admin bisa validate resep

### Order Management
- [ ] Create order dengan auth
- [ ] List orders (filtered by role)
- [ ] Cancel order dengan authorization check

---

## E. Security Checklist

### ✅ Fixed:
- ✅ Database password tidak lagi di phpunit.xml
- ✅ Resep authorization: pembeli hanya akses miliknya
- ✅ Resep store: tidak bisa impersonation
- ✅ Testing menggunakan SQLite in-memory (aman)

### ⚠️ Still Need Attention:
- [ ] Rotate default user passwords di UserSeeder (jika deploy production)
- [ ] Add rate limiting untuk sensitive endpoints
- [ ] Add audit log untuk validation actions

---

## F. Tips Debugging

1. **Cek Auth User:** `$request->user()` di controller
2. **Cek Logs:** `tail -f storage/logs/laravel.log`
3. **Test dengan 2 user berbeda:** Pastikan isolation bekerja

**Query Debug Authorization:**
```sql
SELECT id, user_id, status FROM resep WHERE user_id = 2;
SELECT id, username, role FROM users;
```

---

## Next Steps

Setelah testing selesai:
1. Verify all authorization rules
2. Test dengan multiple users
3. Commit: `[TEST] Security & Authorization verified`
