# 🧪 FASE 2.3 - USER MANAGEMENT: Manual Testing dengan Postman

**Target:** Testing complete CRUD User Management + Authorization  
**Prerequisites:** Backend server running (`php artisan serve`)  
**Base URL:** `http://localhost:8000/api`

---

## 📋 **PREPARATION: Login sebagai Admin**

Sebelum testing User Management, Anda perlu mendapatkan token admin.

### **Step 0: Login Admin**

```http
POST http://localhost:8000/api/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "login_id": "admin",
  "password": "admin123"
}
```

**Expected Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "no_hp": "081234567890",
      "role": "admin",
      "is_active": true
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz..."
  }
}
```

**⚠️ PENTING:** Copy token dari response dan gunakan untuk semua request berikutnya!

**Setup di Postman:**
1. Buat Environment baru: `Mediva-Local`
2. Tambahkan variable:
   - `base_url`: `http://localhost:8000/api`
   - `admin_token`: `<paste token di sini>`

---

## 🧪 **SCENARIO 1: Admin List Users**

**Tujuan:** Verify admin dapat melihat daftar semua user (admin + staf) dengan pagination

### Request

```http
GET {{base_url}}/users
Authorization: Bearer {{admin_token}}
```

### Expected Response (200 OK)

```json
{
  "status": "success",
  "message": "Daftar pengguna berhasil diambil.",
  "data": {
    "data": [
      {
        "id": 1,
        "username": "admin",
        "no_hp": "081234567890",
        "role": "Admin",
        "jenis_kelamin": "L",
        "tanggal_lahir": "1990-01-01",
        "is_active": true,
        "created_at": "2026-11-03T10:00:00.000000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 10,
      "total": 1
    }
  }
}
```

### ✅ Verification Checklist

- [ ] Status code: 200
- [ ] Response memiliki field `data.data` (array user)
- [ ] Response memiliki field `pagination` dengan `current_page`, `last_page`, `per_page`, `total`
- [ ] Setiap user memiliki field: `id`, `username`, `no_hp`, `role`, `jenis_kelamin`, `tanggal_lahir`, `is_active`, `created_at`
- [ ] Role ditampilkan dalam format label (e.g., "Admin", "Staf", bukan "admin", "staf")
- [ ] Hanya user dengan role `admin` dan `staf` yang ditampilkan (tidak ada `pembeli`)

### 🔍 Test Variations

**1. Test Search:**
```http
GET {{base_url}}/users?search=admin
Authorization: Bearer {{admin_token}}
```

Expected: Hanya user dengan username mengandung "admin" yang muncul

**2. Test Pagination:**
```http
GET {{base_url}}/users?page=2
Authorization: Bearer {{admin_token}}
```

Expected: Menampilkan page 2 (jika ada cukup data)

---

## 🧪 **SCENARIO 2: Admin Create Staf User**

**Tujuan:** Verify admin dapat membuat user baru dengan role staf

### Request

