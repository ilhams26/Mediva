# TASK BRIEFING - Mediva Smart Medicine Platform
## Easy-to-Understand Task Breakdown (Fase 3-8)
### 3-Person Team: Ilham (35%), Aisiti (45%), Tsabita (20%)

---

## OVERVIEW
This document breaks down ALL tasks for Fase 3-8 into individual, actionable items. Each task has:
- **Task ID** (e.g., 3.1.1.1 = Fase 3, Section 1, Subsection 1, Item 1)
- **Owner** (Aisiti, Ilham, Tsabita)
- **Checkbox** to mark complete
- **Description** of what to do

**Legend:**
- 🔵 Aisiti tasks (45% = Main developer)
- 🟡 Ilham tasks (35% = Lead/supervision)
- 🟢 Tsabita tasks (20% = Support/testing)

---

# FASE 3: STOCK & INVENTORY (Weeks 5-7)

## 🔵 AISITI'S SECTION (Stock Backend API + Frontend - 60%)

### Backend: Stock API Design & Endpoints
- [ ] 3.1.1 - Create Stock API specification document (endpoint list, request/response schemas)
- [ ] 3.1.2 - Create GET /api/stock endpoint (list all stock with filters by kategori, ketersediaan)
- [ ] 3.1.3 - Create GET /api/stock/:id endpoint (retrieve single stock detail)
- [ ] 3.1.4 - Create POST /api/stock endpoint (admin only, create new stock entry)
- [ ] 3.1.5 - Create PUT /api/stock/:id endpoint (admin only, update stock info & quantity)
- [ ] 3.1.6 - Create DELETE /api/stock/:id endpoint (soft delete stock entry)
- [ ] 3.1.7 - Create POST /api/stock/:id/adjust endpoint (manual adjustment with reason logging)
- [ ] 3.1.8 - Add input validation to all endpoints (required fields, data types, ranges)
- [ ] 3.1.9 - Add role-based protection (admin only for create/update/delete)
- [ ] 3.1.10 - Write unit tests for all 7 endpoints (test success & error cases)

### Backend: Stock Model & Database
- [ ] 3.2.1 - Create Stock migration (fields: id, obat_id, quantity, lokasi, reorder_level, last_checked_at, created_at, updated_at)
- [ ] 3.2.2 - Create PergerakanStok migration (audit trail: id, stock_id, tipe, quantity_before, quantity_after, reason, user_id, created_at)
- [ ] 3.2.3 - Add database indexes (stock: obat_id, kategori; pergerakan_stok: stock_id, created_at)
- [ ] 3.2.4 - Create Stock model with relationships (belongsTo Obat, hasMany PergerakanStok)
- [ ] 3.2.5 - Create PergerakanStok model with relationships (belongsTo Stock, belongsTo User)
- [ ] 3.2.6 - Create stock seeder (50+ medicines with realistic qty: 100-500, reorder_level: 50)
- [ ] 3.2.7 - Run migrations & seeders, verify 50+ rows in stock & pergerakan_stok tables

### Backend: Stock Business Logic
- [ ] 3.3.1 - Implement lowStockAlert() method (trigger when qty <= reorder_level)
- [ ] 3.3.2 - Implement stockReservation() method (deduct qty for pending orders, refund if cancelled)
- [ ] 3.3.3 - Implement logMovement() method (auto-log all stock changes to PergerakanStok)
- [ ] 3.3.4 - Implement validateStockAvailable() method (check qty before order confirmation)
- [ ] 3.3.5 - Implement getStockStatus() method (return OK/LOW/OUT_OF_STOCK based on qty)
- [ ] 3.3.6 - Write unit tests for all business logic methods (>85% coverage)
- [ ] 3.3.7 - Test edge cases (qty=0, negative qty, reorder_level=0)

