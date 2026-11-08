# Testing Guide - Order Management & Resep

Panduan pengujian untuk Fase 3: Order Management dan Resep menggunakan Postman.

## Prerequisites

1. **Server Laravel berjalan**: `php artisan serve`
2. **Database sudah di-migrate**: `php artisan migrate`
3. **Postman sudah setup** dengan environment Mediva
4. **Token authentication** sudah tersedia (login sebagai admin dan pembeli)

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

**Ekspektasi Response (200):**
```json
{
    "success": true,
    "message": "Login berhasil",
    "data": {
        "user": {
            "id": 1,
            "username": "admin",
            "nama": "Administrator",
            "role": "admin"
        },
        "token": "1|xxxxxxxxxxxxx"
    }
}
```

**Action:** Simpan token ke environment variable `{{admin_token}}`

#### 2. Login sebagai Pembeli
**Endpoint:** `POST {{base_url}}/api/login`

**Body (JSON):**
```json
{
    "username": "pembeli1",
    "password": "password123"
}
```

**Ekspektasi Response (200):**
```json
{
    "success": true,
    "message": "Login berhasil",
    "data": {
        "user": {
            "id": 2,
            "username": "pembeli1",
            "nama": "Pembeli Test",
            "role": "pembeli"
        },
        "token": "2|xxxxxxxxxxxxx"
    }
}
```

**Action:** Simpan token ke environment variable `{{pembeli_token}}`

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
    "user_id": 2,
    "items": [
        {
            "obat_id": 1,
            "quantity": 2,
            "harga": 50000
        },
        {
            "obat_id": 2,
            "quantity": 1,
            "harga": 75000
        }
    ],
    "metode_pembayaran": "cash",
    "alamat_pengiriman": "Jl. Merdeka No. 123, Jakarta"
}
```

**Ekspektasi Response (201):**
```json
{
    "data": {
        "id": 1,
        "order_code": "ORD-20261109-001",
        "user": {
            "id": 2,
            "nama": "Pembeli Test"
        },
        "items": [
            {
                "obat": {
                    "id": 1,
                    "nama": "Paracetamol 500mg"
                },
                "quantity": 2,
                "harga": 50000,
                "subtotal": 100000
            }
        ],
        "total": 175000,
        "metode_pembayaran": "cash",
        "status": "pending",
        "created_at": "2026-11-09 10:30:00"
    }
}
```

**Validasi:**
- ✅ Order code format: `ORD-YYYYMMDD-XXX`
- ✅ Status awal: `pending`
- ✅ Total hitung benar: (2 × 50000) + (1 × 75000) = 175000
- ✅ Stok obat berkurang (cek via GET /obat/{id})
- ✅ Pergerakan stok tercatat dengan tipe `keluar`

**Catatan:** Pastikan obat_id yang digunakan ada di database dan memiliki stok mencukupi.

---

### A2. Melihat Daftar Order (Pembeli)

**Endpoint:** `GET {{base_url}}/api/orders`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Ekspektasi Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "order_code": "ORD-20261109-001",
            "total": 175000,
            "status": "pending",
            "created_at": "2026-11-09 10:30:00"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 15,
        "total": 1
    }
}
```

**Validasi:**
- ✅ Hanya menampilkan order milik pembeli yang login
- ✅ Data ter-pagination

---

### A3. Melihat Detail Order

**Endpoint:** `GET {{base_url}}/api/orders/1`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Ekspektasi Response (200):**
```json
{
    "data": {
        "id": 1,
        "order_code": "ORD-20261109-001",
        "user": {
            "id": 2,
            "nama": "Pembeli Test"
        },
        "items": [
            {
                "obat": {
                    "id": 1,
                    "nama": "Paracetamol 500mg"
                },
                "quantity": 2,
                "harga": 50000,
                "subtotal": 100000
            }
        ],
        "total": 175000,
        "metode_pembayaran": "cash",
        "alamat_pengiriman": "Jl. Merdeka No. 123, Jakarta",
        "status": "pending",
        "created_at": "2026-11-09 10:30:00"
    }
}
```

**Validasi:**
- ✅ Detail lengkap order ditampilkan
- ✅ Items dengan relasi obat ditampilkan

---

### A4. Update Status Order (Admin)

