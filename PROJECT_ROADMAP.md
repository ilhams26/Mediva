# PROJECT ROADMAP — Mediva Smart Medicine Platform

**Project:** Mediva — Smart Medicine Platform  
**Version:** 3.0 CORRECTED  
**Last Updated:** 23 November 2026  
**Status:** Active Development — Based on Actual Source Code Audit

> **DOKUMEN INI MENCERMINKAN STATUS IMPLEMENTASI AKTUAL,** bukan wishful thinking atau planning teoritis. Setiap status telah diverifikasi dari source code repository.

---

## FAKTA IMPLEMENTASI SAAT INI

### ✅ Yang SUDAH Ada (Verified)

**Backend Laravel:**
- [x] Authentication API (register, login, logout, OTP, forgot password)
- [x] User Management API (admin only) — CRUD users dengan role-based access
- [x] Database migrations: users, kategoris, obats, batches, orders, order_items, pergerakan_stok, resep, notifikasis
- [x] pgvector extension tables: obat_embeddings, interaksi_penggunas
- [x] OrderService dengan FEFO logic
- [x] OrderController dengan basic endpoints
- [x] ResepController dengan basic endpoints
- [x] Sanctum Bearer token authentication

**Web React:**
- [x] Login page
- [x] Dashboard Staf (placeholder)
- [x] Dashboard Admin (placeholder)
- [x] Protected routes dengan role-based access
- [x] Sidebar navigation
- [x] AuthContext & authService
- [x] API service dengan Bearer token

### ⚠️ Yang PARTIALLY Implemented

**Backend:**
- ⚠️ ObatController — Hanya punya `count()` method, **TIDAK ADA** CRUD catalog API
- ⚠️ OrderService — Menggunakan status `'pending'` yang **TIDAK ADA** di migration
- ⚠️ API routes — Update order status & validate resep masih `role:admin` (harusnya `role:staf`)
- ⚠️ orders table — **MISSING** kolom: `created_by`, `order_source` (perlu migration)

**Web React:**
- ⚠️ KelolaPengguna page — Ada struktur tapi implementasi belum lengkap
- ⚠️ Dashboard — Placeholder, tidak ada data real

### ❌ Yang BELUM Ada Sama Sekali

**Mobile Flutter:**
- ❌ Folder `Mobile/` **TIDAK ADA** di repository
- ❌ `pubspec.yaml` tidak ditemukan
- ❌ Semua claim "Flutter sudah ada" adalah **SALAH**

**Backend:**
- ❌ KategoriController tidak ada
- ❌ ObatService tidak ada
- ❌ Catalog API endpoints tidak ada (`/katalog/kategoris`, `/katalog/obats`)
- ❌ AI Service belum implementasi
- ❌ Recommendation Service belum implementasi
- ❌ Midtrans integration belum ada
- ❌ Notification Service belum ada

**Web React:**
- ❌ CRUD Obat pages tidak ada
- ❌ Kelola Stok & Batch pages tidak ada
- ❌ Pesanan Online pages tidak ada
- ❌ Validasi Resep pages tidak ada
- ❌ Kasir/POS pages tidak ada
- ❌ Laporan pages tidak ada
- ❌ Data Obat Read-Only (Admin) tidak ada

---

## ROADMAP BERDASARKAN REALITAS

### FASE 1: FOUNDATION & AUTH ✅ COMPLETE
**Status:** Done  
**Evidence:** Source code verified

**Completed:**
- ✅ Laravel 12 setup dengan PostgreSQL
- ✅ Database migrations lengkap
- ✅ Sanctum authentication
- ✅ Auth API endpoints working
- ✅ User Management API (admin)
- ✅ Web React login page
- ✅ Protected routes dengan role

**What Works:**
- POST `/api/register` dengan OTP verification
- POST `/api/login` dengan Bearer token
- POST `/api/logout`
- POST `/api/forgot-password`, `/api/verify-otp`, `/api/reset-password`
- GET `/api/users` (admin only)
- POST, PUT, DELETE `/api/users/{id}` (admin only)

