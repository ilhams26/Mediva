# PROJECT ROADMAP - Mediva Smart Medicine Platform
## Complete 15-Week Implementation Plan (Fase 1-8)

**Project:** Mediva Smart Medicine Platform  
**Duration:** 15 weeks (Fase 1-8)  
**Team:** 3 people (Ilham 48%, Aisiti 32%, Tsabita 20%)  
**Status:** Fase 1-2 COMPLETE ✅ | Fase 3-8 IN PROGRESS  
**Start Date:** Week 6 (Monday next)

---

## ⚠️ UPDATED ALLOCATION (v2.0)
**Changes from v1.0:**
- Ilham: 35% → **48%** (added backend 30%, Fonté AI, OTP, Midtrans)
- Aisiti: 45% → **32%** (frontend focus only, reduced backend)
- Tsabita: 20% → **20%** (unchanged)

---

## FASE 1: AUTH & FOUNDATIONAL SETUP ✅ COMPLETE
**Duration:** 2 weeks | **Status:** Done  
**Deliverables:** Authentication, OTP system, design system, 4 demo pages

### Completed Tasks:
- [x] User registration with OTP verification
- [x] Login authentication (JWT tokens)
- [x] Forgot password & reset flow
- [x] Role-based access control (Admin, Doctor, Customer)
- [x] Design system (components, typography, colors)
- [x] Dashboard, Profile, Settings, Product List pages
- [x] API endpoints (Auth, User management)

**Owner:** Ilham (Lead) + Aisiti (OTP implementation) + Tsabita (Design support)

---

## FASE 2: INITIAL FEATURE SETUP ✅ COMPLETE
**Duration:** 2 weeks | **Status:** Done  
**Deliverables:** Data models, basic catalog, notification foundation

### Completed Tasks:
- [x] Database schema (Users, Products, Orders, Prescriptions)
- [x] Product catalog basic structure
- [x] Notification system foundation
- [x] Image upload integration
- [x] Error handling & logging
- [x] Unit tests for core services

**Owner:** Ilham (Lead) + Aisiti (Database design) + Tsabita (Testing support)

---

## FASE 3: STOCK & INVENTORY MANAGEMENT
**Duration:** 3 weeks | **Status:** TODO  
**Deliverables:** Stock tracking, inventory API, stock alerts

### Backend Tasks (Ilham Lead - 60%):
1. **Stock API Endpoints**
   - [ ] GET /api/stock - list all stock with filters (kategori, ketersediaan)
   - [ ] GET /api/stock/:id - single stock detail
   - [ ] POST /api/stock - create stock (admin only)
   - [ ] PUT /api/stock/:id - update stock quantity/info
   - [ ] DELETE /api/stock/:id - remove stock (soft delete)
   - [ ] POST /api/stock/:id/adjust - manual stock adjustment with reason log

2. **Stock Model & Database**
   - [ ] Create Stok migration with fields: obat_id, quantity, lokasi, reorder_level, last_checked
   - [ ] Create PergerakanStok (Stock Movement) model for audit trail
   - [ ] Add stock-related indexes for query performance
   - [ ] Create seeders with realistic stock data

3. **Stock Business Logic**
   - [ ] Implement low-stock alert trigger (when qty <= reorder_level)
   - [ ] Implement stock reservation system (for orders in process)
   - [ ] Implement stock history/movement tracking
   - [ ] Add stock validation before order confirmation

4. **Stock Notifications**
   - [ ] Create notification service for low stock alerts
   - [ ] Create notification service for restock reminders
   - [ ] Email integration for admin alerts

### Frontend Tasks (Aisiti Lead - 40%):
1. **Stock Dashboard Page**
   - [ ] Create /pages/admin/stock page (admin only)
   - [ ] Display stock list with: Obat name, Quantity, Reorder Level, Status (OK/LOW/OUT)
   - [ ] Add filters: by kategori, by status (OK/LOW), by lokasi
   - [ ] Add search by obat name/kode
   - [ ] Real-time stock update via WebSocket or polling

2. **Stock Management Components**
   - [ ] StockCard component (display single stock item)
   - [ ] StockForm component (create/edit stock)
   - [ ] StockAdjustmentForm component (adjust quantity with reason)
   - [ ] LowStockAlert component (warning banner for low stock)

