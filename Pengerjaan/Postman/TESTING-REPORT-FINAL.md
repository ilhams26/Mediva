# POSTMAN API TESTING REPORT — Mediva Smart Medicine Platform
## Agent 2: API Tester & QA Engineer

**Project:** Mediva Smart Medicine Platform  
**Branch Tested:** `ilham`  
**Date:** 23 November 2026  
**Tested By:** Kiro AI Agent (API Testing Specialist)  
**Status:** ⚠️ BLOCKED — Cannot execute tests due to technical constraints

---

## EXECUTIVE SUMMARY

### 🚫 CRITICAL BLOCKERS

1. **Postman MCP Connection Failed**
   - Error: `Session not found` when accessing Postman API via MCP
   - **Impact:** Cannot execute tests programmatically
   - **Impact:** Cannot update collection directly via API
   - **Impact:** Cannot retrieve real-time test results

2. **Laravel Server Not Running**
   - Server check: `127.0.0.1:8000` → **Connection Failed**
   - **Impact:** Cannot execute ANY request testing
   - **Impact:** Cannot verify endpoints are working
   - **Impact:** Cannot test authorization logic

3. **Database Safety Concerns**
   - Database target tidak dapat diverifikasi (server down)
   - **Cannot proceed with mutation testing** until database confirmed as isolated test environment

### ✅ DELIVERABLES COMPLETED

Despite technical blockers, this report provides:
- ✅ Complete endpoint audit (46 endpoints documented)
- ✅ Gap analysis between old collection (26) and actual source code (46)
- ✅ Comprehensive test specifications for all endpoints
- ✅ Authorization matrix based on PRD requirements
- ✅ Test assertions and validation rules
- ✅ Bug findings from source code review
- ✅ Security analysis
- ✅ Recommendations for implementation team

---

## PART A: POSTMAN WORKSPACE STATUS

### Collection Information

| Property | Value |
|----------|-------|
| **Workspace** | Ilham Ghazali's Workspace |
| **Collection Name** | Mediva API |
| **Old Collection** | 26 endpoints (Fase 1-2 only) |
| **Actual Endpoints (Source Code)** | **46 endpoints** (Fase 1-6) |
| **Missing from Collection** | **20 endpoints** |
| **MCP Connection** | ❌ FAILED (Session not found) |

### Environment Variables Required

| Variable | Purpose | Sensitive | Example Value |
|----------|---------|-----------|---------------|
| `base_url` | Laravel API base URL | No | `http://127.0.0.1:8000` |
| `admin_login_id` | Admin test account login ID | No | (setup required) |
| `staff_login_id` | Staff test account login ID | No | (setup required) |
| `buyer_login_id` | Buyer test account login ID | No | (setup required) |
| `test_password` | Test accounts password | **Yes** | (setup required) |
| `admin_token` | Bearer token for admin | **Yes** | (auto-set after login) |
| `staff_token` | Bearer token for staff | **Yes** | (auto-set after login) |
| `buyer_token` | Bearer token for buyer | **Yes** | (auto-set after login) |
| `test_otp` | OTP from registration | **Yes** | (auto-set after register) |
| `kategori_id` | Category ID from tests | No | (auto-set after create) |
| `obat_id` | Medicine ID from tests | No | (auto-set after create) |
| `batch_id` | Batch ID from tests | No | (auto-set after create) |
| `order_id` | Order ID from tests | No | (auto-set after create) |
| `resep_id` | Prescription ID from tests | No | (auto-set after create) |

---

## PART B: ENDPOINT COVERAGE

### Summary by Module

| Module | Total Endpoints | In Old Collection | New/Missing | Status |
|--------|----------------|-------------------|-------------|--------|
| **Health Check** | 1 | 1 | 0 | ✅ Covered |
| **Authentication** | 7 | 7 | 0 | ✅ Covered |
| **Protected Basic** | 3 | 3 | 0 | ✅ Covered |
| **User Management** | 7 | 7 | 0 | ✅ Covered |
| **Orders** | 6 | 5 | 1 | ⚠️ Partial |
| **Prescription** | 4 | 4 | 0 | ✅ Covered |
| **Product Catalog (Public)** | 3 | 0 | 3 | ❌ Missing |
| **Product Management** | 5 | 0 | 5 | ❌ Missing |
| **Category Management** | 3 | 0 | 3 | ❌ Missing |
| **Stock & Batch** | 4 | 0 | 4 | ❌ Missing |
| **Stock Movement** | 1 | 0 | 1 | ❌ Missing |
| **POS Kasir** | 1 | 0 | 1 | ❌ Missing |
| **Payment** | 2 | 0 | 2 | ❌ Missing |
| **TOTAL** | **46** | **26** | **20** | **56.5% Coverage** |

---

## PART C: DETAILED ENDPOINT SPECIFICATIONS

### ✅ FASE 1: AUTHENTICATION & USER MANAGEMENT (Complete in Collection)

#### 1.1 Health Check
| Method | Endpoint | Auth | Expected | Test Assertions |
|--------|----------|------|----------|-----------------|
| GET | `/api/health` | None | 200 OK | - Status code 200<br>- JSON response<br>- Has 'status' field |

#### 1.2 Authentication Endpoints

**A. Register**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/register` | None | - | 201 Created |

**Request Body:**
```json
{
  \"username\": \"string (required, max:255, unique)\",
  \"login_id\": \"string (required, unique, phone format)\",
  \"password\": \"string (required, min:8, confirmed)\",
  \"password_confirmation\": \"string (required)\",
  \"jenis_kelamin\": \"enum (L/P, nullable)\",
  \"tanggal_lahir\": \"date (nullable, before:today)\",
  \"role\": \"enum (pembeli/staf/admin, default: pembeli)\"
}
```

**Test Cases:**
- ✅ Valid registration returns OTP
- ❌ Duplicate login_id returns 422
- ❌ Invalid phone format returns 422
- ❌ Password too short returns 422
- ❌ Password mismatch returns 422

**B. Verify OTP Register**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/verify-otp-register` | None | 200 OK |

**Request Body:**
```json
{
  \"login_id\": \"string (required)\",
  \"otp\": \"string (required, 6 digits)\"
}
```

**Test Cases:**
- ✅ Valid OTP activates account
- ❌ Invalid OTP returns 400
- ❌ Expired OTP returns 400