---

### FASE 2: ORDER & PRESCRIPTION ✅ COMPLETE (Backend Critical Fixes Done)
**Status:** Backend critical fixes implemented & tested; Web BELUM  
**Progress:** ~85% (backend core complete, web frontend pending)

**Implemented:**
- ✅ OrderService dengan FEFO stock deduction
- ✅ OrderController endpoints (index, store, show, updateStatus, cancel)
- ✅ ResepController endpoints (index, store, show, validate)
- ✅ Batch model dengan FEFO logic
- ✅ PergerakanStok model untuk stock tracking

**Issues to Fix:**
- ⚠️ OrderService uses status `'pending'` — **TIDAK ADA di migration**
- ⚠️ Migration orders: `user_id` NOT NULL — **tidak support POS walk-in**
- ⚠️ Migration orders: **MISSING** `created_by` column
- ⚠️ Migration orders: **MISSING** `order_source` column
- ⚠️ API routes: `updateStatus` & `validate` masih `role:admin` — **harusnya `role:staf`**

**Next Steps:**
1. Fix OrderService status (hapus `'pending'`, gunakan hanya: diproses, siap_diambil, selesai, dibatalkan)
2. Create migration: make `orders.user_id` NULLABLE
3. Create migration: add `orders.created_by` (nullable foreignId to users)
4. Create migration: add `orders.order_source` enum('mobile', 'pos') default 'mobile'
5. Fix API routes authorization: change `role:admin` to `role:staf`
6. Build Web React pages: Pesanan Online, Validasi Resep

---

### FASE 3: PRODUCT CATALOG ✅ COMPLETE
**Status:** Backend & Web React CRUD + katalog public complete  
**Progress:** ~100% (backend & staf/admin web pages)

**What EXISTS:**
- ✅ ObatController with CRUD + catalog methods
- ✅ ObatService
- ✅ KategoriController
- ✅ ObatResource & Form Requests

**What's MISSING:**
- ❌ Mobile: Product catalog (Flutter belum ada!)

**Tasks:**
1. **Backend:**
   - [x] Create ObatService (business logic layer)
   - [x] Extend ObatController: index, show, store, update, destroy
   - [x] Create KategoriController: index, store, update, destroy
   - [x] Add routes: GET `/api/katalog/kategoris`, GET `/api/katalog/obats`, GET `/api/katalog/obats/{id}`
   - [x] Implement search & filter logic (nama, kategori, jenis, is_active)
   - [x] Add authorization: CRUD hanya `role:staf`, catalog public/pembeli
   - [x] JANGAN gunakan SoftDeletes — gunakan `is_active = false`

2. **Web React (Staf):**
   - [x] Create `KelolaObat.jsx` page (list obat dengan search, pagination)
   - [x] Create `TambahObat.jsx` form (nama, kategori, harga, jenis, deskripsi, foto)
   - [x] Create `EditObat.jsx` form
   - [x] Implement toggle `is_active` (bukan delete)
   - [x] Create `KelolaKategori.jsx` page

3. **Web React (Admin):**
   - [x] Create `DataObat.jsx` page (**READ-ONLY**, no add/edit/delete buttons)

---

### FASE 4: STOCK & BATCH MANAGEMENT ✅ IN PROGRESS (Backend + Web UI)
**Status:** Backend batch CRUD + StockService done; Web pages created & build passing  
**Progress:** ~60%

**What EXISTS:**
- ✅ Batch model
- ✅ PergerakanStok model
- ✅ FEFO logic di OrderService
- ✅ StockReservationService (reserve/confirm/release/FEFO)
- ✅ StockService (getBatches, createBatch, adjustBatch, lowStockAlerts, movements)
- ✅ BatchController (index, store, show, adjust)
- ✅ StockMovementController (movements)