3. **Stock Analytics**
   - [ ] Display total inventory value
   - [ ] Show movement history (last 30 days)
   - [ ] Display alert summary (X items low stock)

### Support Tasks (Tsabita - 20%):
- [ ] Write unit tests for Stock model & services
- [ ] Create stock test data & fixtures
- [ ] Document stock API endpoints (Postman collection)
- [ ] Create deployment checklist for Fase 3

**Owner:** Aisiti (60%) | Ilham supervision (20%) | Tsabita support (20%)  
**Dependencies:** Auth ✅, Database models ✅

---

## FASE 4: PRODUCT CATALOG & RECOMMENDATIONS
**Duration:** 3 weeks | **Status:** TODO  
**Deliverables:** Complete catalog, search, filters, AI recommendations

### Backend Tasks (Aisiti Lead - 50%):
1. **Catalog API Endpoints**
   - [ ] GET /api/products - list with pagination, filtering, sorting
   - [ ] GET /api/products/:id - product detail with stock status
   - [ ] GET /api/products/search - full-text search (name, deskripsi, kode)
   - [ ] GET /api/products/:id/related - related products
   - [ ] POST /api/products - create product (admin only)
   - [ ] PUT /api/products/:id - update product info
   - [ ] DELETE /api/products/:id - remove product (soft delete)
   - [ ] GET /api/categories - list all kategori with counts

2. **Product Embedding & Search**
   - [ ] Implement vector embedding for products (using Fonté AI)
   - [ ] Create ObatEmbedding model & migration
   - [ ] Implement semantic search (similarity search by embedding)
   - [ ] Add full-text search (MySQL FULLTEXT or Meilisearch)
   - [ ] Cache frequently searched terms

3. **Product Filtering & Sorting**
   - [ ] Filter by kategori, harga, ketersediaan, rating
   - [ ] Sort by: relevance, newest, harga (asc/desc), rating, terlaris
   - [ ] Price range filter (min/max)
   - [ ] In-stock/out-of-stock toggle

4. **AI Recommendations**
   - [ ] Integrate with Fonté AI for product recommendations
   - [ ] Implement "users who bought X also viewed Y" logic
   - [ ] Implement "trending products" (based on views/purchases)
   - [ ] Cache recommendations (update daily)

### Frontend Tasks (Aisiti - 50%):
1. **Product Catalog Pages**
   - [ ] Create /pages/catalog page (list all products)
   - [ ] Create /pages/products/:id page (product detail)
   - [ ] Create /pages/search page (search results)
   - [ ] Create /pages/category/:id page (products by category)

2. **Catalog Components**
   - [ ] ProductCard component (grid/list view)
   - [ ] ProductDetail component (image gallery, description, reviews, stock status)
   - [ ] FilterSidebar component (kategori, harga, ketersediaan)
   - [ ] SortDropdown component
   - [ ] SearchBar component with autocomplete
   - [ ] RecommendationCarousel component (AI-driven suggestions)
   - [ ] RatingStars component (display product ratings)

3. **Search & Filter UX**
   - [ ] Real-time filter updates (URL query params)
   - [ ] Search suggestions/autocomplete
   - [ ] Faceted search (show filter counts)
   - [ ] "Clear filters" button
   - [ ] Save favorite products (wishlist)

4. **Performance**
   - [ ] Lazy load product images
   - [ ] Pagination or infinite scroll
   - [ ] Debounce search input (500ms)
   - [ ] Cache catalog data (5 min TTL)

### Support Tasks (Tsabita - 20%):
- [ ] Create product seeder with 200+ realistic medicines
- [ ] Write tests for catalog service & search logic
- [ ] Create Postman collection for catalog APIs
- [ ] Performance testing (load test catalog endpoints)
- [ ] Document product API endpoints

**Owner:** Aisiti (100%) with Ilham supervision | Tsabita support  
**Dependencies:** Stock API ✅, Auth ✅

---

## FASE 5: SHOPPING CART & CHECKOUT
**Duration:** 2 weeks | **Status:** TODO  
**Deliverables:** Cart system, order creation, checkout flow