**Endpoint:** `PATCH {{base_url}}/api/orders/1/status`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "status": "diproses"
}
```

**Ekspektasi Response (200):**
```json
{
    "data": {
        "id": 1,
        "order_code": "ORD-20261109-001",
        "status": "diproses",
        "updated_at": "2026-11-09 11:00:00"
    }
}
```

**Test Case Status Progression:**
1. `pending` → `diproses` ✅
2. `diproses` → `siap_diambil` ✅
3. `siap_diambil` → `selesai` ✅
4. `selesai` → `diproses` ❌ (Validation Error)

**Validasi:**
- ✅ Admin bisa update status
- ✅ Pembeli tidak bisa update status (403 Forbidden)
- ✅ Status progression rules diterapkan

---

### A5. Cancel Order (Pembeli)

**Endpoint:** `POST {{base_url}}/api/orders/1/cancel`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "alasan": "Salah pesan obat"
}
```

**Ekspektasi Response (200):**
```json
{
    "data": {
        "id": 1,
        "order_code": "ORD-20261109-001",
        "status": "dibatalkan",
        "cancelled_at": "2026-11-09 11:15:00",
        "cancel_reason": "Salah pesan obat"
    }
}
```

**Test Cases:**
1. Cancel order dengan status `pending` ✅
2. Cancel order dengan status `diproses` ✅
3. Cancel order dengan status `selesai` ❌ (Validation Error)
4. Cancel order dengan status `dibatalkan` ❌ (Validation Error)

**Validasi:**
- ✅ Status berubah ke `dibatalkan`
- ✅ Stok obat dikembalikan (refund ke batch asli)
- ✅ Pergerakan stok tercatat dengan tipe `masuk` (refund)

---