**What's MISSING:**  
- ❌ Low stock alert notification trigger (hook notifier — Fase 8 Notifications)
- ❌ Web React: Stock movement history page integration polish

**Tasks:**
1. **Backend:** ✅ SELESAI
   - [x] Create BatchController: index, store, update (qty adjustment)
   - [x] Create StockService: stock validation, FEFO deduction, low stock check
   - [x] Add routes: GET/POST `/api/batches`, PUT `/api/batches/{id}/adjust`
   - [x] Implement low stock alert trigger

2. **Web React:** ✅ SELESAI (halaman dibuat, build passing)
   - [x] Create `KelolaStok.jsx` page (list batch per obat)
   - [x] Create `TambahBatch.jsx` form (batch_number, expired_date, jumlah_awal)
   - [x] Create `AdjustStok.jsx` form (adjust jumlah_sisa, reason, created_by)
   - [x] Create `RiwayatStok.jsx` page (pergerakan_stok history)

---

### FASE 5: POS KASIR (OFFLINE) ✅ IN PROGRESS (Backend done, Web mostly done)
**Status:** Backend POS transaction endpoint done; Web Kasir page live (build passing)  
**Progress:** ~70%

**Requirements:**
- Migration orders: `user_id` NULLABLE, `created_by` NOT NULL, `order_source` = 'pos'
- Status langsung `selesai` setelah transaksi
- Payment langsung `paid` (cash only versi awal)
- FEFO stock deduction sama seperti mobile order

**Tasks:**
1. **Backend:** ✅ SELESAI
   - [x] Implement migration fixes (user_id nullable, created_by, order_source)
   - [x] Update OrderService: support POS flow (direct to `selesai`)
   - [x] Add route: POST `/api/kasir/transaksi` (staf only)

2. **Web React:** 🟡 SEBAGIAN
   - [x] Create `Kasir.jsx` page (katalog via `/obat`, keranjang, cash payment, success modal)
   - [x] Product search & select (autocomplete via search)
   - [x] Cart component untuk kasir (localStorage cart)
   - [x] Cash payment form (uang diterima, kembalian)
   - [ ] Print receipt (PDF)

---

### FASE 6: PAYMENT INTEGRATION 🟡 IN PROGRESS
**Status:** In progress — SDK install pending, PaymentService belum dibuat  
**Progress:** ~10%

**What EXISTS:**
- ✅ Payment columns di orders table (metode_pembayaran, payment_status, snap_token, midtrans_transaction_id, paid_at)

**What's MISSING:**
- ❌ Midtrans SDK setup
- ❌ Snap token generation
- ❌ Payment webhook handler
- ❌ Payment verification logic
- ❌ Mobile integration (Flutter belum ada!)

**Tasks:**
1. **Backend:**
   - [ ] Setup Midtrans Sandbox credentials (`.env`)
   - [ ] Install Midtrans PHP SDK
   - [ ] Create PaymentService: generateSnapToken, verifySignature
   - [ ] Create PaymentController: initiate, callback
   - [ ] Add routes: POST `/api/orders/{id}/pay`, POST `/api/payment/midtrans/callback`
   - [ ] **JANGAN** membuat migration baru untuk payment columns (sudah ada!)

2. **Mobile (When Flutter Ready):**
   - [ ] Integrate Midtrans Snap (WebView)
   - [ ] Payment confirmation page
   - [ ] Handle payment redirect

---

### FASE 7: AI ASSISTANT & RECOMMENDATIONS ❌ NOT STARTED
**Status:** Database ready, service belum  
**Progress:** ~5%

**What EXISTS:**
- ✅ obat_embeddings table dengan pgvector
- ✅ interaksi_penggunas table

**What's MISSING:**
- ❌ Gemini API setup
- ❌ AIService implementation
- ❌ RecommendationService implementation
- ❌ Embedding generation script
- ❌ Semantic search logic
- ❌ AI chat endpoint
- ❌ Recommendation endpoint
- ❌ Mobile UI (Flutter belum ada!)