**C. Login**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/login` | None | 200 OK |

**Request Body:**
```json
{
  \"login_id\": \"string (required)\",
  \"password\": \"string (required)\"
}
```

**Response:**
```json
{
  \"data\": {
    \"token\": \"string (Bearer token)\",
    \"role\": \"string (pembeli/staf/admin)\",
    \"user\": {...}
  }
}
```

**Test Cases:**
- ✅ Valid credentials return token + role
- ✅ Admin login sets admin_token env variable
- ✅ Staff login sets staff_token env variable
- ✅ Buyer login sets buyer_token env variable
- ❌ Invalid credentials return 401
- ❌ Empty login_id returns 422
- ❌ Empty password returns 422

**D. Logout**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/logout` | Bearer | 200 OK |

**Test Cases:**
- ✅ Valid token logout success
- ✅ Token becomes invalid after logout
- ❌ No token returns 401

**E. Get Current User**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| GET | `/api/user` | Bearer | 200 OK |

**Test Cases:**
- ✅ Returns authenticated user data
- ❌ No token returns 401
- ❌ Invalid token returns 401

**F. Forgot Password**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/forgot-password` | None | 200 OK |

**Request Body:**
```json
{
  \"login_id\": \"string (required)\"
}
```

**Test Cases:**
- ✅ Valid login_id sends OTP
- ❌ Unknown login_id returns 404

**G. Verify OTP (Reset Password)**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/verify-otp` | None | 200 OK |

**Request Body:**
```json
{
  \"login_id\": \"string (required)\",
  \"otp\": \"string (required)\"
}
```

**Test Cases:**
- ✅ Valid OTP allows password reset
- ❌ Invalid OTP returns 400

**H. Reset Password**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/reset-password` | None | 200 OK |

**Request Body:**
```json
{
  \"login_id\": \"string (required)\",
  \"password\": \"string (required, min:8, confirmed)\",
  \"password_confirmation\": \"string (required)\"
}
```

**Test Cases:**
- ✅ Valid password update success
- ❌ Password mismatch returns 422

**I. Change Password**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/change-password` | Bearer | 200 OK |

**Request Body:**
```json
{
  \"current_password\": \"string (required)\",
  \"password\": \"string (required, min:8, confirmed)\",
  \"password_confirmation\": \"string (required)\"
}
```

**Test Cases:**
- ✅ Valid current password allows change
- ❌ Wrong current password returns 400
- ❌ No token returns 401

#### 1.3 User Management (Admin Only)

**A. List Users**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/users` | Bearer | Admin | 200 OK |

**Test Cases:**
- ✅ Admin can list all users
- ❌ Staff cannot access (403)
- ❌ Buyer cannot access (403)
- ❌ No token returns 401

**B. Create User**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/users` | Bearer | Admin | 201 Created |

**Request Body:** (same as register)

**Test Cases:**
- ✅ Admin can create user
- ❌ Staff cannot create (403)
- ❌ Buyer cannot create (403)

**C. Show User Detail**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/users/{id}` | Bearer | Admin | 200 OK |

**Test Cases:**
- ✅ Admin can view user detail
- ❌ User not found returns 404
- ❌ Staff cannot access (403)

**D. Update User**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| PUT | `/api/users/{id}` | Bearer | Admin | 200 OK |

**Test Cases:**
- ✅ Admin can update user
- ❌ User not found returns 404
- ❌ Duplicate login_id returns 422
- ❌ Staff cannot update (403)

**E. Delete User**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| DELETE | `/api/users/{id}` | Bearer | Admin | 200 OK |

**⚠️ SAFETY WARNING:**
- **DO NOT test on real user data**
- Only test on disposable test accounts
- Ensure database is isolated test environment

**Test Cases:**
- ✅ Admin can delete user (test account only)
- ❌ User not found returns 404
- ❌ Staff cannot delete (403)

**F. Toggle User Status**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| PATCH | `/api/users/{id}/status` | Bearer | Admin | 200 OK |

**Request Body:**
```json
{
  \"is_active\": \"boolean (required)\"
}
```

**Test Cases:**
- ✅ Admin can toggle user status
- ❌ User not found returns 404
- ❌ Staff cannot toggle (403)

**G. Get Obat Count**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/obat/count` | Bearer | Admin | 200 OK |

**Test Cases:**
- ✅ Admin can get obat count
- ❌ Staff cannot access (403) **← VERIFY: Should staff be able to see count?**
- ❌ Buyer cannot access (403)

---

### ⚠️ FASE 2: ORDERS & PRESCRIPTION (Partial Coverage)

#### 2.1 Orders

**A. List Orders**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/orders` | Bearer | All authenticated | 200 OK |

**Authorization Logic:**
- **Pembeli:** Can only see their own orders (`user_id = auth_user_id`)
- **Staf:** Can see all orders
- **Admin:** Can see all orders (read-only per PRD)

**Query Parameters:**
- `status` (optional): filter by order status

**Test Cases:**
- ✅ Pembeli sees only own orders
- ✅ Staff sees all orders
- ✅ Admin sees all orders
- ✅ Filter by status works
- ❌ No token returns 401

**B. Create Order**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/orders` | Bearer | Pembeli, Staf | 201 Created |

**Request Body:**
```json
{
  \"items\": [
    {
      \"obat_id\": \"integer (required, exists)\",
      \"qty\": \"integer (required, min:1)\"
    }
  ],
  \"metode_pembayaran\": \"enum (required: cash/midtrans)\",
  \"order_source\": \"enum (mobile/pos, default: mobile)\",
  \"resep_id\": \"integer (nullable, exists)\"
}
```

**Business Logic (from OrderService):**
1. Check obat exists and is_active
2. Check stock availability via FEFO
3. Create stock reservation (duration based on payment method):
   - **Midtrans:** 15 minutes
   - **Cash:** 48 hours