## B. Testing Resep Management

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
    "user_id": 2,
    "order_id": 1,
    "foto_resep": "https://example.com/resep/12345.jpg"
}
```

**Ekspektasi Response (201):**
```json
{
    "data": {
        "id": 1,
        "user": {
            "id": 2,
            "nama": "Pembeli Test",
            "email": "pembeli@test.com"
        },
        "order": {
            "id": 1,
            "order_code": "ORD-20261109-001",
            "total": 175000
        },
        "foto_resep": "https://example.com/resep/12345.jpg",
        "status": "pending",
        "validator": null,
        "validated_at": null,
        "created_at": "2026-11-09 12:00:00"
    }
}
```

**Validasi:**
- ✅ Resep dibuat dengan status `pending`
- ✅ order_id nullable (bisa null jika belum ada order)
- ✅ validator dan validated_at masih null

---

### B2. Melihat Daftar Resep (Admin/Staf)

**Endpoint:** `GET {{base_url}}/api/resep`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Query Parameters (Optional):**
```
?status=pending
?user_id=2
```

**Ekspektasi Response (200):**
```json
{
    "data": [
        {
            "id": 1,
            "user": {
                "id": 2,
                "nama": "Pembeli Test"
            },
            "foto_resep": "https://example.com/resep/12345.jpg",
            "status": "pending",
            "created_at": "2026-11-09 12:00:00"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 15
    }
}
```

**Validasi:**
- ✅ Filter by status bekerja
- ✅ Filter by user_id bekerja
- ✅ Data ter-pagination

---

### B3. Melihat Detail Resep

**Endpoint:** `GET {{base_url}}/api/resep/1`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Ekspektasi Response (200):**
```json
{
    "data": {
        "id": 1,
        "user": {
            "id": 2,
            "nama": "Pembeli Test",
            "email": "pembeli@test.com"
        },
        "order": {
            "id": 1,
            "order_code": "ORD-20261109-001",
            "total": 175000
        },
        "foto_resep": "https://example.com/resep/12345.jpg",
        "status": "pending",
        "validator": null,
        "validated_at": null,
        "created_at": "2026-11-09 12:00:00"
    }
}
```

---

### B4. Validasi Resep - Approve (Admin)

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

**Ekspektasi Response (200):**
```json
{
    "data": {
        "id": 1,
        "status": "disetujui",
        "validator": {
            "id": 1,
            "nama": "Administrator"
        },
        "validated_at": "2026-11-09 13:00:00"
    }
}
```

**Validasi:**
- ✅ Status berubah ke `disetujui`
- ✅ validated_by terisi dengan ID admin yang login
- ✅ validated_at terisi dengan timestamp saat ini
- ✅ Resep yang sudah divalidasi tidak bisa diubah lagi

---

### B5. Validasi Resep - Reject (Admin)

**Endpoint:** `POST {{base_url}}/api/resep/2/validate`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "status": "ditolak"
}
```

**Ekspektasi Response (200):**
```json
{
    "data": {
        "id": 2,
        "status": "ditolak",
        "validator": {
            "id": 1,
            "nama": "Administrator"
        },
        "validated_at": "2026-11-09 13:05:00"
    }
}
```

**Validasi:**
- ✅ Status berubah ke `ditolak`
- ✅ Resep yang sudah ditolak tidak bisa divalidasi lagi

---

## C. Test Cases Error Handling

### C1. Order - Stok Tidak Cukup

**Endpoint:** `POST {{base_url}}/api/orders`

**Body (quantity lebih besar dari stok):**
```json
{
    "user_id": 2,
    "items": [
        {
            "obat_id": 1,
            "quantity": 999999,
            "harga": 50000
        }
    ],
    "metode_pembayaran": "cash"
}
```

**Ekspektasi Response (400):**
```json
{
    "success": false,
    "message": "Stok tidak mencukupi untuk obat: Paracetamol 500mg"
}
```

---

### C2. Order - Obat Tidak Ditemukan

**Endpoint:** `POST {{base_url}}/api/orders`

**Body (obat_id tidak ada):**
```json
{
    "user_id": 2,
    "items": [
        {
            "obat_id": 99999,
            "quantity": 1,
            "harga": 50000
        }
    ],
    "metode_pembayaran": "cash"
}
```

**Ekspektasi Response (404):**
```json
{
    "success": false,
    "message": "Obat dengan ID 99999 tidak ditemukan"
}
```

---

### C3. Resep - Validasi Double

**Endpoint:** `POST {{base_url}}/api/resep/1/validate`

**Body (resep sudah divalidasi):**
```json
{
    "status": "disetujui"
}
```

**Ekspektasi Response (400):**
```json
{
    "success": false,
    "message": "Resep sudah divalidasi, tidak bisa diubah"
}
```

---

### C4. Authorization - Pembeli Akses Admin Endpoint

**Endpoint:** `PATCH {{base_url}}/api/orders/1/status`

**Headers:**
```
Authorization: Bearer {{pembeli_token}}
```

**Ekspektasi Response (403):**
```json
{
    "success": false,
    "message": "Anda tidak memiliki akses"
}
```

---

## D. Checklist Testing Completion

### Order Management
- [ ] Create order (pembeli) - Success
- [ ] Create order - Stok tidak cukup (error)
- [ ] Create order - Obat tidak ada (error)
- [ ] Get all orders (filtered by user)
- [ ] Get order detail
- [ ] Update order status (admin only)
- [ ] Update order status progression rules
- [ ] Cancel order (pembeli) - Status pending/diproses
- [ ] Cancel order - Status selesai (error)
- [ ] Verify stok deduction (FEFO)
- [ ] Verify stok refund on cancel

### Resep Management
- [ ] Create resep (pembeli)
- [ ] Get all resep (admin filter by status)
- [ ] Get resep detail
- [ ] Validate resep - Approve (admin)
- [ ] Validate resep - Reject (admin)
- [ ] Validate resep - Already validated (error)
- [ ] Verify validator info recorded

### Authorization
- [ ] Pembeli tidak bisa update order status
- [ ] Pembeli tidak bisa validate resep
- [ ] Admin bisa update order status
- [ ] Admin bisa validate resep

---

## E. Tips Debugging

1. **Cek Logs:** `tail -f storage/logs/laravel.log`
2. **Cek Database:** Query langsung ke PostgreSQL untuk verify data
3. **Cek Stok:** `GET /api/obat/{id}` sebelum dan sesudah order
4. **Cek Pergerakan Stok:** Query `pergerakan_stok` table untuk trace FEFO

**Query Debug Stok:**
```sql
SELECT * FROM pergerakan_stok WHERE obat_id = 1 ORDER BY created_at DESC LIMIT 10;
SELECT * FROM batch WHERE obat_id = 1 ORDER BY expired_date ASC;
```

---

## F. Next Steps

Setelah testing selesai:
1. Fix bug yang ditemukan
2. Update dokumentasi ENDPOINTS.md
3. Commit: `[TEST] Fase 3 - Order & Resep tested and verified`
4. Lanjut ke Fase 3 berikutnya (Notifikasi, Payment, dll)