**Tasks:**
1. **Backend:**
   - [ ] Setup Gemini API key (`.env`)
   - [ ] Create AIService: generateEmbedding, chat, searchSimilar
   - [ ] Create RecommendationService: popularity, co-purchase, semantic
   - [ ] Add routes: POST `/api/ai/chat`, GET `/api/recommendations`
   - [ ] Create seeder: generate embeddings untuk obat existing
   - [ ] Auto-generate embedding saat create/update obat

2. **Mobile (When Flutter Ready):**
   - [ ] AI Assistant chat UI
   - [ ] Recommendation carousel
   - [ ] "Related Products" section

---

### FASE 8: NOTIFICATIONS ❌ NOT STARTED
**Status:** Table exists, service belum  
**Progress:** ~5%

**What EXISTS:**
- ✅ notifikasis table

**What's MISSING:**
- ❌ Notification service
- ❌ Real-time push (WebSocket/FCM)
- ❌ Email notifications
- ❌ Notification triggers
- ❌ Web UI notification dropdown
- ❌ Mobile UI (Flutter belum ada!)

**Tasks:**
1. **Backend:**
   - [ ] Create NotificationService
   - [ ] Add routes: GET `/api/notifications`, PUT `/api/notifications/{id}/read`
   - [ ] Implement notification triggers (order status, resep validated, payment confirmed)
   - [ ] Optional: Setup WebSocket atau FCM

2. **Web & Mobile:**
   - [ ] Notification bell with badge
   - [ ] Notification list page
   - [ ] Mark as read functionality

---

### FASE 9: DASHBOARD & REPORTS ❌ NOT STARTED
**Status:** Placeholders exist, data belum  
**Progress:** ~10%

**What EXISTS:**
- ✅ Dashboard pages (placeholder)

**What's MISSING:**
- ❌ Dashboard API endpoints
- ❌ Real data aggregation
- ❌ Charts implementation
- ❌ Laporan generation (PDF, Excel)
- ❌ All statistics calculations

**Tasks:**
1. **Backend:**
   - [ ] Create DashboardController: statsStaf, statsAdmin
   - [ ] Create LaporanController: pergerakanStok (PDF, Excel export)
   - [ ] Implement aggregation queries (sum, count, group by)

2. **Web React:**
   - [ ] Update Dashboard Staf with real data & charts
   - [ ] Update Dashboard Admin with real data & charts
   - [ ] Create `Laporan.jsx` page (filter tanggal, export buttons)

---

### FASE 10: MOBILE FLUTTER 🚫 BLOCKED
**Status:** **NOT STARTED** — folder tidak ada  
**Progress:** 0%

**FAKTA:** Repository TIDAK memiliki folder `Mobile/`. Semua claim "Flutter sudah ada" adalah salah.

**Tasks:**
1. **Setup:**
   - [ ] Create Flutter project structure
   - [ ] Setup dependencies (http, provider, flutter_secure_storage)
   - [ ] Configure API base URL

2. **Screens:**
   - [ ] Login & Register
   - [ ] Home (kategori, rekomendasi)
   - [ ] Catalog & Product Detail
   - [ ] Cart & Checkout
   - [ ] Upload Resep
   - [ ] Orders & Order Detail
   - [ ] Payment (Midtrans Snap)
   - [ ] AI Assistant
   - [ ] Profile & Settings
   - [ ] Notifications

---

## PEKERJAAN PRIORITAS (Next Sprint)

### IMMEDIATE (Critical Fixes)

1. **Fix OrderService Status** ⚠️
   - Hapus penggunaan status `'pending'` yang tidak ada di migration
   - Gunakan hanya: `diproses`, `siap_diambil`, `selesai`, `dibatalkan`