### Backend Tasks (Aisiti Lead - 60%):
1. **Cart API (Server-side Cart)**
   - [ ] POST /api/cart - add item to cart
   - [ ] GET /api/cart - get current user's cart
   - [ ] PUT /api/cart/:itemId - update quantity
   - [ ] DELETE /api/cart/:itemId - remove item from cart
   - [ ] DELETE /api/cart - clear entire cart
   - [ ] POST /api/cart/checkout - create order from cart

2. **Order API**
   - [ ] POST /api/orders - create order (from cart or direct)
   - [ ] GET /api/orders - list user's orders with pagination
   - [ ] GET /api/orders/:id - order detail (with items, status, timeline)
   - [ ] PUT /api/orders/:id/status - update order status (admin only)
   - [ ] GET /api/orders/:id/invoice - generate/download invoice

3. **Order Model & Database**
   - [ ] Create Order migration with fields: user_id, total_harga, status, created_at, updated_at
   - [ ] Create OrderItem migration with fields: order_id, obat_id, quantity, harga_satuan
   - [ ] Add order status tracking (pending, confirmed, processing, shipped, delivered, cancelled)
   - [ ] Add order timestamps (order_date, ship_date, delivery_date)

4. **Order Business Logic**
   - [ ] Stock validation before order confirmation (prevent overselling)
   - [ ] Calculate order total (item harga × qty + shipping)
   - [ ] Generate order number (unique, sequential or UUID)
   - [ ] Create order audit trail (who approved, when status changed, why)
   - [ ] Implement order cancellation logic (refund stock if not shipped)

5. **Cart Validation**
   - [ ] Validate stock availability before checkout
   - [ ] Validate item prices (prevent price tampering from frontend)
   - [ ] Check for expired items in cart (if applicable)
   - [ ] Validate user permissions (e.g., restricted products for non-doctors)

### Frontend Tasks (Aisiti - 40%):
1. **Cart Pages**
   - [ ] Create /pages/cart page (list items in cart)
   - [ ] Create /pages/checkout page (review order, enter shipping info, select payment method)

2. **Cart Components**
   - [ ] CartItem component (product info, quantity selector, remove button, item total)
   - [ ] CartSummary component (subtotal, shipping, taxes, total)
   - [ ] QuantitySelector component (+-buttons, inline input)
   - [ ] ShippingForm component (address, city, postal code)
   - [ ] PaymentMethodSelector component (Midtrans, bank transfer, etc.)
   - [ ] OrderConfirmation component (order number, email confirmation)

3. **Cart UX**
   - [ ] Add to cart button on product page (with quantity selector)
   - [ ] Cart count badge in header (number of items)
   - [ ] Cart persistence (save to localStorage, sync with backend)
   - [ ] "Continue shopping" link after add-to-cart
   - [ ] "Apply coupon" input field (prepare for Fase 6)
   - [ ] "Estimate shipping" feature

4. **Checkout Flow**
   - [ ] Multi-step checkout (review items → shipping → payment → confirmation)
   - [ ] Show order summary on each step
   - [ ] Real-time total calculation (with shipping & taxes)
   - [ ] Error messages for validation failures
   - [ ] Success page with order number & tracking link

### Support Tasks (Tsabita - 20%):
- [ ] Write tests for Order model & cart service
- [ ] Create test data for cart/order scenarios
- [ ] Document cart & order APIs
- [ ] Test checkout flow end-to-end (manual testing checklist)

**Owner:** Aisiti (100%) with Ilham supervision | Tsabita support  
**Dependencies:** Stock API ✅, Product Catalog ✅, Auth ✅

---

## FASE 6: PAYMENTS & PRESCRIPTIONS
**Duration:** 3 weeks | **Status:** TODO  
**Deliverables:** Payment processing, prescription management, doctor workflows

### Backend Tasks (Aisiti Lead - 50%):
1. **Payment Gateway Integration (Midtrans)**
   - [ ] Setup Midtrans account & API keys in env
   - [ ] Implement payment API endpoint: POST /api/orders/:id/pay
   - [ ] Create payment webhook handler for Midtrans callbacks
   - [ ] Implement payment verification (GET /api/orders/:id/payment-status)
   - [ ] Store payment transaction records in database
   - [ ] Handle payment success/failure/pending states
   - [ ] Implement payment retry logic (for failed transactions)