4. Calculate total price (backend, not client)
5. Create order with status `diproses`
6. Reserve stock (doesn't deduct yet)

**Test Cases:**
- ✅ Valid order with sufficient stock creates reservation
- ✅ Midtrans payment has 15min expiry
- ✅ Cash payment has 48h expiry
- ✅ Price calculated by backend (ignore client-sent price)
- ✅ Stock reserved but not deducted
- ❌ Empty items returns 422
- ❌ Invalid obat_id returns 422
- ❌ Qty zero/negative returns 422
- ❌ Insufficient stock returns 422
- ❌ Inactive obat returns 422
- ❌ Invalid payment method returns 422
- ❌ Pembeli cannot set order_source to 'pos' (should be 'mobile')
- ❌ Invalid resep_id returns 422
- ❌ Resep belongs to other user returns 403
- ❌ Resep not approved cannot be used

**⚠️ AUTHORIZATION BUG FOUND:**
Per PRD, **hanya pembeli** yang bisa membuat order via mobile.
**Verify:** Does current implementation allow staff to create order via this endpoint?
If yes, this is authorization mismatch — staff should only use POS endpoint.

**C. Show Order Detail**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/orders/{id}` | Bearer | All authenticated | 200 OK |

**Authorization Logic:**
- **Pembeli:** Can only see own order
- **Staf/Admin:** Can see any order

**Test Cases:**
- ✅ Pembeli can view own order
- ✅ Staff can view any order
- ✅ Admin can view any order
- ❌ Pembeli cannot view other's order (403)
- ❌ Order not found returns 404

**D. Update Order Status**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| PATCH | `/api/orders/{id}/status` | Bearer | **Staf** | 200 OK |

**✅ CORRECT:** Route uses `role:staf` (fixed per roadmap v3.1)

**Request Body:**
```json
{
  \"status\": \"enum (required: diproses/siap_diambil/selesai/dibatalkan)\"
}
```

**Status Transitions (Business Rules):**
- `diproses` → `siap_diambil`
- `siap_diambil` → `selesai`
- Any → `dibatalkan` (with reservation release)

**Test Cases:**
- ✅ Staff can update order status
- ✅ Valid status transition succeeds
- ✅ Status change to 'selesai' deducts stock (FEFO)
- ❌ Invalid status returns 422
- ❌ Invalid transition returns 422
- ❌ Admin cannot update status (403) **← Per PRD: admin tidak operasional**
- ❌ Pembeli cannot update status (403)

**⚠️ CRITICAL: Stock Deduction Logic**
Based on StockReservationService:
- Order creation: **reserves** stock (doesn't deduct)
- Payment confirmed: marks as **confirmed**
- Status → 'selesai': **deducts** physical stock via FEFO

**Must Test:**
1. Order created → stock reserved, not deducted
2. Payment confirmed → reservation confirmed
3. Status 'selesai' → stock physically deducted
4. Cancel order → reservation released, stock available again
5. **No double deduction** on repeated status updates

**E. Confirm Payment**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/orders/{id}/confirm-payment` | Bearer | Staf | 200 OK |

**Purpose:** Confirm cash payment received (for cash orders)

**Test Cases:**
- ✅ Staff confirms cash payment
- ✅ Order payment_status becomes 'paid'
- ✅ Paid timestamp recorded
- ❌ Already paid returns 422
- ❌ Midtrans order should not use this (use webhook)
- ❌ Pembeli cannot confirm payment (403)

**F. Initiate Payment (Midtrans)** ❌ MISSING FROM OLD COLLECTION
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/orders/{id}/pay` | Bearer | Pembeli | 200 OK |

**Response:**
```json
{
  \"snap_token\": \"string (Midtrans token)\",
  \"snap_url\": \"string (Midtrans URL)\"
}
```

**⚠️ BLOCKED: Cannot test without Midtrans credentials**
- Requires `MIDTRANS_SERVER_KEY` in `.env`
- Roadmap v3.1: Midtrans integration done but not tested with real token

**Test Cases (When Midtrans Ready):**
- ✅ Valid order generates snap_token
- ✅ Snap token valid for 15 minutes
- ❌ Order not found returns 404
- ❌ Already paid returns 422
- ❌ Order not owned by buyer returns 403

**G. Cancel Order**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/orders/{id}/cancel` | Bearer | Pembeli, Staf | 200 OK |

**Business Logic:**
1. Change status to 'dibatalkan'
2. Release stock reservation
3. Stock becomes available again

**Test Cases:**
- ✅ Pembeli can cancel own order
- ✅ Staff can cancel any order
- ✅ Cancelled order releases reservation
- ✅ Stock becomes available after cancellation
- ✅ Cannot cancel completed order
- ❌ Pembeli cannot cancel other's order (403)
- ❌ Already cancelled returns 422

**⚠️ CRITICAL TEST: Stock Reservation Release**
Sequence to test:
1. Create order A (reserves 10 units)
2. Available stock = Total - 10
3. Try create order B with same stock → Should fail if insufficient
4. Cancel order A
5. Try create order B again → Should succeed (stock released)

**⚠️ BLOCKED: Cannot test without running server + isolated database**

#### 2.2 Prescription (Resep)

**A. List Resep**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/resep` | Bearer | All authenticated | 200 OK |

**Authorization Logic:**
- **Pembeli:** Can only see own resep
- **Staf:** Can see all resep
- **Admin:** Can see all resep (read-only per PRD)

**Test Cases:**
- ✅ Pembeli sees only own resep
- ✅ Staff sees all resep
- ✅ Admin sees all resep
- ❌ No token returns 401

**B. Create Resep**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/resep` | Bearer | **Pembeli** | 201 Created |

**Request Body:**
```json
{
  \"foto_resep\": \"string (required, URL)\",
  \"catatan\": \"string (nullable)\"
}
```

**⚠️ CRITICAL FINDING:**
Per PRD, **hanya pembeli** yang bisa upload resep.
Current route: `POST /api/resep` **NO ROLE RESTRICTION** (anyone authenticated can create)

**BUG:** Authorization mismatch
- **Expected:** `role:pembeli` middleware
- **Actual:** No role restriction
- **Impact:** Staff/Admin can create resep (violates PRD)
- **Severity:** MEDIUM
- **Recommendation:** Add `->middleware('role:pembeli')` to route

**Test Cases:**
- ✅ Pembeli can create resep
- ✅ user_id auto-set from authenticated user
- ❌ Staf should NOT be able to create resep (FAIL if can)
- ❌ Admin should NOT be able to create resep (FAIL if can)
- ❌ Empty foto_resep returns 422

**C. Show Resep Detail**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/resep/{id}` | Bearer | All authenticated | 200 OK |

**Authorization Logic:**
- **Pembeli:** Can only see own resep
- **Staf/Admin:** Can see any resep

**Test Cases:**
- ✅ Pembeli can view own resep
- ✅ Staff can view any resep
- ✅ Admin can view any resep
- ❌ Pembeli cannot view other's resep (403)
- ❌ Resep not found returns 404

**D. Validate Resep**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/resep/{id}/validate` | Bearer | **Staf** | 200 OK |

**✅ CORRECT:** Route uses `role:staf` (fixed per roadmap v3.1)

**Request Body:**
```json
{
  \"status\": \"enum (required: disetujui/ditolak)\",
  \"catatan_validasi\": \"string (nullable)\"
}
```

**Test Cases:**
- ✅ Staff can approve resep
- ✅ Staff can reject resep
- ✅ Approved resep can be used for order
- ✅ Rejected resep cannot be used for order
- ❌ Invalid status returns 422
- ❌ Admin cannot validate resep (403) **← Per PRD: admin tidak operasional**
- ❌ Pembeli cannot validate resep (403)
- ❌ Resep not found returns 404

---

### ❌ FASE 3: PRODUCT CATALOG (Missing from Collection)

#### 3.1 Public Catalog (No Auth Required or Pembeli)

**A. List Kategoris**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/katalog/kategoris` | None/Optional | Public | 200 OK |

**Purpose:** Public catalog untuk pembeli melihat kategori obat

**Test Cases:**
- ✅ Can access without token
- ✅ Returns all active categories
- ✅ Response is paginated
- ✅ JSON structure valid

**B. List Obat (Catalog)**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/katalog/obats` | None/Optional | Public | 200 OK |

**Query Parameters:**
- `search` (optional): nama obat
- `kategori_id` (optional): filter by category
- `jenis` (optional): filter by jenis_obat
- `per_page` (optional): pagination

**Business Logic:**
- Only returns obat where `is_active = true`
- Supports search, filter, pagination

**Test Cases:**
- ✅ Can access without token
- ✅ Returns only active obat
- ✅ Inactive obat NOT in results
- ✅ Search by nama works
- ✅ Filter by kategori_id works
- ✅ Filter by jenis works
- ✅ Pagination works
- ✅ Response structure valid

**C. Show Obat Detail (Catalog)**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/katalog/obats/{id}` | None/Optional | Public | 200 OK |

**Business Logic:**
- Only returns obat if `is_active = true`
- Returns 404 if inactive

**Test Cases:**
- ✅ Active obat returns detail
- ❌ Inactive obat returns 404
- ❌ Obat not found returns 404

#### 3.2 Product Management (Staf/Admin)

**Authorization Matrix:**
| Action | Staf | Admin |
|--------|------|-------|
| List Obat | ✅ | ✅ |
| Show Obat Detail | ✅ | ✅ |
| Create Obat | ✅ | ❌ |
| Update Obat | ✅ | ❌ |
| Delete (Deactivate) Obat | ✅ | ❌ |

**⚠️ PRD RULE:** Admin can only **VIEW** obat, cannot CRUD

**A. List Obat (Management)**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/obat` | Bearer | Staf, Admin | 200 OK |

**Difference from Catalog:**
- Shows ALL obat (including inactive)
- For management purpose

**Test Cases:**
- ✅ Staff can list all obat
- ✅ Admin can list all obat
- ✅ Inactive obat included
- ✅ Pagination works
- ❌ Pembeli cannot access (403)

**B. Show Obat Detail (Management)**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/obat/{id}` | Bearer | Staf, Admin | 200 OK |

**Test Cases:**
- ✅ Staff can view any obat
- ✅ Admin can view any obat
- ❌ Pembeli cannot access (403)
- ❌ Obat not found returns 404

**C. Create Obat**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/obat` | Bearer | **Staf Only** | 201 Created |

**Request Body:**
```json
{
  \"nama\": \"string (required, max:255)\",
  \"kategori_id\": \"integer (required, exists)\",
  \"jenis\": \"enum (required: bebas/bebas_terbatas/keras/golongan_narkotika)\",
  \"harga\": \"decimal (required, min:0)\",
  \"deskripsi\": \"text (nullable)\",
  \"foto\": \"string (nullable, URL)\",
  \"is_active\": \"boolean (default: true)\"
}
```

**Test Cases:**
- ✅ Staff can create obat
- ✅ Created obat is active by default
- ❌ Admin cannot create obat (403) **← Per PRD**
- ❌ Pembeli cannot create obat (403)
- ❌ Invalid kategori_id returns 422
- ❌ Negative harga returns 422
- ❌ Invalid jenis returns 422

**D. Update Obat**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| PUT | `/api/obat/{id}` | Bearer | **Staf Only** | 200 OK |

**Request Body:** (same as create, all fields optional)

**Test Cases:**
- ✅ Staff can update obat
- ❌ Admin cannot update obat (403) **← Per PRD**
- ❌ Pembeli cannot update obat (403)
- ❌ Obat not found returns 404
- ❌ Invalid data returns 422

**E. Delete (Deactivate) Obat**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| DELETE | `/api/obat/{id}` | Bearer | **Staf Only** | 200 OK |

**⚠️ IMPORTANT:** Per roadmap, this does **soft deactivation** (`is_active = false`), NOT hard delete

**Test Cases:**
- ✅ Staff can deactivate obat
- ✅ Obat `is_active` becomes false
- ✅ Deactivated obat NOT in public catalog
- ✅ Deactivated obat still in management list
- ❌ Admin cannot deactivate obat (403) **← Per PRD**
- ❌ Pembeli cannot deactivate obat (403)
- ❌ Obat not found returns 404

**⚠️ SAFETY WARNING:**
- **DO NOT test on real obat data**
- Only test on disposable test obat
- Ensure database is isolated test environment

#### 3.3 Category Management (Staf Only)

**A. Create Kategori**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/kategoris` | Bearer | **Staf Only** | 201 Created |

**Request Body:**
```json
{
  \"nama\": \"string (required, max:100, unique)\"
}
```

**Test Cases:**
- ✅ Staff can create kategori
- ❌ Admin cannot create kategori (403) **← Per PRD**
- ❌ Pembeli cannot create kategori (403)
- ❌ Duplicate nama returns 422
- ❌ Empty nama returns 422

**B. Update Kategori**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| PUT | `/api/kategoris/{id}` | Bearer | **Staf Only** | 200 OK |

**Request Body:**
```json
{
  \"nama\": \"string (required, max:100, unique)\"
}
```

**Test Cases:**
- ✅ Staff can update kategori
- ❌ Admin cannot update kategori (403)
- ❌ Pembeli cannot update kategori (403)
- ❌ Kategori not found returns 404
- ❌ Duplicate nama returns 422

**C. Delete Kategori**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| DELETE | `/api/kategoris/{id}` | Bearer | **Staf Only** | 200 OK |

**⚠️ SAFETY WARNING:**
- **DO NOT test on kategori with existing obat**
- May cause foreign key constraint violation
- Only test on disposable empty kategori

**Test Cases:**
- ✅ Staff can delete empty kategori
- ❌ Admin cannot delete kategori (403)
- ❌ Pembeli cannot delete kategori (403)
- ❌ Kategori not found returns 404
- ❌ Kategori with obat returns 422 (constraint)

---

### ❌ FASE 4: STOCK & BATCH MANAGEMENT (Missing from Collection)

#### 4.1 Batch Management

**Authorization Matrix:**
| Action | Staf | Admin |
|--------|------|-------|
| List Batches | ✅ | ✅ |
| Show Batch | ✅ | ✅ |
| Create Batch | ✅ | ❌ |
| Adjust Batch | ✅ | ❌ |

**⚠️ PRD RULE:** Admin can only **VIEW** stock/batch, cannot CRUD

**⚠️ CRITICAL FINDING:**
Current route: `batches` uses `role:staf,admin` for ALL actions (index, show, store, adjust)
**BUG:** Admin should NOT have write access (create/adjust)
**Recommendation:** Split routes:
- GET methods: `role:staf,admin` ✅
- POST/PUT methods: `role:staf` only ❌ Currently allows admin

**A. List Batches**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/batches` | Bearer | Staf, Admin | 200 OK |

**Query Parameters:**
- `obat_id` (optional): filter by obat
- `per_page` (optional): pagination

**Test Cases:**
- ✅ Staff can list batches
- ✅ Admin can list batches
- ✅ Filter by obat_id works
- ✅ Pagination works
- ❌ Pembeli cannot access (403)

**B. Show Batch Detail**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/batches/{id}` | Bearer | Staf, Admin | 200 OK |

**Test Cases:**
- ✅ Staff can view batch detail
- ✅ Admin can view batch detail
- ❌ Pembeli cannot access (403)
- ❌ Batch not found returns 404

**C. Create Batch**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/batches` | Bearer | Staf, Admin (BUG) | 201 Created |

**Request Body:**
```json
{
  \"obat_id\": \"integer (required, exists)\",
  \"batch_number\": \"string (required, max:50)\",
  \"expired_date\": \"date (required, after:today)\",
  \"jumlah_awal\": \"integer (required, min:1)\"
}
```

**Business Logic:**
- Creates batch with `jumlah_sisa = jumlah_awal`
- Records `PergerakanStok` with tipe 'masuk'

**Test Cases:**
- ✅ Staff can create batch
- ❌ **AUTHORIZATION BUG:** Admin should NOT be able to create batch (403 expected, but currently allowed) **← Per PRD**
- ❌ Pembeli cannot create batch (403)
- ❌ Invalid obat_id returns 422
- ❌ Past expired_date returns 422
- ❌ Negative jumlah returns 422

**D. Adjust Batch Stock**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| PUT | `/api/batches/{id}/adjust` | Bearer | Staf, Admin (BUG) | 200 OK |

**Request Body:**
```json
{
  \"jumlah_sisa\": \"integer (required, min:0)\",
  \"reason\": \"string (nullable)\"
}
```

**Business Logic:**
- Updates `jumlah_sisa`
- Records `PergerakanStok` with tipe 'penyesuaian'
- Difference = old - new
- If difference > 0: tipe 'keluar' (stock reduced)
- If difference < 0: tipe 'masuk' (stock added)

**Test Cases:**
- ✅ Staff can adjust batch
- ✅ Stock movement recorded
- ❌ **AUTHORIZATION BUG:** Admin should NOT be able to adjust batch (403 expected, but currently allowed) **← Per PRD**
- ❌ Pembeli cannot adjust batch (403)
- ❌ Negative jumlah returns 422
- ❌ Batch not found returns 404

**⚠️ SAFETY WARNING:**
- **DO NOT test on real batch data**
- Only test on disposable test batches
- Ensure database is isolated test environment

#### 4.2 Stock Movement History

**A. List Stock Movements**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| GET | `/api/stock/movements` | Bearer | Staf, Admin | 200 OK |

**Query Parameters:**
- `obat_id` (optional): filter by obat
- `tipe` (optional): filter by tipe (masuk/keluar/penyesuaian)
- `search` (optional): search by obat name or batch
- `per_page` (optional): pagination

**Purpose:** Audit trail untuk pergerakan stok

**Test Cases:**
- ✅ Staff can view movements
- ✅ Admin can view movements
- ✅ Filter by obat_id works
- ✅ Filter by tipe works
- ✅ Search works
- ✅ Pagination works
- ❌ Pembeli cannot access (403)

#### 4.3 FEFO (First Expired First Out) Logic Testing

**⚠️ CRITICAL:** FEFO logic di StockService harus diverifikasi

**Test Scenario:**
1. Create obat "Paracetamol"
2. Create 3 batches:
   - Batch A: expired 2027-01-01, qty 50
   - Batch B: expired 2027-06-01, qty 30
   - Batch C: expired 2026-12-01, qty 20 (paling cepat expired)
3. Create order with qty 40
4. Expected allocation:
   - Batch C: 20 (all, karena paling dekat expired)
   - Batch A: 20 (sisanya, karena expired lebih dekat dari B)
   - Batch B: 0 (tidak terpakai)
5. Verify stock deduction follows FEFO

**⚠️ BLOCKED: Cannot test without running server + isolated database**

---

### ❌ FASE 5: POS KASIR (Missing from Collection)

**A. Create POS Transaction**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/kasir/transaksi` | Bearer | **Staf Only** | 201 Created |

**Request Body:**
```json
{
  \"items\": [
    {
      \"obat_id\": \"integer (required, exists)\",
      \"qty\": \"integer (required, min:1)\"
    }
  ],
  \"metode_pembayaran\": \"cash\" // POS v1 hanya cash
}
```

**Business Logic (per Roadmap v3.1):**
1. `order_source = 'pos'`
2. `user_id = null` (walk-in customer)
3. `created_by = auth_staff_id` (staf yang input)
4. Status langsung `selesai` (no reservation)
5. Payment langsung `paid`
6. Stock langsung deducted via FEFO (no reservation step)

**Difference from Mobile Order:**
| Aspect | Mobile Order | POS Kasir |
|--------|--------------|-----------|
| `order_source` | mobile | pos |
| `user_id` | required (pembeli) | null (walk-in) |
| `created_by` | same as user_id | staff_id |
| Initial status | diproses | selesai |
| Payment status | pending | paid |
| Stock | reserved first | deducted immediately |

**Test Cases:**
- ✅ Staff can create POS transaction
- ✅ Order created with correct fields
- ✅ Status immediately 'selesai'
- ✅ Payment immediately 'paid'
- ✅ Stock deducted via FEFO
- ❌ Admin cannot create POS transaction (403) **← Per PRD**
- ❌ Pembeli cannot create POS transaction (403)
- ❌ Insufficient stock returns 422
- ❌ Invalid obat_id returns 422

**⚠️ SAFETY WARNING:**
- **DO NOT test on production database**
- Creates completed transactions immediately
- Deducts real stock

---

### ❌ FASE 6: PAYMENT INTEGRATION (Missing from Collection)

#### 6.1 Midtrans Payment

**A. Initiate Payment (Snap Token)**
| Method | Endpoint | Auth | Role | Expected |
|--------|----------|------|------|----------|
| POST | `/api/orders/{id}/pay` | Bearer | Pembeli | 200 OK |

**⚠️ BLOCKED: Midtrans Credentials Not Configured**
- Requires `MIDTRANS_SERVER_KEY` in `.env`
- Roadmap v3.1: Backend code ready but not tested with real token

**Response:**
```json
{
  \"snap_token\": \"string\",
  \"snap_url\": \"string\"
}
```

**Test Cases (When Midtrans Ready):**
- ✅ Valid order generates snap_token
- ✅ Snap token stored in order
- ❌ Order not found returns 404
- ❌ Order not owned by buyer returns 403
- ❌ Already paid returns 422

**B. Midtrans Webhook Callback**
| Method | Endpoint | Auth | Expected |
|--------|----------|------|----------|
| POST | `/api/payment/midtrans/callback` | Signature | 200 OK |

**⚠️ SPECIAL:** This endpoint uses **signature verification**, NOT Bearer token

**Purpose:** Midtrans sends notification when payment status changes

**Business Logic (per PaymentService):**
1. Verify Midtrans signature
2. Get transaction status from Midtrans
3. Update order payment_status based on result:
   - `capture/settlement` → `paid`
   - `pending` → `pending`
   - `deny/cancel/expire` → `failed`
4. If `paid`: confirm stock reservation

**⚠️ BLOCKED: Cannot test without Midtrans sandbox webhook**
- Requires real Midtrans notification
- Signature must be valid

**Test Cases (When Midtrans Ready):**
- ✅ Valid signature processes notification
- ✅ Payment success updates order
- ✅ Stock reservation confirmed on success
- ❌ Invalid signature returns 403
- ❌ Unknown order_id returns 404

---

## PART D: AUTHORIZATION MATRIX

### Complete Role-Based Access Control

| Endpoint | Method | Pembeli | Staf | Admin | Notes |
|----------|--------|---------|------|-------|-------|
| `/api/health` | GET | ✅ | ✅ | ✅ | Public |
| `/api/register` | POST | ✅ | ✅ | ✅ | Public |
| `/api/verify-otp-register` | POST | ✅ | ✅ | ✅ | Public |
| `/api/login` | POST | ✅ | ✅ | ✅ | Public |
| `/api/logout` | POST | ✅ | ✅ | ✅ | Authenticated |
| `/api/change-password` | POST | ✅ | ✅ | ✅ | Authenticated |
| `/api/user` | GET | ✅ | ✅ | ✅ | Authenticated |
| `/api/forgot-password` | POST | ✅ | ✅ | ✅ | Public |
| `/api/verify-otp` | POST | ✅ | ✅ | ✅ | Public |
| `/api/reset-password` | POST | ✅ | ✅ | ✅ | Public |
| `/api/users` | GET | ❌ | ❌ | ✅ | Admin only |
| `/api/users` | POST | ❌ | ❌ | ✅ | Admin only |
| `/api/users/{id}` | GET | ❌ | ❌ | ✅ | Admin only |
| `/api/users/{id}` | PUT | ❌ | ❌ | ✅ | Admin only |
| `/api/users/{id}` | DELETE | ❌ | ❌ | ✅ | Admin only |
| `/api/users/{id}/status` | PATCH | ❌ | ❌ | ✅ | Admin only |
| `/api/obat/count` | GET | ❌ | ❌ | ✅ | Admin only |
| `/api/katalog/kategoris` | GET | ✅ | ✅ | ✅ | Public catalog |
| `/api/katalog/obats` | GET | ✅ | ✅ | ✅ | Public catalog |
| `/api/katalog/obats/{id}` | GET | ✅ | ✅ | ✅ | Public catalog |
| `/api/obat` | GET | ❌ | ✅ | ✅ | Management |
| `/api/obat/{id}` | GET | ❌ | ✅ | ✅ | Management |
| `/api/obat` | POST | ❌ | ✅ | ❌ | Staf only |
| `/api/obat/{id}` | PUT | ❌ | ✅ | ❌ | Staf only |
| `/api/obat/{id}` | DELETE | ❌ | ✅ | ❌ | Staf only |
| `/api/kategoris` | POST | ❌ | ✅ | ❌ | Staf only |
| `/api/kategoris/{id}` | PUT | ❌ | ✅ | ❌ | Staf only |
| `/api/kategoris/{id}` | DELETE | ❌ | ✅ | ❌ | Staf only |
| `/api/orders` | GET | ✅ (own) | ✅ (all) | ✅ (all) | Filtered by role |
| `/api/orders` | POST | ✅ | ⚠️ | ❌ | **Verify:** Should staf use POS instead? |
| `/api/orders/{id}` | GET | ✅ (own) | ✅ (all) | ✅ (all) | Filtered by ownership |
| `/api/orders/{id}/status` | PATCH | ❌ | ✅ | ❌ | Staf only (operational) |
| `/api/orders/{id}/confirm-payment` | POST | ❌ | ✅ | ❌ | Staf only |
| `/api/orders/{id}/pay` | POST | ✅ | ❌ | ❌ | Pembeli only |
| `/api/orders/{id}/cancel` | ✅ (own) | ✅ (all) | ❌ | Pembeli/Staf |
| `/api/resep` | GET | ✅ (own) | ✅ (all) | ✅ (all) | Filtered by role |
| `/api/resep` | POST | ✅ | ⚠️ | ⚠️ | **BUG:** Should be pembeli only |
| `/api/resep/{id}` | GET | ✅ (own) | ✅ (all) | ✅ (all) | Filtered by ownership |
| `/api/resep/{id}/validate` | POST | ❌ | ✅ | ❌ | Staf only (operational) |
| `/api/batches` | GET | ❌ | ✅ | ✅ | Staf/Admin |
| `/api/batches/{id}` | GET | ❌ | ✅ | ✅ | Staf/Admin |
| `/api/batches` | POST | ❌ | ✅ | ⚠️ | **BUG:** Admin should not write |
| `/api/batches/{id}/adjust` | PUT | ❌ | ✅ | ⚠️ | **BUG:** Admin should not write |
| `/api/stock/movements` | GET | ❌ | ✅ | ✅ | Staf/Admin |
| `/api/kasir/transaksi` | POST | ❌ | ✅ | ❌ | Staf only (POS) |
| `/api/payment/midtrans/callback` | POST | Signature | Signature | Signature | Webhook (no user auth) |

### Legend:
- ✅ = Allowed
- ❌ = Forbidden
- ⚠️ = Authorization bug/mismatch detected
- (own) = Can only access own resources
- (all) = Can access any resource

---

## PART E: BUG FINDINGS

### Critical Bugs (Must Fix)

#### BUG-001: Resep Creation Missing Role Restriction
**Severity:** MEDIUM  
**Module:** Prescription  
**Endpoint:** `POST /api/resep`

**Expected Behavior (per PRD):**
- Only **pembeli** can upload prescription
- Should have `->middleware('role:pembeli')` on route

**Actual Behavior:**
- Route has NO role restriction
- Anyone authenticated (staf, admin) can create resep

**Impact:**
- Authorization mismatch
- Staf/Admin can create resep (violates PRD)

**File:** `Backend/routes/api.php` line ~88

**Recommendation:**
```php
Route::middleware(['auth:sanctum', 'role:pembeli'])->prefix('resep')->group(function () {
    Route::post('/', [ResepController::class, 'store'])->name('resep.store');
});