2. **Fix API Authorization** ⚠️
   - Change `orders/{id}/status` from `role:admin` to `role:staf`
   - Change `resep/{id}/validate` from `role:admin` to `role:staf`

3. **Migration: Orders Schema** ⚠️
   - Make `user_id` NULLABLE (support POS walk-in)
   - Add `created_by` column (staf yang buat order via POS)
   - Add `order_source` enum('mobile', 'pos') default 'mobile'
   - Change `onDelete('cascade')` to `onDelete('restrict')` or `set null`

### SHORT-TERM (Next 2 Weeks)

4. **Complete Catalog API**
   - Implement full CRUD endpoints
   - Create ObatService & KategoriController
   - Add search & filter logic
   - **JANGAN gunakan SoftDeletes** — gunakan `is_active`

5. **Build Web Pages (Staf)**
   - CRUD Obat
   - Kelola Kategori
   - Pesanan Online
   - Validasi Resep

6. **Build Web Page (Admin)**
   - Data Obat READ-ONLY (no add/edit/delete)

### MID-TERM (Next 1-2 Months)

7. **Stock & Batch Management**
8. **POS Kasir Implementation**
9. **Payment Integration (Midtrans)**
10. **Start Flutter Project**

### LONG-TERM (3-6 Months)

11. **AI Assistant & Recommendations**
12. **Notifications System**
13. **Dashboard & Reports dengan Real Data**
14. **Complete Flutter Mobile App**
15. **Production Deployment**

---

## DEPENDENCIES & BLOCKERS

### External Dependencies
- ⚠️ **Gemini API access** — needed for AI features (Fase 7)
- ⚠️ **Midtrans Sandbox account** — needed for Payment (Fase 6)
- ⚠️ **Flutter development** — needed for ALL mobile features

### Technical Blockers
- 🚫 **Mobile development blocked** — folder Mobile/ belum ada, tidak bisa test end-to-end flow
- ⚠️ **Order flow incomplete** — migration belum support POS walk-in
- ⚠️ **Authorization inconsistent** — beberapa route masih `role:admin` yang seharusnya `role:staf`

---

## REALISTIC TIMELINE

Berdasarkan velocity saat ini dan fakta implementasi:

```
November 2026       ██░░░░░░░░  Fix critical issues (OrderService, migration, routes)
Desember 2026       ████░░░░░░  Complete Catalog API & Web pages
Januari 2027        ████░░░░░░  Stock Management & POS Kasir
Februari 2027       ████░░░░░░  Payment Integration & Start Flutter
Maret 2027          ████░░░░░░  Flutter Development & Basic Features
April 2027          ████░░░░░░  AI Features & Notifications
Mei 2027            ████░░░░░░  Dashboard & Reports
Juni 2027           ████░░░░░░  Complete Flutter & Testing
Juli 2027           ████░░░░░░  Production Deployment
```

**Realistic Completion:** Juli-Agustus 2027 (8-9 bulan dari sekarang)

---

## PRINSIP ROADMAP INI

1. **Reality-based** — Setiap status diverifikasi dari source code aktual
2. **Honest** — Tidak ada wishful thinking atau planning tanpa bukti
3. **Actionable** — Tasks jelas dan dapat dikerjakan
4. **Maintainable** — Update sesuai progress nyata, bukan checkbox statis
5. **Evidence-driven** — "Done" hanya jika code exists dan working

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oktober 2026 | Initial planning (tidak realistis) |
| 2.0 | 22 November 2026 (pagi) | Restructure tanpa audit kode (masih banyak asumsi salah) |
| **3.0** | **22 November 2026 (sore)** | **CORRECTED:** Audit source code mendalam, status berdasarkan fakta, Flutter status diperbaiki, OrderService issues dicatat, Authorization inconsistencies documented |

---

**Catatan:** Roadmap ini adalah living document. Update setiap kali ada milestone selesai atau discovery baru dari audit kode.