```http
POST {{base_url}}/users
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Request Body:**
```json
{
  "username": "staf_testing",
  "no_hp": "081298765432",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "staf",
  "jenis_kelamin": "P",
  "tanggal_lahir": "1995-06-15"
}
```

### Expected Response (201 Created)

```json
{
  "status": "success",
  "message": "Pengguna berhasil dibuat.",
  "data": {
    "id": 2,
    "username": "staf_testing",
    "no_hp": "081298765432",
    "role": "Staf",
    "jenis_kelamin": "P",
    "tanggal_lahir": "1995-06-15",
    "is_active": true,
    "created_at": "2026-11-08T12:00:00.000000Z"
  }
}
```

### ✅ Verification Checklist

- [ ] Status code: 201
- [ ] User berhasil dibuat dengan data yang benar
- [ ] Password di-hash (tidak terlihat di response)
- [ ] Role: `staf` (di database) atau `Staf` (di response)
- [ ] `is_active`: `true` by default

### 🔍 Test Variations

**1. Validation Error - Username already exists:**
```json
{
  "username": "admin",
  "no_hp": "081298765433",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "staf"
}
```

Expected Response (422):
```json
{
  "message": "The username has already been taken."
}
```

**2. Validation Error - No HP already exists:**
```json
{
  "username": "staf_baru",
  "no_hp": "081234567890",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "staf"
}
```

Expected Response (422):
```json
{
  "message": "The no hp has already been taken."
}
```

**3. Validation Error - Password confirmation mismatch:**
```json
{
  "username": "staf_testing2",
  "no_hp": "081298765434",
  "password": "password123",
  "password_confirmation": "password456",
  "role": "staf"
}
```

Expected Response (422):
```json
{
  "message": "The password field confirmation does not match."
}
```

**4. Validation Error - Invalid role:**
```json
{
  "username": "staf_testing3",
  "no_hp": "081298765435",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "pembeli"
}
```

Expected Response (422):
```json
{
  "message": "The selected role is invalid."
}
```

---

## 🧪 **SCENARIO 3: Admin Show User Detail**

**Tujuan:** Verify admin dapat melihat detail satu user

### Request

```http
GET {{base_url}}/users/2
Authorization: Bearer {{admin_token}}
```

### Expected Response (200 OK)

```json
{
  "status": "success",
  "message": "Detail pengguna berhasil diambil.",
  "data": {
    "id": 2,
    "username": "staf_testing",
    "no_hp": "081298765432",
    "role": "Staf",
    "jenis_kelamin": "P",
    "tanggal_lahir": "1995-06-15",
    "is_active": true,
    "created_at": "2026-11-08T12:00:00.000000Z"
  }
}
```

### ✅ Verification Checklist

- [ ] Status code: 200
- [ ] Data user sesuai dengan yang dibuat sebelumnya
- [ ] Semua field lengkap

### 🔍 Test Variations

**1. User not found:**
```http
GET {{base_url}}/users/999
Authorization: Bearer {{admin_token}}
```

Expected Response (404):
```json
{
  "status": "error",
  "message": "Pengguna tidak ditemukan."
}
```

---

## 🧪 **SCENARIO 4: Admin Update User**

**Tujuan:** Verify admin dapat mengupdate data user

### Request

```http
PUT {{base_url}}/users/2
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Request Body:**
```json
{
  "username": "staf_updated",
  "no_hp": "081298765432",
  "role": "staf",
  "jenis_kelamin": "P",
  "tanggal_lahir": "1995-06-15"
}
```

### Expected Response (200 OK)

```json
{
  "status": "success",
  "message": "Data pengguna berhasil diperbarui.",
  "data": {
    "id": 2,
    "username": "staf_updated",
    "no_hp": "081298765432",
    "role": "Staf",
    "jenis_kelamin": "P",
    "tanggal_lahir": "1995-06-15",
    "is_active": true,
    "created_at": "2026-11-08T12:00:00.000000Z"
  }
}
```

### ✅ Verification Checklist

- [ ] Status code: 200
- [ ] Username berubah dari `staf_testing` menjadi `staf_updated`
- [ ] Field lain tetap sama

### 🔍 Test Variations

**1. Update with password (optional):**
```json
{
  "username": "staf_updated",
  "no_hp": "081298765432",
  "password": "newpassword123",
  "password_confirmation": "newpassword123",
  "role": "staf"
}
```

Expected: Password berhasil diupdate (test dengan login menggunakan password baru)

**2. Validation - username already taken (by other user):**
```json
{
  "username": "admin",
  "no_hp": "081298765432",
  "role": "staf"
}
```

Expected Response (422): Username already taken error

---

## 🧪 **SCENARIO 5: Admin Toggle User Status (Deactivate/Activate)**

**Tujuan:** Verify admin dapat nonaktifkan/aktifkan user

### Request - Deactivate User

```http
PATCH {{base_url}}/users/2/status
Authorization: Bearer {{admin_token}}
```