// Separate routes for list/show/validate
Route::middleware(['auth:sanctum'])->prefix('resep')->group(function () {
    Route::get('/', [ResepController::class, 'index'])->name('resep.index');
    Route::get('/{id}', [ResepController::class, 'show'])->name('resep.show');
});

Route::middleware(['auth:sanctum', 'role:staf'])->prefix('resep')->group(function () {
    Route::post('/{id}/validate', [ResepController::class, 'validate'])->name('resep.validate');
});
```

**Test to Verify Fix:**
- ✅ Pembeli can create resep → 201
- ❌ Staf attempts create resep → 403
- ❌ Admin attempts create resep → 403

---

#### BUG-002: Batch Write Operations Allow Admin
**Severity:** MEDIUM  
**Module:** Stock & Batch Management  
**Endpoints:** 
- `POST /api/batches`
- `PUT /api/batches/{id}/adjust`

**Expected Behavior (per PRD):**
- Admin can only **VIEW** stock/batch (read-only)
- Only **staf** can create/adjust batches
- Should have `->middleware('role:staf')` on write operations

**Actual Behavior:**
- Both endpoints use `->middleware('role:staf,admin')`
- Admin can create and adjust batches

**Impact:**
- Authorization mismatch
- Admin has operational access (violates PRD: admin tidak operasional)

**File:** `Backend/routes/api.php` line ~110

**Recommendation:**
```php
// Read operations: staf + admin
Route::middleware(['auth:sanctum', 'role:staf,admin'])->prefix('batches')->group(function () {
    Route::get('/', [BatchController::class, 'index'])->name('batches.index');
    Route::get('/{id}', [BatchController::class, 'show'])->name('batches.show');
});