### Backend: Stock Notifications
- [ ] 3.4.1 - Create StockNotificationService class
- [ ] 3.4.2 - Create email template: "Low Stock Alert" (obat name, qty, reorder level)
- [ ] 3.4.3 - Implement sendLowStockAlert() method (send email to admin when qty <= reorder_level)
- [ ] 3.4.4 - Implement queue job for async email sending (don't block API response)
- [ ] 3.4.5 - Test low-stock alert in dev (manually adjust stock, check email)

### Frontend: Stock Dashboard Page
- [ ] 3.5.1 - Create /pages/admin/stock page (admin-only route, protected by role middleware)
- [ ] 3.5.2 - Create stock list display (table with columns: Obat, Qty, Reorder Level, Lokasi, Status)
- [ ] 3.5.3 - Add filter sidebar (select kategori, status: OK/LOW/OUT, lokasi)
- [ ] 3.5.4 - Add search bar (search by obat name or kode)
- [ ] 3.5.5 - Implement pagination (10/25/50 items per page)
- [ ] 3.5.6 - Add "Create Stock" button (opens modal)
- [ ] 3.5.7 - Add real-time updates (fetch stock every 30sec or use WebSocket)
- [ ] 3.5.8 - Style page to match existing design system (colors, spacing, typography)

### Frontend: Stock Components
- [ ] 3.6.1 - Create StockCard component (compact display: obat name, qty, status badge)
- [ ] 3.6.2 - Create StockForm component (modal: obat selector, qty input, lokasi select, reorder_level)
- [ ] 3.6.3 - Create StockAdjustmentForm component (modal: qty change field, reason textarea, submit button)
- [ ] 3.6.4 - Create LowStockAlert component (banner warning: "N items below reorder level")
- [ ] 3.6.5 - Add form validation (required fields, min qty, max qty limits)
- [ ] 3.6.6 - Add error & success toast notifications
- [ ] 3.6.7 - Test all components (UI rendering, form submission, error handling)

### Frontend: Stock Analytics
- [ ] 3.7.1 - Create stock analytics card (total inventory value = SUM(qty × harga))
- [ ] 3.7.2 - Create movement chart (last 30 days: in/out movements as bar chart)
- [ ] 3.7.3 - Create alert summary card (X items low stock, Y items out of stock)
- [ ] 3.7.4 - Display movement history table (last 20 movements: date, type, qty change, reason)

---

## 🟡 ILHAM'S SECTION (Supervision + Architecture - 20%)

### Supervision & Code Review
- [ ] 3.8.1 - Review Stock API spec with Aisiti (before coding starts)
- [ ] 3.8.2 - Review database schema (check relationships, indexes, constraints)
- [ ] 3.8.3 - Code review: Stock endpoints (logic, validation, error handling)
- [ ] 3.8.4 - Code review: Frontend dashboard (component structure, reusability)
- [ ] 3.8.5 - Pair-program with Aisiti if blocked (e.g., complex validation rules)

### Architecture & Design
- [ ] 3.8.6 - Design stock notification flow (alert trigger → email → admin inbox)
- [ ] 3.8.7 - Define email template content & styling
- [ ] 3.8.8 - Plan stock reservation logic (how to prevent double-selling)

---

## 🟢 TSABITA'S SECTION (Testing + Documentation - 20%)

### Testing & QA
- [ ] 3.9.1 - Write unit tests for StockService CRUD methods (create, read, update, delete)
- [ ] 3.9.2 - Write unit tests for validation logic (validateStockAvailable, getStockStatus)
- [ ] 3.9.3 - Write integration tests for Stock API endpoints (test all 7 endpoints with real DB)
- [ ] 3.9.4 - Create test fixtures (50 medicines, various stock levels: OK, LOW, OUT)
- [ ] 3.9.5 - Run full test suite, check coverage >90%
- [ ] 3.9.6 - Manual testing checklist:
  - [ ] Create stock entry (POST /api/stock)
  - [ ] List stock with filters (GET /api/stock?kategori=...&status=OK)
  - [ ] Update stock qty (PUT /api/stock/:id)
  - [ ] Adjust stock with reason (POST /api/stock/:id/adjust)
  - [ ] Delete stock (soft delete, verify it_hidden = true)
  - [ ] Test low-stock alert trigger (set qty <= reorder_level, check alert)

### Documentation
- [ ] 3.10.1 - Create Postman collection for Stock API (all 7 endpoints with examples)
- [ ] 3.10.2 - Write API usage guide (markdown: endpoint descriptions, request/response examples)
- [ ] 3.10.3 - Document stock statuses (OK, LOW, OUT_OF_STOCK definitions)
- [ ] 3.10.4 - Create deployment checklist for Fase 3 (what to verify before going live)
- [ ] 3.10.5 - Update team wiki/docs with stock system overview

---

# FASE 4: PRODUCT CATALOG & RECOMMENDATIONS (Weeks 8-10)

## 🔵 AISITI'S SECTION (Catalog Backend API + Frontend - 100% focus)

### Backend: Catalog API Design & Endpoints
- [ ] 4.1.1 - Create Product Catalog API spec (8 endpoints: list, detail, search, related, create, update, delete, categories)
- [ ] 4.1.2 - Create GET /api/products endpoint (list with pagination, filtering, sorting)
- [ ] 4.1.3 - Create GET /api/products/:id endpoint (detail with stock status, related products, ratings)
- [ ] 4.1.4 - Create GET /api/products/search endpoint (full-text search by name, deskripsi, kode)
- [ ] 4.1.5 - Create GET /api/products/:id/related endpoint (related products: same kategori, similar)
- [ ] 4.1.6 - Create POST /api/products endpoint (admin only, create product)
- [ ] 4.1.7 - Create PUT /api/products/:id endpoint (admin only, update product)
- [ ] 4.1.8 - Create DELETE /api/products/:id endpoint (soft delete)
- [ ] 4.1.9 - Create GET /api/categories endpoint (list categories with product counts)
- [ ] 4.1.10 - Add pagination (limit, offset/page), filtering (kategori, harga min/max, ketersediaan), sorting (relevance, newest, harga, rating)

### Backend: Product Search & Embedding
- [ ] 4.2.1 - Setup product vector embedding (using Fonté AI or similar)
- [ ] 4.2.2 - Create ObatEmbedding model & migration (obat_id, embedding_vector, created_at)
- [ ] 4.2.3 - Implement semantic search (find products by similarity using embeddings)
- [ ] 4.2.4 - Add full-text search index (MySQL FULLTEXT on obat.nama, obat.deskripsi)
- [ ] 4.2.5 - Implement search caching (cache popular search queries, 1 hour TTL)
- [ ] 4.2.6 - Benchmark search performance (target <200ms response time for 10k products)

### Backend: Product Filtering & Sorting
- [ ] 4.3.1 - Implement kategori filter (dynamic list from DB)
- [ ] 4.3.2 - Implement harga filter (min/max price range)
- [ ] 4.3.3 - Implement ketersediaan filter (in-stock only toggle)
- [ ] 4.3.4 - Implement rating filter (products with rating >= X stars)
- [ ] 4.3.5 - Implement sorting: relevance, newest, harga ASC/DESC, rating, most-sold
- [ ] 4.3.6 - Test all filter combinations work correctly (100+ filter combinations)

### Backend: AI Recommendations
- [ ] 4.4.1 - Integrate Fonté AI for product recommendations
- [ ] 4.4.2 - Implement "users who bought X also viewed Y" logic (based on OrderItems)
- [ ] 4.4.3 - Implement "trending products" (most viewed/purchased last 7 days)
- [ ] 4.4.4 - Cache recommendations (update once per day at 2 AM)
- [ ] 4.4.5 - Create GET /api/products/:id/recommendations endpoint (return 5 recommended products)

### Frontend: Catalog Pages
- [ ] 4.5.1 - Create /pages/catalog page (main product listing)
- [ ] 4.5.2 - Create /pages/products/:id page (product detail page)
- [ ] 4.5.3 - Create /pages/search page (search results page)
- [ ] 4.5.4 - Create /pages/category/:id page (products filtered by category)

### Frontend: Catalog Components
- [ ] 4.6.1 - Create ProductCard component (grid view: image, name, harga, rating, stock status)
- [ ] 4.6.2 - Create ProductDetail component (large image gallery, full description, reviews section, stock badge)
- [ ] 4.6.3 - Create FilterSidebar component (kategori checkboxes, harga range slider, ketersediaan toggle)
- [ ] 4.6.4 - Create SortDropdown component (select: relevance, newest, harga, rating, popular)
- [ ] 4.6.5 - Create SearchBar component (input with autocomplete suggestions)
- [ ] 4.6.6 - Create RecommendationCarousel component (horizontal carousel: "You might like", showing AI recommendations)
- [ ] 4.6.7 - Create RatingStars component (display ⭐ rating and review count)
- [ ] 4.6.8 - Create AddToCart button component (with quantity selector)

### Frontend: Search & Filter UX
- [ ] 4.7.1 - Implement real-time filter updates (update URL query params, auto-fetch on filter change)
- [ ] 4.7.2 - Add search suggestions with autocomplete
- [ ] 4.7.3 - Show filter counts (e.g., "23 products" after each filter)
- [ ] 4.7.4 - Add "Clear all filters" button
- [ ] 4.7.5 - Implement wishlist/favorite button (save to favorites, show on product page)
- [ ] 4.7.6 - Add "Sort by" dropdown on catalog page

### Frontend: Performance Optimization
- [ ] 4.8.1 - Lazy load product images (load only visible images)
- [ ] 4.8.2 - Implement pagination or infinite scroll (load 20 products at a time)
- [ ] 4.8.3 - Debounce search input (wait 500ms after user stops typing before fetching)
- [ ] 4.8.4 - Cache catalog data locally (localStorage, 5 min TTL)
- [ ] 4.8.5 - Optimize bundle size (code splitting by route)
- [ ] 4.8.6 - Run Lighthouse audit on catalog pages (target >90 score)

---

## 🟡 ILHAM'S SECTION (Supervision - 15%)
- [ ] 4.9.1 - Review Catalog API spec & architecture
- [ ] 4.9.2 - Review search & embedding implementation
- [ ] 4.9.3 - Code review: Frontend catalog pages & components
- [ ] 4.9.4 - Pair-program if Aisiti blocked on complex features

---

## 🟢 TSABITA'S SECTION (Testing + Documentation + Data - 20%)

### Testing & QA
- [ ] 4.10.1 - Create product test data (200+ medicines, diverse categories, price ranges)
- [ ] 4.10.2 - Write unit tests for Catalog service (search, filter, recommendation logic)
- [ ] 4.10.3 - Write integration tests for Product API endpoints
- [ ] 4.10.4 - Test all filter combinations (kategori + harga + ketersediaan)
- [ ] 4.10.5 - Test search performance (should return 10 results in <200ms)
- [ ] 4.10.6 - Performance load test (100 concurrent catalog requests)

### Documentation & Data Setup
- [ ] 4.11.1 - Create product seeder (200+ realistic medicines with names, descriptions, prices, images)
- [ ] 4.11.2 - Create Postman collection for Catalog API
- [ ] 4.11.3 - Document filtering & search API usage
- [ ] 4.11.4 - Create performance optimization guide

---

# FASE 5: SHOPPING CART & CHECKOUT (Weeks 11-12)

## 🔵 AISITI'S SECTION (Cart Backend API + Checkout Frontend - 100% focus)

### Backend: Cart API & Database
- [ ] 5.1.1 - Create Cart model & migration (user_id, items JSON, created_at, updated_at)
- [ ] 5.1.2 - Create POST /api/cart endpoint (add item to cart)
- [ ] 5.1.3 - Create GET /api/cart endpoint (get current user's cart)
- [ ] 5.1.4 - Create PUT /api/cart/:itemId endpoint (update item quantity)
- [ ] 5.1.5 - Create DELETE /api/cart/:itemId endpoint (remove item)
- [ ] 5.1.6 - Create DELETE /api/cart endpoint (clear entire cart)
- [ ] 5.1.7 - Create POST /api/cart/checkout endpoint (create order from cart)

### Backend: Order API & Database
- [ ] 5.2.1 - Create Order model & migration (user_id, total_harga, status, order_number, created_at, updated_at)
- [ ] 5.2.2 - Create OrderItem model & migration (order_id, obat_id, quantity, harga_satuan)
- [ ] 5.2.3 - Create POST /api/orders endpoint (create order)
- [ ] 5.2.4 - Create GET /api/orders endpoint (list user's orders with pagination)
- [ ] 5.2.5 - Create GET /api/orders/:id endpoint (order detail: items, status, timeline)
- [ ] 5.2.6 - Create PUT /api/orders/:id/status endpoint (admin only, update order status)
- [ ] 5.2.7 - Create GET /api/orders/:id/invoice endpoint (generate/download invoice PDF)

### Backend: Order Business Logic
- [ ] 5.3.1 - Implement stock validation (check qty available before order confirmation)
- [ ] 5.3.2 - Implement order total calculation (sum of items + shipping + taxes - discounts)
- [ ] 5.3.3 - Implement order number generation (unique, formatted: ORD-202601-0001)
- [ ] 5.3.4 - Implement order status tracking (pending → confirmed → processing → shipped → delivered)
- [ ] 5.3.5 - Implement order audit trail (log status changes: who, when, why)
- [ ] 5.3.6 - Implement order cancellation (only if not shipped, refund stock)
- [ ] 5.3.7 - Create order confirmation email template

### Backend: Cart Validation
- [ ] 5.4.1 - Validate stock availability for all items before checkout
- [ ] 5.4.2 - Validate item prices (prevent frontend tampering - verify against DB prices)
- [ ] 5.4.3 - Validate user permissions (e.g., restricted products for non-doctors)
- [ ] 5.4.4 - Validate quantities (min 1, max based on stock & reorder limits)
- [ ] 5.4.5 - Check for expired items in cart (if applicable)

### Frontend: Cart Pages
- [ ] 5.5.1 - Create /pages/cart page (list items in shopping cart)
- [ ] 5.5.2 - Create /pages/checkout page (multi-step checkout flow)

### Frontend: Cart Components
- [ ] 5.6.1 - Create CartItem component (obat image, name, price, qty selector, remove button, item total)
- [ ] 5.6.2 - Create CartSummary component (subtotal, shipping cost, taxes, discount, total)
- [ ] 5.6.3 - Create QuantitySelector component (- button, input field, + button)
- [ ] 5.6.4 - Create ShippingForm component (address, city, postal code, shipping method select)
- [ ] 5.6.5 - Create PaymentMethodSelector component (select Midtrans, bank transfer, COD, etc.)
- [ ] 5.6.6 - Create OrderConfirmation component (show order number, email confirmation message)

### Frontend: Cart UX
- [ ] 5.7.1 - Add "Add to Cart" button on product page (with quantity selector dropdown)
- [ ] 5.7.2 - Add cart badge in header (show item count)
- [ ] 5.7.3 - Implement cart persistence (localStorage + backend sync)
- [ ] 5.7.4 - Add "Continue Shopping" link in cart
- [ ] 5.7.5 - Implement "Apply Coupon" input field (prepare for future coupon feature)
- [ ] 5.7.6 - Add "Estimate Shipping" feature (calculate cost based on items)

### Frontend: Checkout Flow
- [ ] 5.8.1 - Create multi-step checkout (Step 1: Review items → Step 2: Shipping → Step 3: Payment → Step 4: Confirmation)
- [ ] 5.8.2 - Show order summary on every step
- [ ] 5.8.3 - Calculate totals in real-time (include shipping & taxes)
- [ ] 5.8.4 - Implement form validation & error messages
- [ ] 5.8.5 - Create success page (show order number, tracking link, next steps)
- [ ] 5.8.6 - Test checkout on mobile (responsive, touch-friendly)

---

## 🟡 ILHAM'S SECTION (Supervision - 15%)
- [ ] 5.9.1 - Review Cart & Order API design
- [ ] 5.9.2 - Review order total calculation logic
- [ ] 5.9.3 - Code review: Frontend checkout flow
- [ ] 5.9.4 - Pair-program if blocked

---

## 🟢 TSABITA'S SECTION (Testing + Documentation - 20%)

### Testing & QA
- [ ] 5.10.1 - Write unit tests for Cart service (add, update, remove, clear)
- [ ] 5.10.2 - Write unit tests for Order model & service
- [ ] 5.10.3 - Write integration tests for Cart & Order API endpoints
- [ ] 5.10.4 - Create test scenarios (add to cart → update qty → remove item → checkout)
- [ ] 5.10.5 - Test checkout flow end-to-end:
  - [ ] Add products to cart
  - [ ] Proceed to checkout
  - [ ] Enter shipping info
  - [ ] Confirm payment method
  - [ ] Place order
  - [ ] Verify order created in database with correct items & total

### Documentation
- [ ] 5.11.1 - Create Postman collection for Cart & Order API
- [ ] 5.11.2 - Document checkout flow (customer journey diagram)
- [ ] 5.11.3 - Write API usage guide for cart/order endpoints

---

# FASE 6: PAYMENTS & PRESCRIPTIONS (Weeks 13-15)

## 🔵 AISITI'S SECTION (Payment Backend + Prescription API & Frontend - 50%)

### Backend: Midtrans Payment Integration
- [ ] 6.1.1 - Setup Midtrans account & get API credentials (server key, client key)
- [ ] 6.1.2 - Add Midtrans config to .env.* (MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_MODE: sandbox/production)
- [ ] 6.1.3 - Create Payment model & migration (order_id, transaction_id, amount, status, created_at)
- [ ] 6.1.4 - Create POST /api/orders/:id/pay endpoint (generate Midtrans snap token)
- [ ] 6.1.5 - Create payment webhook route (handle Midtrans callbacks: success, failure, pending)
- [ ] 6.1.6 - Implement payment verification logic (verify Midtrans signature on webhook)
- [ ] 6.1.7 - Implement payment status update (update order status based on payment result)
- [ ] 6.1.8 - Implement payment retry logic (allow retry if payment failed)
- [ ] 6.1.9 - Create GET /api/orders/:id/payment-status endpoint (check payment status)
- [ ] 6.1.10 - Create payment transaction log (store all payment attempts, success/failure)

### Backend: Payment Processing Logic
- [ ] 6.2.1 - Implement generateSnapToken() method (call Midtrans API to create transaction)
- [ ] 6.2.2 - Implement verifyPaymentSignature() method (validate webhook data)
- [ ] 6.2.3 - Implement handlePaymentSuccess() method (mark order as paid, update stock)
- [ ] 6.2.4 - Implement handlePaymentFailure() method (mark order as failed, free reserved stock)
- [ ] 6.2.5 - Create payment confirmation email template
- [ ] 6.2.6 - Implement refund handling (if order cancelled after payment)
- [ ] 6.2.7 - Add payment audit trail (log all payment transactions)

### Backend: Prescription API
- [ ] 6.3.1 - Create Resep model & migration (user_id, doctor_id, date_created, expiry_date, status, notes)
- [ ] 6.3.2 - Create ResepItem model & migration (resep_id, obat_id, quantity, dosage, frequency, duration)
- [ ] 6.3.3 - Create GET /api/prescriptions endpoint (list user's prescriptions)
- [ ] 6.3.4 - Create GET /api/prescriptions/:id endpoint (prescription detail with items)
- [ ] 6.3.5 - Create POST /api/prescriptions endpoint (doctor only, create new prescription)
- [ ] 6.3.6 - Create PUT /api/prescriptions/:id endpoint (doctor only, update prescription)
- [ ] 6.3.7 - Create DELETE /api/prescriptions/:id endpoint (soft delete)
- [ ] 6.3.8 - Create POST /api/prescriptions/:id/validate endpoint (pharmacist validates)
- [ ] 6.3.9 - Create GET /api/prescriptions/:id/items endpoint (get prescribed medicines)

### Backend: Prescription Validation & Logic
- [ ] 6.4.1 - Implement prescription validation rules (check dosage limits, drug interactions)
- [ ] 6.4.2 - Implement prescription expiry logic (mark as expired after date)
- [ ] 6.4.3 - Implement prescription number generation (unique, formatted: RES-202601-0001)
- [ ] 6.4.4 - Implement doctor workflow (doctor can view patient profiles, create prescriptions)
- [ ] 6.4.5 - Implement pharmacist workflow (pharmacist can validate prescriptions)
- [ ] 6.4.6 - Create prescription-to-order conversion (patient can buy medicines from prescription)

### Frontend: Payment Pages
- [ ] 6.5.1 - Create /pages/checkout/payment page (Midtrans Snap widget container)
- [ ] 6.5.2 - Create /pages/order-confirmation page (show order #, payment status, next steps)

### Frontend: Payment Components
- [ ] 6.6.1 - Create PaymentForm component (integrate Midtrans Snap modal)
- [ ] 6.6.2 - Create PaymentStatus component (display pending/success/failed states)
- [ ] 6.6.3 - Create PaymentHistory component (list past transactions/payments)
- [ ] 6.6.4 - Create InvoiceViewer component (view & download invoice as PDF)

### Frontend: Prescription Pages (Doctor View)
- [ ] 6.7.1 - Create /pages/doctor/prescriptions page (list all prescriptions)
- [ ] 6.7.2 - Create /pages/doctor/prescriptions/new page (create new prescription)
- [ ] 6.7.3 - Create /pages/doctor/prescriptions/:id page (view/edit prescription)

### Frontend: Prescription Pages (Patient View)
- [ ] 6.8.1 - Create /pages/my-prescriptions page (list user's prescriptions)
- [ ] 6.8.2 - Create /pages/prescriptions/:id page (view prescription, buy medicines)

### Frontend: Prescription Components
- [ ] 6.9.1 - Create PrescriptionForm component (select medicines, add dosage/frequency)
- [ ] 6.9.2 - Create PrescriptionItem component (display: medicine name, dosage, frequency, quantity)
- [ ] 6.9.3 - Create PrescriptionUpload component (upload image/PDF of existing prescription)
- [ ] 6.9.4 - Create DoctorSelector component (search & select doctor)
- [ ] 6.9.5 - Create PatientSelector component (for doctor to select patient)

### Frontend: Prescription UX
- [ ] 6.10.1 - Add "Buy from Prescription" button on prescription view
- [ ] 6.10.2 - Auto-fill cart from prescription (medicines + dosage × quantity)
- [ ] 6.10.3 - Show prescription expiry status (expired/valid)
- [ ] 6.10.4 - Display doctor's name & contact on prescription detail

---

## 🟡 ILHAM'S SECTION (Payment & Prescription Architecture - 50%)

### Backend: Payment Architecture & Security
- [ ] 6.11.1 - Design payment processing flow (order → payment → verification → success/failure)
- [ ] 6.11.2 - Review Midtrans integration security (API keys, signature verification)
- [ ] 6.11.3 - Design refund flow (when to refund stock, email customer)
- [ ] 6.11.4 - Code review: Payment endpoints & webhook handler
- [ ] 6.11.5 - Code review: Prescription API & validation logic

### Backend: Prescription Workflow Design
- [ ] 6.12.1 - Design prescription approval workflow (doctor creates → patient views → patient orders → pharmacist validates)
- [ ] 6.12.2 - Define prescription validation rules (dosage limits per medicine)
- [ ] 6.12.3 - Design doctor-patient connection (how doctor finds patient, views patient profile)

### DevOps: Payment Setup
- [ ] 6.13.1 - Setup Midtrans sandbox environment for testing
- [ ] 6.13.2 - Configure production Midtrans credentials (after testing phase)
- [ ] 6.13.3 - Setup payment webhook URL in Midtrans dashboard

---

## 🟢 TSABITA'S SECTION (Payment & Prescription Testing - 20%)

### Payment Testing
- [ ] 6.14.1 - Setup Midtrans sandbox account for testing
- [ ] 6.14.2 - Create payment test scenarios:
  - [ ] Successful payment (simulate approval in Snap)
  - [ ] Failed payment (simulate rejection)
  - [ ] Pending payment (customer closes browser mid-transaction)
  - [ ] Webhook timeout (retry webhook delivery)
- [ ] 6.14.3 - Test payment webhook handling (verify signature, update order status)
- [ ] 6.14.4 - Test refund flow (cancel order → refund payment → refund stock)
- [ ] 6.14.5 - Write unit tests for Payment service

### Prescription Testing
- [ ] 6.15.1 - Write unit tests for Prescription model & service
- [ ] 6.15.2 - Test prescription validation rules (dosage limits, drug interactions)
- [ ] 6.15.3 - Test prescription-to-order conversion
- [ ] 6.15.4 - Manual testing: Doctor creates prescription → Patient views → Patient orders → Pharmacist validates

### Documentation
- [ ] 6.16.1 - Document Payment API endpoints & Midtrans integration
- [ ] 6.16.2 - Create Midtrans configuration guide (setup for production)
- [ ] 6.16.3 - Document Prescription API endpoints
- [ ] 6.16.4 - Document payment webhook URL & signature verification
- [ ] 6.16.5 - Create deployment checklist (payment secrets, Midtrans setup)

---

# FASE 7: NOTIFICATIONS & MESSAGING (Weeks 16-17)

## 🔵 AISITI'S SECTION (Frontend Notifications - 20%)

### Frontend: Notification Components
- [ ] 7.1.1 - Create NotificationCenter component (dropdown in header, list unread notifications)
- [ ] 7.1.2 - Create NotificationItem component (type icon, title, message, timestamp, delete button)
- [ ] 7.1.3 - Create NotificationBell component (bell icon, badge with unread count)
- [ ] 7.1.4 - Create NotificationToast component (auto-dismiss popup for new notifications)

### Frontend: Notification Pages
- [ ] 7.2.1 - Create /pages/notifications page (full notification history)
- [ ] 7.2.2 - Add notification filters (by type: orders, payments, prescriptions, etc.)
- [ ] 7.2.3 - Add notification search (search by keywords)

### Frontend: Real-time Notifications
- [ ] 7.3.1 - Setup WebSocket connection on app load (connect to backend)
- [ ] 7.3.2 - Listen for new notification events (show toast when notification arrives)
- [ ] 7.3.3 - Auto-refresh notification badge (update unread count)
- [ ] 7.3.4 - Implement notification sound alert (optional, user can disable)

### Frontend: Notification Preferences
- [ ] 7.4.1 - Create /pages/settings/notifications page
- [ ] 7.4.2 - Add toggle: Email notifications by type (orders, payments, prescriptions)
- [ ] 7.4.3 - Add toggle: In-app notifications
- [ ] 7.4.4 - Add toggle: Notification sounds
- [ ] 7.4.5 - Save preferences to backend (API: PUT /api/user/notification-preferences)

---

## 🟡 ILHAM'S SECTION (Backend Notifications - 60%)

### Backend: Notification System Architecture
- [ ] 7.5.1 - Create Notifikasi model & migration (user_id, type, title, message, data JSON, read_at)
- [ ] 7.5.2 - Design notification types (order_created, payment_received, shipment_update, prescription_approved, low_stock_alert)
- [ ] 7.5.3 - Setup Laravel Broadcasting (config/broadcasting.php for WebSocket or Pusher)
- [ ] 7.5.4 - Create notification channels: In-app, Email, SMS (optional)

### Backend: In-App Notifications API
- [ ] 7.6.1 - Create GET /api/notifications endpoint (list unread notifications)
- [ ] 7.6.2 - Create GET /api/notifications/all endpoint (list all notifications with pagination)
- [ ] 7.6.3 - Create PUT /api/notifications/:id/read endpoint (mark single as read)
- [ ] 7.6.4 - Create PUT /api/notifications/read-all endpoint (mark all as read)
- [ ] 7.6.5 - Create DELETE /api/notifications/:id endpoint (delete notification)
- [ ] 7.6.6 - Create WebSocket event for new notifications (real-time push to connected clients)

### Backend: Email Notifications
- [ ] 7.7.1 - Setup email provider (SMTP, SendGrid, or AWS SES)
- [ ] 7.7.2 - Create email template: Order Confirmation (order #, items, total, estimated delivery)
- [ ] 7.7.3 - Create email template: Payment Receipt (transaction ID, amount, date)
- [ ] 7.7.4 - Create email template: Shipment Tracking (tracking number, estimated date)
- [ ] 7.7.5 - Create email template: Low Stock Alert (medicine name, qty, reorder level)
- [ ] 7.7.6 - Implement notification queue (async job: send emails without blocking API)
- [ ] 7.7.7 - Create email log table (track all sent emails for debugging)

### Backend: Notification Triggers
- [ ] 7.8.1 - Trigger on order confirmation (send order confirmation email & in-app notification)
- [ ] 7.8.2 - Trigger on order status change (processing → shipped → delivered, send email)
- [ ] 7.8.3 - Trigger on payment confirmation (send payment receipt email)
- [ ] 7.8.4 - Trigger on prescription approval (send notification to patient)
- [ ] 7.8.5 - Trigger on low stock alert (send email to admin, in-app notification)

### Backend: Admin Notifications
- [ ] 7.9.1 - Notify admin on new order (in-app notification, dashboard badge)
- [ ] 7.9.2 - Notify admin on payment received
- [ ] 7.9.3 - Notify admin on low stock alert
- [ ] 7.9.4 - Notify admin on prescription awaiting validation

---

## 🟢 TSABITA'S SECTION (Notification Testing & Setup - 20%)

### Email Provider Setup
- [ ] 7.10.1 - Setup email provider (SMTP credentials, API keys)
- [ ] 7.10.2 - Test email sending (send test email to verify configuration)
- [ ] 7.10.3 - Setup email template variables ({{order_number}}, {{total}}, etc.)

### Testing & QA
- [ ] 7.11.1 - Write unit tests for Notification service (create, read, mark as read, delete)
- [ ] 7.11.2 - Test notification triggers (manually place order, check email & in-app notifications)
- [ ] 7.11.3 - Create notification seed data (dummy notifications for testing)
- [ ] 7.11.4 - Test WebSocket real-time notifications (send notification, verify it appears in-app)
- [ ] 7.11.5 - Test notification preferences (user toggles settings, notifications respect preferences)

### Documentation
- [ ] 7.12.1 - Document notification API endpoints
- [ ] 7.12.2 - Create user guide for notification preferences
- [ ] 7.12.3 - Document email template structure
- [ ] 7.12.4 - Create troubleshooting guide (emails not sending, WebSocket disconnected)

---

# FASE 8: DEPLOYMENT & POLISH (Week 18)

## 🟡 ILHAM'S SECTION (DevOps & Backend Deployment - 40%)

### Backend Deployment & Setup
- [ ] 8.1.1 - Choose production hosting (AWS, DigitalOcean, Heroku, or similar)
- [ ] 8.1.2 - Setup production server (OS, PHP, MySQL, Redis)
- [ ] 8.1.3 - Setup SSL/TLS certificate (HTTPS, auto-renewal with Let's Encrypt)
- [ ] 8.1.4 - Configure environment variables (.env.production)
- [ ] 8.1.5 - Setup database backups (daily automated backups to S3)
- [ ] 8.1.6 - Configure Redis for caching & session storage
- [ ] 8.1.7 - Setup queue worker (Laravel Horizon or similar, for async jobs)
- [ ] 8.1.8 - Configure domain name & DNS records

### Backend Performance Optimization
- [ ] 8.2.1 - Optimize database queries (add missing indexes, use eager loading)
- [ ] 8.2.2 - Add API response caching (5-30 min TTL for read endpoints)
- [ ] 8.2.3 - Setup CDN for images/static assets (Cloudflare, AWS CloudFront)
- [ ] 8.2.4 - Implement API rate limiting (prevent abuse, e.g., 100 requests/min per IP)
- [ ] 8.2.5 - Enable gzip compression on API responses

### Backend Monitoring & Logging
- [ ] 8.3.1 - Setup error tracking (Sentry or similar)
- [ ] 8.3.2 - Setup application logging (CloudWatch, ELK, Splunk, or similar)
- [ ] 8.3.3 - Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] 8.3.4 - Setup performance monitoring (APM: New Relic, DataDog, Skylight)
- [ ] 8.3.5 - Create alerts (errors >10/min, slow queries >1s, CPU >80%, disk >85%)

### Backend Security
- [ ] 8.4.1 - Configure CORS (restrict to frontend domain only)
- [ ] 8.4.2 - Enable API rate limiting
- [ ] 8.4.3 - Review OWASP Top 10 vulnerabilities
- [ ] 8.4.4 - Rotate API keys & secrets (generate new Midtrans keys, API tokens)
- [ ] 8.4.5 - Enable database encryption at rest
- [ ] 8.4.6 - Run security audit with SonarQube or similar

### CI/CD Pipeline Setup
- [ ] 8.5.1 - Setup GitHub Actions (or Jenkins, GitLab CI)
- [ ] 8.5.2 - Create backend pipeline (lint → test → build → deploy)
- [ ] 8.5.3 - Configure auto-deployment on git push to main branch
- [ ] 8.5.4 - Setup auto-rollback on failed deployments
- [ ] 8.5.5 - Configure staging environment for testing before production

### Database Setup
- [ ] 8.6.1 - Setup production database (AWS RDS, DigitalOcean, or self-hosted)
- [ ] 8.6.2 - Run migrations automatically on deploy
- [ ] 8.6.3 - Setup automated daily backups (30-day retention)
- [ ] 8.6.4 - Monitor slow query logs (log queries >1 second)
- [ ] 8.6.5 - Setup connection pool (max connections, idle timeout)

---

## 🔵 AISITI'S SECTION (Frontend Deployment - 40%)

### Frontend Build & Optimization
- [ ] 8.7.1 - Create production build (Next.js or React build optimization)
- [ ] 8.7.2 - Configure API endpoints for production (/api.mediva.com, not localhost)
- [ ] 8.7.3 - Remove debug logs & console statements
- [ ] 8.7.4 - Optimize bundle size (code splitting, lazy loading, tree-shaking)
- [ ] 8.7.5 - Setup environment variables (.env.production)
- [ ] 8.7.6 - Run build, verify no errors or warnings

### Frontend Hosting & Deployment
- [ ] 8.8.1 - Choose frontend hosting (Vercel, Netlify, AWS S3+CloudFront, or similar)
- [ ] 8.8.2 - Deploy frontend to CDN
- [ ] 8.8.3 - Setup custom domain & SSL certificate
- [ ] 8.8.4 - Configure caching headers (index.html: no-cache, assets: 1 year)
- [ ] 8.8.5 - Setup automatic deployments from Git (CI/CD: on main branch push, auto-deploy)

### Frontend Performance Optimization
- [ ] 8.9.1 - Run Lighthouse audit (target >90 on all pages)
- [ ] 8.9.2 - Optimize images (use next/image, WebP format, responsive sizes)
- [ ] 8.9.3 - Implement service worker (offline support, optional)
- [ ] 8.9.4 - Monitor Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] 8.9.5 - Test performance on slow networks (throttle to 4G in DevTools)

### Frontend Testing
- [ ] 8.10.1 - Smoke test all major flows:
  - [ ] Login → Dashboard
  - [ ] Browse catalog → Search → Filter
  - [ ] Add to cart → Checkout → Payment
  - [ ] Order confirmation → My Orders
- [ ] 8.10.2 - Test on multiple devices (iPhone, iPad, Android, desktop)
- [ ] 8.10.3 - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] 8.10.4 - Test on slow networks (throttle to 3G, 4G in DevTools)
- [ ] 8.10.5 - Load test (simulate 100+ concurrent users, verify response <2s)

---

## 🟡 ILHAM'S SECTION (Documentation & Knowledge Transfer - 20%)

### API Documentation
- [ ] 8.11.1 - Create OpenAPI/Swagger documentation (all endpoints, request/response schemas)
- [ ] 8.11.2 - Generate Postman collection from OpenAPI spec
- [ ] 8.11.3 - Document all error codes & status codes (400, 401, 403, 404, 500, etc.)

### Deployment Documentation
- [ ] 8.12.1 - Write step-by-step deployment guide (for next deployment)
- [ ] 8.12.2 - Document environment configuration (which vars are required, optional)
- [ ] 8.12.3 - Create troubleshooting guide (common issues & solutions)
- [ ] 8.12.4 - Create incident response runbook (what to do if service goes down)

### Codebase Documentation
- [ ] 8.13.1 - Create architecture overview diagram (frontend, backend, database, external services)
- [ ] 8.13.2 - Write setup guide for new developers (how to run locally, configure IDE)
- [ ] 8.13.3 - Document coding standards & conventions (naming, structure, comments)
- [ ] 8.13.4 - Create database schema diagram & documentation (tables, relationships, indexes)

### Knowledge Transfer to Team
- [ ] 8.14.1 - Train Tsabita on deployment process (how to deploy, rollback, monitor)
- [ ] 8.14.2 - Train team on incident response (how to debug, who to contact)
- [ ] 8.14.3 - Document on-call rotation (who handles production issues)
- [ ] 8.14.4 - Record walkthrough video of major components (10-15 min each)

---

## 🟢 TSABITA'S SECTION (QA & Final Polish - 20%)

### Final Testing & QA
- [ ] 8.15.1 - Code review & quality checks (linting, test coverage, performance)
- [ ] 8.15.2 - Security audit checklist (OWASP Top 10, SQL injection, XSS, CSRF)
- [ ] 8.15.3 - Accessibility audit (screen reader, keyboard navigation, color contrast)
- [ ] 8.15.4 - Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] 8.15.5 - Mobile testing (iOS Safari, Android Chrome)

### UAT (User Acceptance Testing)
- [ ] 8.16.1 - Prepare UAT test cases (step-by-step workflows)
- [ ] 8.16.2 - Conduct UAT with stakeholders (Ilham, client, business team)
- [ ] 8.16.3 - Log & prioritize bugs found in UAT
- [ ] 8.16.4 - Fix critical bugs before release

### Release Preparation
- [ ] 8.17.1 - Create release notes (v1.0: features, bug fixes, known issues)
- [ ] 8.17.2 - Update README.md (how to use the app, support contact)
- [ ] 8.17.3 - Create user guide (quick start, screenshots, FAQ)
- [ ] 8.17.4 - Tag release in Git (git tag v1.0)

### Post-Launch Support
- [ ] 8.18.1 - Monitor production for 24 hours (watch logs, error rate, response times)
- [ ] 8.18.2 - Respond to user issues (support email, bug reports)
- [ ] 8.18.3 - Create hotfix branch if critical bugs found
- [ ] 8.18.4 - Plan v1.1 features (based on feedback)

### Team Celebration
- [ ] 8.19.1 - Retrospective meeting (what went well, what could improve)
- [ ] 8.19.2 - Lessons learned document (for future projects)
- [ ] 8.19.3 - Celebrate successful launch! 🎉

---

## TASK COMPLETION TRACKER

Copy this section into your project tracker (Trello, Jira, Asana, etc.) to track progress:

### FASE 3: Stock Inventory
- Aisiti: 23 tasks
- Ilham: 8 tasks
- Tsabita: 5 tasks
- **Total: 36 tasks**

### FASE 4: Product Catalog
- Aisiti: 24 tasks
- Ilham: 4 tasks
- Tsabita: 4 tasks
- **Total: 32 tasks**

### FASE 5: Shopping Cart & Checkout
- Aisiti: 20 tasks
- Ilham: 4 tasks
- Tsabita: 3 tasks
- **Total: 27 tasks**

### FASE 6: Payments & Prescriptions
- Aisiti: 25 tasks
- Ilham: 12 tasks
- Tsabita: 5 tasks
- **Total: 42 tasks**

### FASE 7: Notifications
- Aisiti: 5 tasks
- Ilham: 14 tasks
- Tsabita: 5 tasks
- **Total: 24 tasks**

### FASE 8: Deployment & Polish
- Aisiti: 9 tasks
- Ilham: 14 tasks
- Tsabita: 9 tasks
- **Total: 32 tasks**

---

**GRAND TOTAL: 193 tasks across 6 phases**

- Aisiti: ~106 tasks (45% allocation) ✓
- Ilham: ~67 tasks (35% allocation) ✓
- Tsabita: ~31 tasks (20% allocation) ✓

---

## HOW TO USE THIS DOCUMENT

1. **Assign Tasks:**
   - Aisiti: Copy all 🔵 tasks to your task tracker
   - Ilham: Copy all 🟡 tasks to your task tracker
   - Tsabita: Copy all 🟢 tasks to your task tracker

2. **Track Progress:**
   - Update checkboxes as tasks complete
   - Move completed tasks to "Done" column
   - Log blockers or issues in notes

3. **Daily Standups:**
   - What did you complete yesterday?
   - What are you working on today?
   - Any blockers or help needed?

4. **Weekly Reviews:**
   - Friday 4 PM: Review completed tasks, plan next week
   - Adjust timeline if any tasks take longer than expected

5. **Adjustment:**
   - If task estimates are wrong, re-estimate & adjust timeline
   - If workload imbalance arises (Aisiti overloaded, Tsabita underloaded), redistribute tasks
   - Always maintain: Tsabita ~20%, Aisiti ~45%, Ilham ~35%

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-11-16 | Initial detailed task breakdown for Fase 3-8 (193 tasks) |