### Expected Response (200 OK)

```json
{
  "status": "success",
  "message": "Pengguna berhasil dinonaktifkan.",
  "data": {
    "id": 2,
    "username": "staf_updated",
    "no_hp": "081298765432",
    "role": "Staf",
    "jenis_kelamin": "P",
    "tanggal_lahir": "1995-06-15",
    "is_active": false,
    "created_at": "2026-11-08T12:00:00.000000Z"
  }
}
```

### ✅ Verification Checklist

- [ ] Status code: 200
- [ ] `is_active` berubah menjadi `false`
- [ ] Message: "Pengguna berhasil dinonaktifkan."

### Request - Activate User (Toggle Again)

```http
PATCH {{base_url}}/users/2/status
Authorization: Bearer {{admin_token}}
```

### Expected Response (200 OK)

```json
{
  "status": "success",
  "message": "Pengguna berhasil diaktifkan.",
  "data": {
    "id": 2,
    "username": "staf_updated",
    "no_hp": "081298765432",
    "role": "Staf",
    "is_active": true,
    "created_at": "2026-11-08T12:00:00.000000Z"
  }
}
```

### ✅ Verification Checklist

- [ ] Status code: 200
- [ ] `is_active` berubah kembali menjadi `true`
- [ ] Message: "Pengguna berhasil diaktifkan."

### 🔍 Test Variations

**1. Cannot deactivate self:**

Login sebagai user dengan ID 2, lalu:
```http
PATCH {{base_url}}/users/2/status
Authorization: Bearer {{user_2_token}}
```

Expected Response (403):
```json
{
  "status": "error",
  "message": "Anda tidak dapat mengubah status akun Anda sendiri."
}
```

---

## 🧪 **SCENARIO 6: Admin Delete User**

**Tujuan:** Verify admin dapat menghapus user

### Request

```http
DELETE {{base_url}}/users/2
Authorization: Bearer {{admin_token}}
```

### Expected Response (200 OK)

```json
{
  "status": "success",
  "message": "Pengguna berhasil dihapus."
}
```

### ✅ Verification Checklist

- [ ] Status code: 200
- [ ] User dengan ID 2 tidak lagi muncul di list users
- [ ] Attempt to GET `/users/2` returns 404

### 🔍 Test Variations

**1. Cannot delete self:**

Login sebagai admin dengan ID 1, lalu:
```http
DELETE {{base_url}}/users/1
Authorization: Bearer {{admin_token}}
```

Expected Response (403):
```json
{
  "status": "error",
  "message": "Anda tidak dapat menghapus akun Anda sendiri."
}
```

**2. Delete non-existent user:**
```http
DELETE {{base_url}}/users/999
Authorization: Bearer {{admin_token}}
```

Expected Response (404):
```json
{
  "status": "error",
  "message": "Pengguna tidak ditemukan."
}
```

---

## 🧪 **SCENARIO 7: Authorization - Staf Cannot Access User Management**

**Tujuan:** Verify staf tidak bisa mengakses endpoint User Management

### Preparation: Create Staf User and Login