// Write operations: staf only
Route::middleware(['auth:sanctum', 'role:staf'])->prefix('batches')->group(function () {
    Route::post('/', [BatchController::class, 'store'])->name('batches.store');
    Route::put('/{id}/adjust', [BatchController::class, 'adjust'])->name('batches.adjust');
});
```

**Test to Verify Fix:**
- ✅ Staf can create batch → 201
- ✅ Staf can adjust batch → 200
- ✅ Admin can view batches → 200
- ❌ Admin attempts create batch → 403
- ❌ Admin attempts adjust batch → 403

---

#### BUG-003: Login_ID Inconsistency (Documentation vs Implementation)
**Severity:** LOW (Documentation Issue)  
**Module:** Authentication

**Issue:**
- Old Postman documentation uses `no_hp` field
- Actual implementation uses `login_id` field
- May cause confusion for API consumers

**Impact:**
- Documentation mismatch
- Old collection requests will fail

**Recommendation:**
- Update all documentation to use `login_id`
- Add migration note for API consumers
- Consider deprecation notice if `no_hp` was previously exposed

---

### Authorization Findings Summary

| Finding | Severity | Actual | Expected (PRD) | Status |
|---------|----------|--------|----------------|--------|
| **Resep Creation** | MEDIUM | Any authenticated | Pembeli only | ❌ FAIL |
| **Batch Creation** | MEDIUM | Staf + Admin | Staf only | ❌ FAIL |
| **Batch Adjustment** | MEDIUM | Staf + Admin | Staf only | ❌ FAIL |
| **Order Status Update** | - | Staf only | Staf only | ✅ PASS |
| **Resep Validation** | - | Staf only | Staf only | ✅ PASS |
| **Obat CRUD** | - | Staf only | Staf only | ✅ PASS |
| **Kategori CRUD** | - | Staf only | Staf only | ✅ PASS |
| **User Management** | - | Admin only | Admin only | ✅ PASS |
| **POS Kasir** | - | Staf only | Staf only | ✅ PASS |

**Authorization Score:** 6/9 (66.7%)  
**Failed:** 3 authorization checks  
**Passed:** 6 authorization checks

---

## PART F: DATA SAFETY ASSESSMENT

### Database Target Status: ⚠️ UNKNOWN

**Status:** Cannot verify database target due to server being down

**Assessment:**
- ✅ `.env` file not read (respects security)
- ❌ Server not accessible (port 8000 closed)
- ❌ Cannot verify database connection type
- ❌ Cannot confirm if database is isolated test environment

### Testing Safety Decisions

#### ✅ SAFE TO TEST (When Server Available):
- GET requests (read-only)
- POST `/api/login` with test accounts
- GET `/api/health`
- GET `/api/katalog/*` (public catalog)
- GET endpoints with proper authorization

#### ⚠️ REQUIRES CONFIRMATION:
- POST `/api/register` (creates user)
- POST `/api/orders` (reserves stock)
- POST `/api/resep` (creates prescription)
- POST `/api/batches` (adds stock)

**Condition:** Only safe if database is confirmed as isolated test environment

#### ❌ BLOCKED / HIGH RISK:
- DELETE endpoints (any)
- PUT `/api/batches/{id}/adjust` (modifies stock)
- PATCH `/api/orders/{id}/status` (changes order state)
- POST `/api/kasir/transaksi` (creates completed transaction)
- Any mutation on production/shared database

**Reason:** Cannot verify database target is safe for testing

---

## PART G: POSTMAN DELIVERABLES

### What Was Attempted:

1. ✅ **Endpoint Audit:** Complete analysis of 46 endpoints
2. ✅ **Gap Analysis:** Identified 20 missing endpoints from old collection
3. ✅ **Test Specifications:** Detailed test cases for all endpoints
4. ✅ **Authorization Matrix:** Complete role-based access map
5. ✅ **Bug Findings:** 3 authorization mismatches documented
6. ✅ **Security Analysis:** Database safety assessment
7. ✅ **Documentation Update:** This comprehensive report

### What Could Not Be Delivered:

1. ❌ **Updated Collection via Postman API:** MCP connection failed
2. ❌ **Executed Test Results:** Server not running
3. ❌ **Real Response Validation:** Cannot send requests
4. ❌ **Stock Reservation Testing:** Requires database + server
5. ❌ **FEFO Logic Verification:** Requires actual execution
6. ❌ **Payment Integration Testing:** Blocked by Midtrans credentials
7. ❌ **Collection Runner Results:** Cannot execute programmatically

### Manual Workaround Required:

**To complete testing, user must:**

1. **Start Laravel Server:**
   ```bash
   cd Backend
   php artisan serve
   ```

2. **Verify Database:**
   - Confirm using isolated test database
   - Run migrations if needed
   - Seed test data (users, kategoris, obats, batches)

3. **Create Test Accounts:**
   - Admin account with `login_id` and password
   - Staff account with `login_id` and password
   - Buyer account with `login_id` and password
   - Set in Postman environment variables

4. **Import Collection Manually:**
   - Use Postman Desktop App
   - Import > File > (collection JSON when provided)
   - Set environment variables

5. **Execute Tests:**
   - Run collection in order
   - Verify authorization checks
   - Test stock reservation flow
   - Document results

---

## PART H: RECOMMENDATIONS

### For Implementation Team (Agent 1):

#### Priority 1: Fix Authorization Bugs
1. **BUG-001:** Add `role:pembeli` to `POST /api/resep`
2. **BUG-002:** Split batch routes (read: staf+admin, write: staf only)
3. **BUG-003:** Update all documentation to use `login_id`

#### Priority 2: Complete Missing Test Data
4. Create database seeder for test accounts:
   ```php
   // Admin: admin@mediva.test / Password123!
   // Staff: staff@mediva.test / Password123!
   // Buyer: buyer@mediva.test / Password123!
   ```

5. Create seeder for test katalog:
   - 5 kategoris
   - 20 obats (10 active, 10 inactive)
   - 30 batches with varying expiry dates

#### Priority 3: Testing Infrastructure
6. Setup isolated test database:
   - Separate from development/production
   - Safe for mutation testing
   - Auto-reset capability

7. Configure Midtrans Sandbox:
   - Get sandbox credentials
   - Set `MIDTRANS_SERVER_KEY` in `.env`
   - Test payment flow end-to-end

#### Priority 4: Documentation
8. Update API documentation with:
   - Current endpoint list (46 endpoints)
   - `login_id` field (not `no_hp`)
   - Authorization matrix
   - Test account credentials

9. Create Postman collection v2:
   - Include all 46 endpoints
   - Pre-request scripts for token management
   - Test assertions for all requests
   - Environment template

### For Testing (Agent 2 / Manual QA):

#### When Server Is Ready:

**Test Sequence:**
1. Health Check
2. Login (Admin, Staff, Buyer)
3. Authentication Flow (Register → OTP → Login)
4. User Management (Admin)
5. Public Catalog (no auth)
6. Product Management (Staff)
7. Category Management (Staff)
8. Stock & Batch (Staff read/write, Admin read-only)
9. Order Flow (Buyer creates → Staff updates)
10. Stock Reservation (Create → Cancel → Verify release)
11. FEFO Logic (Multiple batches with different expiry)
12. Prescription Flow (Buyer uploads → Staff validates)
13. POS Kasir (Staff)
14. Authorization Negative Tests

#### Critical Tests:
- ✅ FEFO allocation follows expiry date order
- ✅ Stock reservation releases on cancel
- ✅ No double stock deduction
- ✅ Admin cannot perform operational actions
- ✅ Pembeli can only see own orders/resep
- ✅ Payment confirmation deducts stock once

---

## PART I: CONCLUSION

### Summary

**Endpoint Coverage:** 56.5% (26 old / 46 actual)  
**Authorization Compliance:** 66.7% (6 passed / 3 failed)  
**Testing Status:** ⚠️ BLOCKED (server down, MCP failed)

### Achievements Despite Blockers:

This report provides implementation team with:
1. Complete API audit (46 endpoints documented)
2. Authorization gap analysis (3 bugs found)
3. Comprehensive test specifications
4. Security assessment and safety guidelines
5. Actionable recommendations for fixes

### Next Steps:

1. **Implementation Team:** Fix 3 authorization bugs
2. **DevOps:** Start server + confirm database safety
3. **Testing Team:** Execute manual tests when ready
4. **Documentation Team:** Update collection with new endpoints

### Final Status:

```
✅ API Audit: COMPLETE
✅ Bug Findings: 3 issues documented
✅ Test Specifications: All 46 endpoints covered
❌ Test Execution: BLOCKED (server/MCP)
⚠️ Collection Update: Manual import required
```

**Recommendation:** This report should be handed off to implementation team for bug fixes, then manual QA can execute comprehensive testing once infrastructure is ready.

---

**Report Generated By:** Kiro AI Agent (API Testing Specialist)  
**Date:** 23 November 2026  
**Branch Tested:** `ilham`  
**Total Time Invested:** Source code review, endpoint mapping, authorization analysis, bug documentation

**Thank you for providing clear PRD and realistic roadmap. Testing would be more effective with:**
- Running Laravel server
- Working Postman MCP connection
- Isolated test database
- Test account credentials
- Midtrans sandbox access

**Status:** Ready for handoff to implementation team for remediation.