2. **Payment Processing Logic**
   - [ ] Generate Midtrans transaction token (snap token)
   - [ ] Verify payment signature from Midtrans webhook
   - [ ] Update order status based on payment status
   - [ ] Send payment confirmation email
   - [ ] Implement refund handling (if order cancelled)
   - [ ] Add payment audit trail (transaction ID, timestamp, amount)

3. **Prescription API**
   - [ ] GET /api/prescriptions - list user's prescriptions
   - [ ] GET /api/prescriptions/:id - prescription detail
   - [ ] POST /api/prescriptions - create prescription (doctor only)
   - [ ] PUT /api/prescriptions/:id - update prescription (doctor only)
   - [ ] DELETE /api/prescriptions/:id - remove prescription (soft delete)
   - [ ] POST /api/prescriptions/:id/validate - validate prescription (pharmacist)
   - [ ] GET /api/prescriptions/:id/items - get prescribed medicines

4. **Prescription Model & Validation**
   - [ ] Create Resep migration with: user_id, doctor_id, date_created, expiry_date, status, notes
   - [ ] Create ResepItem migration with: resep_id, obat_id, quantity, dosage, frequency, duration
   - [ ] Implement prescription validation rules (dosage limits, contraindications)
   - [ ] Implement prescription expiry logic (mark as expired after date)
   - [ ] Create prescription number/reference system

5. **Doctor Workflow**
   - [ ] Doctor can view patient profiles
   - [ ] Doctor can create/update prescriptions
   - [ ] Implement prescription approval workflow (if needed)
   - [ ] Doctor can view order history from their prescriptions

6. **Pharmacist Workflow (if applicable)**
   - [ ] Pharmacist can verify prescriptions
   - [ ] Pharmacist can see order fulfillment status
   - [ ] Pharmacist can mark prescription as fulfilled