**1. Create staf user (using admin token):**
```http
POST {{base_url}}/users
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

Body:
```json
{
  "username": "staf_test_auth",
  "no_hp": "081212341234",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "staf"
}
```

**2. Login sebagai staf:**
```http
POST {{base_url}}/login
Content-Type: application/json
```

Body:
```json
{
  "login_id": "staf_test_auth",
  "password": "password123"
}
```

Copy `token` dari response.

### Request - Try to List Users as Staf

```http
GET {{base_url}}/users
Authorization: Bearer {{staf_token}}
```

### Expected Response (403 Forbidden)

```json
{
  "status": "error",
  "message": "Akses ditolak. Anda tidak memiliki izin untuk aksi ini."
}
```

### ✅ Verification Checklist

- [ ] Status code: 403
- [ ] Message: access denied

### 🔍 Test All Endpoints as Staf

Semua endpoint berikut harus return 403:

```
GET    /users           -> 403
POST   /users           -> 403
GET    /users/{id}      -> 403
PUT    /users/{id}      -> 403
DELETE /users/{id}      -> 403
PATCH  /users/{id}/status -> 403
```

---

## 🧪 **SCENARIO 8: Unauthenticated User Cannot Access**

**Tujuan:** Verify user tanpa token tidak bisa akses User Management

### Request - No Token

```http
GET {{base_url}}/users
```

### Expected Response (401 Unauthorized)

```json
{
  "message": "Unauthenticated."
}
```

### ✅ Verification Checklist

- [ ] Status code: 401
- [ ] Message: Unauthenticated

---

## 📊 **POSTMAN COLLECTION EXPORT**

Untuk memudahkan testing, Anda bisa export Postman Collection dengan struktur berikut:

```
📁 Mediva API
├── 📁 Auth
│   ├── Login Admin
│   ├── Login Staf
│   └── Logout
├── 📁 User Management (Admin Only)
│   ├── List Users
│   ├── Create User
│   ├── Show User
│   ├── Update User
│   ├── Toggle User Status
│   └── Delete User
└── 📁 Authorization Tests
    ├── Staf Try List Users (403)
    └── Unauthenticated Try List Users (401)
```

---

## ✅ **TESTING CHECKLIST SUMMARY**

### Basic CRUD (Admin)
- [ ] ✅ List users with pagination
- [ ] ✅ Search users by username
- [ ] ✅ Create staf user
- [ ] ✅ Show user detail
- [ ] ✅ Update user data
- [ ] ✅ Toggle user status (deactivate/activate)
- [ ] ✅ Delete user

### Validation
- [ ] ✅ Duplicate username rejected
- [ ] ✅ Duplicate no_hp rejected
- [ ] ✅ Password confirmation mismatch rejected
- [ ] ✅ Invalid role rejected
- [ ] ✅ Invalid no_hp format rejected

### Authorization
- [ ] ✅ Admin can access all endpoints
- [ ] ✅ Staf cannot access user management (403)
- [ ] ✅ Unauthenticated user cannot access (401)
- [ ] ✅ User cannot delete self
- [ ] ✅ User cannot deactivate self

### Edge Cases
- [ ] ✅ Show non-existent user (404)
- [ ] ✅ Update non-existent user (404)
- [ ] ✅ Delete non-existent user (404)
- [ ] ✅ Toggle status non-existent user (404)

---

## 🎯 **TIPS TESTING**

1. **Setup Environment Variables di Postman** untuk `base_url` dan `admin_token` agar lebih mudah
2. **Test secara berurutan** dari Scenario 1 sampai 8
3. **Gunakan Tests Script** di Postman untuk auto-verify response:

```javascript
// Example Postman Test Script
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('status');
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData).to.have.property('data');
});

pm.test("Status is success", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql('success');
});
```

4. **Screenshot hasil testing** untuk dokumentasi
5. **Test di berbagai kondisi** (happy path dan error cases)

---

## 🚨 **TROUBLESHOOTING**

### Error: Unauthenticated
- **Cause:** Token tidak ada atau expired
- **Solution:** Login ulang dan copy token baru

### Error: 403 Forbidden
- **Cause:** User tidak punya permission (bukan admin)
- **Solution:** Login sebagai admin

### Error: 404 Not Found
- **Cause:** User ID tidak ada di database
- **Solution:** Cek ID user yang valid dengan list users terlebih dahulu

### Error: 422 Validation Failed
- **Cause:** Data request tidak sesuai validation rules
- **Solution:** Cek field yang error di response dan perbaiki request body

### Error: 500 Internal Server Error
- **Cause:** Server error / database connection issue
- **Solution:** Cek log Laravel (`storage/logs/laravel.log`) untuk detail error

---

**🎉 Happy Testing!**

Jika ada pertanyaan atau issue, hubungi: [Project Leader]
