# Mediva API — Comprehensive Test Report

## Executive Summary
- **Date/Time:** 2026-11-24 02:14:51
- **Total Endpoints Tested:** 53
- **Passed:** 16
- **Failed:** 19
- **Observed/Skipped:** 18
- **Coverage:** 30.2%

## Test Results by Phase

### FASE 1 — Auth & Health
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 1 | GET | /health | none | 200 | 200 | PASS | {"status":"success","message":"API berjalan normal.","data":{"app":"Mediva","env":"local","version":"1.0.0","server":"ok","database":"ok","db_error":null,"time":"2026-11-23T19:14:20+00:00","timezone":"UTC"}} |
| 2 | POST | /register | none | 200/201 | 429 | FAIL | {
    "message": "Too Many Attempts.",
    "exception": "Illuminate\\Http\\Exceptions\\ThrottleRequestsException",
    "file": "C:\\laragon\\www\\Mediva\\Backend\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\ThrottleRequests.php",
    "line": 254,
    "trace": [
        {
       |
| 3 | POST | /verify-otp-register | none | 400/422 | 422 | OBSERVED | {"status":"error","message":"Data yang dikirim tidak valid.","errors":{"no_hp":["Nomor HP tidak ditemukan"]}} |
| 4 | POST | /login | none | 200 | 200 | PASS | Admin login |
| 5 | POST | /login | none | 200 | 200 | PASS | Staff login |
| 6 | POST | /login | none | 200 | 200 | PASS | Buyer login |
| 7 | GET | /user | admin | 200 | 200 | PASS | {"id":29,"username":"admin","no_hp":"081234567890","role":"admin","jenis_kelamin":null,"tanggal_lahir":null,"otp_verified_at":"2026-11-22T12:06:51.000000Z","otp_expired_at":null,"is_active":true,"created_at":"2026-11-22T12:06:53.000000Z","updated_at":"2026-11-22T12:06:53.000000Z"} |
| 8 | POST | /change-password | admin | 200 | 422 | FAIL | {"status":"error","message":"Data yang dikirim tidak valid.","errors":{"password":["Password baru wajib diisi"]}} |
| 9 | POST | /forgot-password | none | 200/422 | 429 | OBSERVED | {
    "message": "Too Many Attempts.",
    "exception": "Illuminate\\Http\\Exceptions\\ThrottleRequestsException",
    "file": "C:\\laragon\\www\\Mediva\\Backend\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\ThrottleRequests.php",
    "line": 254,
    "trace": [
        {
       |
| 10 | POST | /verify-otp | none | 400/422 | 422 | OBSERVED | {"status":"error","message":"Data yang dikirim tidak valid.","errors":{"identifier":["Username atau nomor HP wajib diisi"]}} |
| 11 | POST | /reset-password | none | 400/422 | 429 | OBSERVED | {
    "message": "Too Many Attempts.",
    "exception": "Illuminate\\Http\\Exceptions\\ThrottleRequestsException",
    "file": "C:\\laragon\\www\\Mediva\\Backend\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\ThrottleRequests.php",
    "line": 254,
    "trace": [
        {
       |
| 12 | POST | /logout | admin | 200 | 200 | PASS | {"status":"success","message":"Logout berhasil"} |

### FASE 2 — User Management
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 13 | GET | /users | admin | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 14 | POST | /users | admin | 201 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 15 | GET | /users/29 | admin | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 16 | PUT | /users/{id} | admin | 200 | SKIP | SKIP | No test user |
| 17 | PATCH | /users/{id}/status | admin | 200 | SKIP | SKIP | No test user |
| 18 | DELETE | /users/{id} | admin | 200/204 | SKIP | SKIP | No test user |

### FASE 3 — Product Catalog
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 19 | GET | /katalog/kategoris | none | 200 | 200 | PASS | {"status":"success","message":"Daftar kategori berhasil diambil.","data":[]} |
| 20 | GET | /katalog/obats | none | 200 | 200 | PASS | {"status":"success","message":"Katalog obat berhasil diambil.","data":{"data":[],"pagination":{"current_page":1,"last_page":1,"per_page":15,"total":0}}} |
| 21 | GET | /katalog/obats/1 | none | 200 | 404 | FAIL | {"status":"error","message":"Obat tidak ditemukan."} |
| 22 | GET | /obat | staff | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 23 | GET | /obat/1 | staff | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 24 | POST | /obat | staff | 201 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 25 | PUT | /obat/{id} | staff | 200 | SKIP | SKIP | No test obat |
| 26 | DELETE | /obat/{id} | staff | 200/204 | SKIP | SKIP | No test obat |
| 27 | POST | /kategoris | staff | 201 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 28 | PUT | /kategoris/{id} | staff | 200 | SKIP | SKIP | No test kategori |

### FASE 4 — Stock & Batch Management
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 29 | GET | /batches | staff | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 30 | GET | /batches/1 | staff | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 31 | POST | /batches | staff | 201 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 32 | PUT | /batches/{id}/adjust | staff | 200 | SKIP | SKIP | No test batch |
| 33 | GET | /stock/movements | staff | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |

### FASE 5 — POS Kasir
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 34 | POST | /kasir/transaksi | staff | 201 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |

### FASE 6 — Orders & Payments
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 35 | POST | /orders | buyer | 201 | 422 | FAIL | {"status":"error","message":"Data yang dikirim tidak valid.","errors":{"metode_pembayaran":["The metode pembayaran field is required."],"items.0.obat_id":["Obat tidak ditemukan."],"items.0.qty":["The items.0.qty field is required."]}} |
| 36 | GET | /orders | buyer | 200 | 200 | PASS | {"status":"success","message":"Daftar order berhasil diambil.","data":[]} |
| 37 | GET | /orders/{id} | buyer | 200 | SKIP | SKIP | No test order |
| 38 | PATCH | /orders/{id}/status | staff | 200 | SKIP | SKIP | No test order |
| 39 | POST | /orders/{id}/confirm-payment | buyer | 200 | SKIP | SKIP | No test order |
| 40 | POST | /orders/{id}/pay | buyer | 200 | SKIP | SKIP | No test order |
| 41 | POST | /orders/{id}/cancel | buyer | 200 | SKIP | SKIP | No test order |

### FASE 7 — Resep / Prescriptions
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 42 | POST | /resep | buyer | 201 | 201 | PASS | {"data":{"id":1,"user":{"id":31,"nama":null,"email":null},"order":null,"foto_resep":"data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==","status":"menunggu_validasi","validator":null,"validated_at":null,"created_at":"2026-11-23 19: |
| 43 | GET | /resep | buyer | 200 | 200 | PASS | {"data":[{"id":1,"user":{"id":31,"nama":null,"email":null},"order":null,"foto_resep":"data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==","status":"menunggu_validasi","validator":null,"validated_at":null,"created_at":"2026-11-23 19 |
| 44 | GET | /resep/1 | buyer | 200 | 200 | PASS | {"data":{"id":1,"user":{"id":31,"nama":null,"email":null},"order":null,"foto_resep":"data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==","status":"menunggu_validasi","validator":null,"validated_at":null,"created_at":"2026-11-23 19: |
| 45 | POST | /resep/1/validate | staff | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |

### Miscellaneous / Admin
| # | Method | Endpoint | Auth | Expected | Actual | Result | Notes |
|---|--------|----------|------|----------|--------|--------|-------|
| 46 | GET | /obat/count | admin | 200 | 401 | FAIL | {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."} |
| 47 | POST | /payment/midtrans/callback | none | 200 | 403 | OBSERVED | {"status":"failed"} |

## Authorization Matrix Results
| Test | Actor | Endpoint | Expected | Actual Status | Result |
|------|-------|----------|----------|---------------|--------|
| AUTH-1 | admin | POST /obat | 403 | 401 | FAIL |
| AUTH-2 | buyer | GET /users | 403 | 403 | PASS |
| AUTH-3 | staff | POST /orders | varies | 401 | OBSERVED |
| AUTH-4 | none | GET /user | 401 | 401 | PASS |
| AUTH-5 | buyer | POST /batches | 403 | 403 | PASS |
| AUTH-6 | buyer | POST /kasir/transaksi | 403 | 403 | PASS |

## Bugs Found

### BUG-1: POST /register returned 429 — Severity: MEDIUM
- **Endpoint:** POST /register
- **Expected:** 200/201
- **Actual:** 429
- **Impact:** Endpoint not functioning as expected
- **Response:** {
    "message": "Too Many Attempts.",
    "exception": "Illuminate\\Http\\Exceptions\\ThrottleRequestsException",
    "file": "C:\\laragon\\www\\Mediva\\Backend\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Middleware\\ThrottleRequests.php",
    "line": 254,
    "trace": [
        {
      

### BUG-2: POST /change-password returned 422 — Severity: MEDIUM
- **Endpoint:** POST /change-password
- **Expected:** 200
- **Actual:** 422
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Data yang dikirim tidak valid.","errors":{"password":["Password baru wajib diisi"]}}

### BUG-3: GET /users returned 401 — Severity: MEDIUM
- **Endpoint:** GET /users
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-4: POST /users returned 401 — Severity: MEDIUM
- **Endpoint:** POST /users
- **Expected:** 201
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-5: GET /users/29 returned 401 — Severity: MEDIUM
- **Endpoint:** GET /users/29
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-6: GET /katalog/obats/1 returned 404 — Severity: LOW
- **Endpoint:** GET /katalog/obats/1
- **Expected:** 200
- **Actual:** 404
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Obat tidak ditemukan."}

### BUG-7: GET /obat returned 401 — Severity: LOW
- **Endpoint:** GET /obat
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-8: GET /obat/1 returned 401 — Severity: LOW
- **Endpoint:** GET /obat/1
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-9: POST /obat returned 401 — Severity: LOW
- **Endpoint:** POST /obat
- **Expected:** 201
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-10: POST /kategoris returned 401 — Severity: LOW
- **Endpoint:** POST /kategoris
- **Expected:** 201
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-11: GET /batches returned 401 — Severity: LOW
- **Endpoint:** GET /batches
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-12: GET /batches/1 returned 401 — Severity: LOW
- **Endpoint:** GET /batches/1
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-13: POST /batches returned 401 — Severity: LOW
- **Endpoint:** POST /batches
- **Expected:** 201
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-14: GET /stock/movements returned 401 — Severity: LOW
- **Endpoint:** GET /stock/movements
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-15: POST /kasir/transaksi returned 401 — Severity: LOW
- **Endpoint:** POST /kasir/transaksi
- **Expected:** 201
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-16: POST /orders returned 422 — Severity: LOW
- **Endpoint:** POST /orders
- **Expected:** 201
- **Actual:** 422
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Data yang dikirim tidak valid.","errors":{"metode_pembayaran":["The metode pembayaran field is required."],"items.0.obat_id":["Obat tidak ditemukan."],"items.0.qty":["The items.0.qty field is required."]}}

### BUG-17: POST /resep/1/validate returned 401 — Severity: LOW
- **Endpoint:** POST /resep/1/validate
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-18: GET /obat/count returned 401 — Severity: LOW
- **Endpoint:** GET /obat/count
- **Expected:** 200
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** {"status":"error","message":"Tidak terautentikasi. Silakan login terlebih dahulu."}

### BUG-19: POST /obat returned 401 — Severity: HIGH
- **Endpoint:** POST /obat
- **Expected:** 403
- **Actual:** 401
- **Impact:** Endpoint not functioning as expected
- **Response:** Admin should not be able to create obat

## Recommendations

1. **Authorization:** Review role-based access control for endpoints that returned unexpected 403/401 responses
2. **Error Handling:** Ensure all error responses follow consistent JSON structure
3. **Documentation:** Update API documentation with actual response formats observed in testing
4. **Validation:** Some endpoints may need stricter input validation (observed in 422 responses)
5. **Testing:** Implement automated integration tests to catch regressions

## Notes

- All tests were performed against: http://127.0.0.1:8000/api
- Test data created during this run was cleaned up where possible
- Some tests were skipped due to missing prerequisite data (e.g., no test order ID)
- OTP-related endpoints were tested with dummy values and responses were observed
- Payment callback endpoint was tested with dummy Midtrans payload

---
**Test completed at:** 2026-11-24 02:14:51