### Frontend Tasks (Aisiti - 50%):
1. **Payment Pages**
   - [ ] Create /pages/checkout/payment page (redirect to Midtrans snap)
   - [ ] Create /pages/order-confirmation page (show order #, payment status, next steps)

2. **Payment Components**
   - [ ] PaymentForm component (integrate Midtrans Snap)
   - [ ] PaymentStatus component (pending/success/failed states)
   - [ ] PaymentHistory component (list past transactions)
   - [ ] InvoiceViewer component (PDF download)

3. **Prescription Pages (for Doctor)**
   - [ ] Create /pages/doctor/prescriptions page (list all prescriptions)
   - [ ] Create /pages/doctor/prescriptions/new page (create prescription)
   - [ ] Create /pages/doctor/prescriptions/:id page (view/edit prescription)

4. **Prescription Pages (for Patient)**
   - [ ] Create /pages/my-prescriptions page (list user's prescriptions)
   - [ ] Create /pages/prescriptions/:id page (view prescription, buy medicines)

5. **Prescription Components**
   - [ ] PrescriptionForm component (select medicines, add dosage/frequency)
   - [ ] PrescriptionItem component (medicine name, dosage, frequency, quantity)
   - [ ] PrescriptionUpload component (image/PDF upload for existing prescriptions)
   - [ ] DoctorSelector component (search & select doctor)
   - [ ] PatientSelector component (for doctor to select patient)

6. **Prescription UX**
   - [ ] "Buy from prescription" button on prescription view
   - [ ] Auto-fill cart from prescription (quantity × dosage)
   - [ ] Show prescription expiry status
   - [ ] Display doctor's name & contact on prescription

### Support Tasks (Tsabita - 20%):
- [ ] Setup Midtrans sandbox account for testing
- [ ] Create payment test scenarios (success, failure, pending)
- [ ] Write tests for payment & prescription services
- [ ] Document payment API endpoints & Midtrans integration
- [ ] Create deployment checklist for payment secrets

**Owner:** Aisiti (100%) with Ilham supervision | Tsabita support  
**Dependencies:** Shopping Cart ✅, Auth ✅, Stock API ✅

---

## FASE 7: NOTIFICATIONS & MESSAGING
**Duration:** 2 weeks | **Status:** TODO  
**Deliverables:** Real-time notifications, email alerts, user messaging

### Backend Tasks (Ilham Lead - 60% + Aisiti 20%):
1. **Notification System Architecture**
   - [ ] Design notification model (type, recipient, content, status, read_at)
   - [ ] Create Notifikasi migration with: user_id, type, title, message, data (JSON), read_at
   - [ ] Implement notification service (create, read, mark as read)
   - [ ] Implement WebSocket for real-time notifications (using Laravel Broadcasting or Socket.io)
   - [ ] Create notification channels: In-app, Email, SMS (optional)

2. **In-App Notifications**
   - [ ] GET /api/notifications - list unread notifications
   - [ ] GET /api/notifications/all - list all notifications (with pagination)
   - [ ] PUT /api/notifications/:id/read - mark single notification as read
   - [ ] PUT /api/notifications/read-all - mark all notifications as read
   - [ ] DELETE /api/notifications/:id - delete notification
   - [ ] WebSocket event for new notifications (real-time push)

3. **Email Notifications**
   - [ ] Setup email provider (Laravel Mail with SMTP or SendGrid)
   - [ ] Create email templates: Order confirmation, Payment receipt, Shipment tracking, Low stock alert
   - [ ] Implement notification queue (for async email sending)
   - [ ] Create email log/history for debugging

4. **Order-Related Notifications**
   - [ ] Notify on order confirmation
   - [ ] Notify on order status change (processing, shipped, delivered)
   - [ ] Notify on payment confirmation
   - [ ] Notify on prescription approval (if applicable)

5. **Admin Notifications**
   - [ ] Notify on low stock alert
   - [ ] Notify on new order (admin dashboard)
   - [ ] Notify on payment received
   - [ ] Notify on prescription awaiting validation

### Frontend Tasks (Aisiti - 40%):
1. **Notification Pages**
   - [ ] Create /pages/notifications page (list all notifications)

2. **Notification Components**
   - [ ] NotificationCenter component (dropdown in header)
   - [ ] NotificationItem component (type icon, title, message, timestamp)
   - [ ] NotificationBell component (badge with count, click to open center)
   - [ ] NotificationToast component (auto-dismiss popup)

3. **Real-time Notification UX**
   - [ ] WebSocket connection on app load
   - [ ] Toast notification when new notification arrives
   - [ ] Sound alert option (optional)
   - [ ] Notification preferences page (opt-in/out by type)

4. **Notification Preferences**
   - [ ] Create /pages/settings/notifications page
   - [ ] Toggle email notifications by type
   - [ ] Toggle in-app notifications
   - [ ] Add notification sounds toggle

### Support Tasks (Tsabita - 20%):
- [ ] Setup email provider (SMTP/SendGrid) for testing
- [ ] Create notification seed data
- [ ] Write tests for notification service
- [ ] Document notification API endpoints
- [ ] Create user guide for notification preferences

**Owner:** Ilham (60%) + Aisiti (20%) + Tsabita support  
**Dependencies:** Auth ✅, Order API ✅

---

## FASE 8: DEPLOYMENT & POLISH
**Duration:** 1 week | **Status:** TODO  
**Deliverables:** Production deployment, monitoring, bug fixes, optimization

### Backend Deployment (Ilham Lead - 40%):
1. **Production Setup**
   - [ ] Deploy Laravel backend to production server (e.g., AWS, DigitalOcean)
   - [ ] Setup SSL/TLS certificate
   - [ ] Configure environment variables (.env.production)
   - [ ] Setup database backups (daily backups to S3 or external storage)
   - [ ] Configure Redis for caching & session storage
   - [ ] Setup queue worker for async jobs (email, notifications)

2. **Performance Optimization**
   - [ ] Database query optimization (add indexes, eager loading)
   - [ ] API response caching (5-30 min TTL for read endpoints)
   - [ ] CDN setup for image/static asset delivery
   - [ ] Implement rate limiting on APIs (prevent abuse)
   - [ ] Compress API responses (gzip)

3. **Monitoring & Logging**
   - [ ] Setup error tracking (e.g., Sentry)
   - [ ] Setup application logging (CloudWatch, ELK, or similar)
   - [ ] Setup uptime monitoring (e.g., UptimeRobot)
   - [ ] Setup performance monitoring (APM: New Relic, DataDog, or similar)
   - [ ] Create alerts for errors, slow queries, high resource usage

4. **Security**
   - [ ] Enable CORS properly (restrict to frontend domain only)
   - [ ] Setup API rate limiting
   - [ ] Implement CSRF protection (if needed)
   - [ ] Rotate API keys & secrets
   - [ ] Run security audit (OWASP Top 10 check)

### Frontend Deployment (Aisiti Lead - 40%):
1. **Production Build**
   - [ ] Create production build (Next.js/React build optimization)
   - [ ] Configure API endpoints for production
   - [ ] Remove debug logs/console statements
   - [ ] Optimize bundle size (code splitting, lazy loading)
   - [ ] Setup environment variables (.env.production)

2. **Frontend Hosting**
   - [ ] Deploy to CDN/hosting (Vercel, Netlify, AWS S3+CloudFront)
   - [ ] Setup domain & SSL certificate
   - [ ] Configure caching headers (index.html: no-cache, assets: 1 year cache)
   - [ ] Setup automatic deploys from Git (CI/CD pipeline)

3. **Frontend Performance**
   - [ ] Lighthouse audit (aim for 90+ score)
   - [ ] Optimize images (next/image, WebP format)
   - [ ] Implement service worker for offline support (optional)
   - [ ] Monitor Core Web Vitals (LCP, FID, CLS)

4. **Testing**
   - [ ] Smoke test all major flows (login → catalog → checkout → order)
   - [ ] Test on multiple devices/browsers (mobile, tablet, desktop)
   - [ ] Test on slow networks (3G, 4G)
   - [ ] Load test (simulate 100+ concurrent users)

### DevOps & Infrastructure (Ilham - 20%):
1. **CI/CD Pipeline**
   - [ ] Setup GitHub Actions or similar (auto-test, auto-deploy on push)
   - [ ] Backend pipeline: lint → test → build → deploy
   - [ ] Frontend pipeline: lint → build → deploy
   - [ ] Auto-rollback on failed deployments

2. **Database**
   - [ ] Production database setup (managed database service or self-hosted)
   - [ ] Database migrations automated (run migrations on deploy)
   - [ ] Database backup strategy (daily backups, 30-day retention)
   - [ ] Database monitoring (slow query logs, connection pool status)

### Documentation & Knowledge Transfer (Ilham - 20% + Aisiti 20%):
1. **API Documentation**
   - [ ] Complete OpenAPI/Swagger documentation
   - [ ] Postman collection for all endpoints
   - [ ] API error codes & status codes documented

2. **Deployment Documentation**
   - [ ] Step-by-step deployment guide
   - [ ] Environment configuration guide
   - [ ] Troubleshooting guide for common issues
   - [ ] Incident response runbook

3. **Codebase Documentation**
   - [ ] Architecture overview (high-level diagram)
   - [ ] Setup guide for new developers
   - [ ] Coding standards & conventions
   - [ ] Database schema diagram & documentation

### Final Tasks (Team - 20%):
- [ ] Code review & bug fixes (final polish)
- [ ] UAT testing (Ilham reviews with stakeholders)
- [ ] Create release notes (v1.0)
- [ ] Team retrospective & lessons learned
- [ ] Celebrate launch 🎉

**Owner:** Ilham (40% DevOps + 20% Documentation) + Aisiti (40% Frontend + 20% Documentation) + Tsabita support  
**Dependencies:** All previous phases ✅

---

## TIMELINE SUMMARY

| Fase | Week | Duration | Status | Owner(s) |
|------|------|----------|--------|----------|
| **Fase 1** | 1-2 | 2 weeks | ✅ COMPLETE | Ilham + Aisiti + Tsabita |
| **Fase 2** | 3-4 | 2 weeks | ✅ COMPLETE | Ilham + Aisiti + Tsabita |
| **Fase 3** | 5-7 | 3 weeks | TODO | Aisiti (60%) + Ilham (20%) + Tsabita (20%) |
| **Fase 4** | 8-10 | 3 weeks | TODO | Aisiti (100%) + Ilham supervision + Tsabita |
| **Fase 5** | 11-12 | 2 weeks | TODO | Aisiti (100%) + Ilham supervision + Tsabita |
| **Fase 6** | 13-15 | 3 weeks | TODO | Aisiti (50%) + Ilham (50%) + Tsabita (20%) |
| **Fase 7** | 16-17 | 2 weeks | TODO | Ilham (60%) + Aisiti (20%) + Tsabita (20%) |
| **Fase 8** | 18 | 1 week | TODO | Ilham (40%) + Aisiti (40%) + Tsabita support |

**Total:** 15 weeks | **Team:** Ilham 35% + Aisiti 45% + Tsabita 20%

---

## TASK ALLOCATION BREAKDOWN

### By Person (UPDATED v2.0):

**Ilham (Lead, 48% allocation):** ⬆️ INCREASED
- Fase 3: Backend Stock API (60%) + supervision
- Fase 4: Backend Catalog API (50%) + Fonté AI integration (100%)
- Fase 5: Backend Cart & Order API (60%)
- Fase 6: Payment integration with Midtrans (100%) + Prescription API (50%)
- Fase 7: Backend notifications (60%)
- Fase 8: DevOps (40%) + documentation (20%)

**Aisiti (Main Developer, 32% allocation):** ⬇️ REDUCED (was 45%)
- Fase 3: Stock Frontend (40%)
- Fase 4: Product Catalog Frontend (50%)
- Fase 5: Cart & Checkout Frontend (40%)
- Fase 6: Prescription Frontend (50%)
- Fase 7: Notification Frontend (40%)
- Fase 8: Frontend deployment (40%)

**Tsabita (Support, 20% allocation):** → UNCHANGED
- All phases: Testing, QA, documentation, data setup, UAT
- Consistent 20% across all Fase 3-8

---

## SUCCESS CRITERIA PER FASE

### Fase 3 Success:
- Stock API fully functional (6 endpoints tested)
- Low-stock alerts trigger correctly
- Stock dashboard displays real-time data
- 100% test coverage for stock services
- Zero stock-related bugs in production

### Fase 4 Success:
- Product search returns results in <200ms
- Filters work correctly (all combinations)
- AI recommendations appear on product page
- 200+ products in catalog with images
- Lighthouse score >90 on catalog pages

### Fase 5 Success:
- Cart persists across browser sessions
- Checkout flow completes end-to-end
- Orders created successfully in database
- Cart validation prevents invalid orders
- Zero checkout abandonment due to bugs

### Fase 6 Success:
- Payment processing 100% successful for test transactions
- Payment webhooks received & verified correctly
- Prescriptions created & validated by doctors
- Prescription medicines automatically added to cart
- Zero payment-related customer complaints

### Fase 7 Success:
- Notifications delivered in real-time (<2sec latency)
- Email notifications sent for all order updates
- Notification preferences work correctly
- Notification history searchable & filterable
- 99.9% notification delivery rate

### Fase 8 Success:
- Production deployment zero-downtime
- All endpoints respond in <500ms
- Error rate <0.1%
- Uptime >99.5% first week
- Team knowledge transfer complete
- v1.0 release notes published

---

## DEPENDENCIES & BLOCKERS

**None currently.** All phases are sequential with clear handoffs:
- Fase 3 → Fase 4 (stock ready, catalog depends on stock API)
- Fase 4 → Fase 5 (catalog ready, checkout depends on product API)
- Fase 5 → Fase 6 (orders ready, payments depend on order creation)
- Fase 6 → Fase 7 (orders & prescriptions ready, notifications depend on order updates)
- Fase 7 → Fase 8 (feature complete, deployment can begin)

**Risk Mitigation:**
- If Aisiti blocked: Ilham can pair-program to unblock
- If payment vendor issues: Use test mode; escalate to vendor support
- If deployment issues: Rollback to previous version; debug in staging

---

## COMMUNICATION & STANDUPS

**Daily Standup:** 10:00 AM (15 min)
- What we did yesterday
- What we're doing today
- Blockers or help needed

**Weekly Sync:** Friday 4:00 PM (30 min)
- Sprint progress review
- Lessons learned
- Plan for next week

**Monthly Retrospective:** Last Friday of month (1 hour)
- What went well
- What didn't go well
- Action items for next month

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-11-16 | Initial roadmap (Fase 1-8, 15 weeks, 3-person team) |
| v2.0 | 2026-11-16 | **UPDATED ALLOCATION:** Ilham 48% (+ backend 30%, Fonté AI, OTP, Midtrans), Aisiti 32% (frontend only), Tsabita 20% |
