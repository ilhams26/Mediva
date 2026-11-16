# PROJECT_ROADMAP.md — Mediva Smart Medicine Platform

**Document Version:** 1.0  
**Last Updated:** 2026-11-16  
**Status:** Active Development — Phase 1-2 Complete, Phase 3-8 In Progress  
**Completion:** 35% (Tahap 1-2 / Tahap 1-8)

---

## Executive Summary

Mediva is a smart pharmacy management platform combining mobile (Flutter), web admin/staf (React), and REST API (Laravel 12) with AI-powered assistant and recommendation engine.

**Current Status:** Frontend design system and layout infrastructure complete. 4 demo pages ready for presentation. Backend foundation API partially implemented.

**Overall Progress:**
- ✅ **Tahap 1-2 (Design System + Layout):** 100%
- ✅ **Tahap 3 (UI Components):** 100% — 8 reusable components
- ✅ **Tahap 4 (Demo Pages):** 100% — 4/11 pages complete
- 🔄 **Tahap 5-8:** 0% — In planning phase
- ⏳ **Tahap 9-12:** 0% — Future phases

**Target Completion:** 16 weeks (6 sprints × ~60-70 hrs/week)

---

## What's Done — Tahap 1-4

### Frontend (Web React) ✅

**Tahap 1: Design System & Folder Structure**
- tokens.css with complete design tokens (colors, typography, spacing, shadows, radii)
- global.css with base styles
- Folder structure: components, pages, layouts, services, hooks, routes, utils
- Dependencies: @iconify/react, recharts, axios, react-router-dom

**Tahap 2: Layout Infrastructure**
- Sidebar.jsx (260px fixed, dynamic menu per role)
- PageHeader.jsx (title, date, role badge, avatar)
- AppShell.jsx (grid layout wrapper)
- AuthContext.jsx (fake auth for demo)
- ProtectedRoute.jsx (role-based access)
- Routing with PrivateRoute guards

**Tahap 3: UI Components (8 reusable components)**
1. Button.jsx — primary, secondary, danger
2. StatCard.jsx — 260×170px stat display
3. SearchInput.jsx — 197px search box
4. Panel.jsx — white card container
5. DataTable.jsx — 67px rows, 5-4 columns
6. StatusBadge.jsx — color-coded status
7. EmptyState.jsx — empty placeholder
8. Charts — BarChart & DonutChart (Recharts)

**Tahap 4: 4 Demo Pages (Screenshot-Ready)**
1. **DashboardStaf** — 4 stat cards + bar chart + notification panel
2. **KelolaObat** — Search + 5-column table with edit/delete (Staf)
3. **DashboardAdmin** — 4 different stat cards + bar + donut chart
4. **KelolaUser** — Search + 4-column table (Admin)

**Deliverables:** 4 screenshot-ready pages, all styling from tokens.css, mock data embedded, role-based routing

---

### Backend (Laravel 12) 🔄

**Current Status:** 13 migrations applied, models created, basic structure

**Implemented:**
- 13 database migrations for Supabase PostgreSQL
- Core models: User, Obat, Order, Resep, etc.
- Base AuthService, OtpService, UserService (partial)
- Sanctum API Token configured
- Basic controller structure

**NOT Implemented:** All API endpoints, inventory logic, ordering, payments, AI, recommendations

---

## What's Remaining — Tahap 5-12

### Sprint 1: Weeks 1-2 — Frontend Pages (3) + Backend Foundation

**Tahap 5: Remaining Frontend Pages (3 pages)**
- Kasir (/kasir) — Grid catalog + shopping cart panel
- KelolaStok (/stok) — Stock batch management
- Pesanan (/pesanan) — Order list + prescription validation

**Hours:** 30 (SITI)  
**Deliverables:** 3 screenshot-ready pages, integration-ready for backend

**Tahap 6: Backend API Foundation**
- Cleanup REST API structure
- Standardized JSON response format
- CORS whitelist (allow React origin only)
- Rate limiting (login, OTP, AI)
- Error handling middleware
- Health check endpoint

**Hours:** 20 (ILHAM)  
**Success:** /api/health responds, CORS secure, error format consistent

---

### Sprint 2: Weeks 3-4 — Authentication & Catalog APIs

**Tahap 7: Authentication API (40 hours, ILHAM)**
- POST /api/login → token + user data
- POST /api/register, logout
- POST /api/otp/{request,verify}
- POST /api/password/{change,forgot,reset}
- GET /api/user (current authenticated user)
- OTP: 5-min expiry, rate limited, hashed
- Sanctum Personal Access Token (Bearer)
- Tests: login, logout, OTP, throttling

**Success:** Tokens created/validated, invalid rejected (401), cross-role denied (403), inactive users blocked

**Tahap 8: Catalog API (30 hours, ILHAM)**
- GET /api/categories, POST/PUT/DELETE categories
- GET /api/products (paginated, search, filter)
- POST/PUT/DELETE products (staf/admin)
- POST /api/products/{id}/image (upload)
- Inactive products hidden from catalog
- Stock calculated from batches (no duplication)
- File upload validation

**Success:** Searchable catalog, role-based CRUD, uploads validated

---

### Sprint 3: Weeks 5-6 — Inventory, Orders & Prescription

**Tahap 9: Inventory & Stock Management (40 hours, ILHAM)**
- InventoryService with FEFO (First Expired, First Out)
- POST /api/batches (receive stock)
- GET /api/batches, PUT updates
- GET /api/stock/warnings (low stock, expiry alerts)
- POST /api/stock/adjust (manual adjustments)
- Expired batches excluded from sales
- Transaction safety: lockForUpdate() prevents race conditions
- Stock never negative

**Success:** FEFO ordering correct, expired excluded, stock never negative, concurrent ops safe

**Tahap 10: Ordering & Checkout (45 hours, ILHAM)**
- POST /api/cart/{add,remove}, GET /api/cart
- POST /api/orders (checkout) → create orders + order_items, deduct stock (FEFO)
- GET /api/orders, GET /api/orders/{id}
- PUT /api/orders/{id}/status, POST cancel
- Price calculated server-side (never trust client)
- Status: pending → ready → completed
- Idempotency: repeated requests return same order
- Ownership check: users see only own orders

**Success:** Stock consistent web/mobile, server pricing accurate, cancellation refunds once, illegal transitions blocked

**Tahap 11: Prescription Management (25 hours, SITI)**
- POST /api/prescriptions (upload)
- GET /api/prescriptions, GET/{id}
- PUT /api/prescriptions/{id}/validate (staf/admin)
- DELETE /api/prescriptions/{id}
- Private storage (not public)
- File validation & virus scan (optional)
- Status: pending → approved/rejected
- tracked: validated_by, validated_at, reason
- Link to orders, enforce Rx rules at checkout
- Notifications on validation

**Success:** Files not public, Rx enforcement at checkout, status transitions correct

---

### Sprint 4: Weeks 7-8 — Payment, Notifications, Dashboard & AI

**Tahap 12: Payment (Midtrans Sandbox) (30 hours, ILHAM)**
- POST /api/payments/snap-token → generate token
- POST /api/payments/callback → webhook handler
- GET /api/payments/{orderId}
- Signature verify: SHA512(order_id + status_code + gross_amount + ServerKey)
- Amount verification: callback == order total
- Idempotency: repeated callbacks safe
- Status: pending → settlement/failure
- Server Key in .env only

**Success:** Invalid signatures rejected, amount verified, callbacks idempotent, no secret leaks

**Tahap 13: Notifications, Dashboard & Reports (35 hours, SITI)**
- GET /api/notifications, PUT/{id}/read, read-all
- GET /api/notifications/unread-count
- GET /api/dashboard/staf → order count, stock metrics, transaction graphs
- GET /api/dashboard/admin
- GET /api/reports/{transactions,stock,revenue} → PDF/Excel export
- Date filtering & role-based access

**Success:** Metrics match transaction data, filters work, exports download, <500ms queries

**Tahap 14: AI Assistant (45 hours, ILHAM)**
- POST /api/ai/chat → question + context
- POST /api/ai/products/embed → generate embeddings
- GET /api/ai/search-context → retrieve for AI
- Retrieve relevant products → build context → Gemini → answer
- Constraints: No diagnosis, no Rx, no treatment, fallback to "consult professional"
- Rate limit: 10/user/day
- Logging without sensitive data
- Prompt injection protection

**Success:** Relevant answers with catalog data, off-topic redirected, API failures handled, rate limited, no data leaks

---

### Sprint 5: Weeks 9-10 — Recommendation, Security & Integration

**Tahap 15: Recommendation Engine (40 hours, ILHAM)**
- POST /api/recommendations/products/{id}
- GET /api/recommendations/personalized
- Hybrid: Popularity + Co-purchase + Semantic (pgvector)
- Track interactions: view, add_to_cart, purchase
- Rank & filter: remove inactive, out-of-stock
- Return top 10

**Success:** Recommendations relevant, no inactive/OOS items, personalized, <1s query

**Tahap 16: Security Hardening & Testing (40 hours, ILHAM)**
- Bearer Token audit (validation, revocation, expiry)
- Authorization audit (roles, ownership)
- Input validation (SQL injection, XSS prevention)
- File upload security
- Secret audit (.env, logs, responses)
- Rate limiting verification
- Tests: >80% coverage
- OWASP ZAP scanning (basic)
- API documentation (OpenAPI/Postman)

**Success:** All tests passing, no critical issues, no secrets in Git, CORS secure, docs complete

**Tahap 17: Frontend-Backend Integration & Deployment (50 hours, ILHAM)**
- Replace mock auth with real tokens
- Integrate all 11 frontend pages with APIs
- Error handling & loading states
- Token refresh/expiry
- Deploy to VPS: Nginx, HTTPS, SSL
- CI/CD (GitHub Actions)
- Production .env secured
- Monitoring & error logging

**Success:** React & Flutter login works, HTTPS active, migrations safe, CI/CD automated, monitoring live

---

### Sprint 6: Weeks 11-12 — Mobile, Remaining Pages & Polish

**Tahap 18: Mobile Setup & Remaining Pages (80 hours)**
- Flutter: setup, Sanctum Bearer Token, login page
- Product catalog, cart, checkout
- Order tracking, prescription upload
- Frontend: Login page (/login), Laporan (/laporan), Pengaturan (/pengaturan)
- 3D robot optional

**Hours:** 60 frontend (SITI) + 20 mobile setup (ILHAM)

**Tahap 19: Polish, Testing & Handoff (60 hours)**
- Visual polish: hover, loading, error states
- Edge case testing: network failures, timeouts
- Performance: lazy loading, bundle optimization
- Accessibility: WCAG AA baseline
- Browser testing: Chrome, Firefox, Safari, Edge
- Mobile responsiveness
- UAT & user documentation
- Training & demo

**Hours:** Split SITI + ILHAM

---

## Sprint Summary Table

| Sprint | Weeks | Frontend Hrs | Backend Hrs | Deliverables |
|--------|-------|--------------|------------|--------------|
| 0 (Done) | 1-2 | 235 | 50 | Design system, 4 pages, auth partial |
| 1 | 1-2 | 30 | 20 | 3 pages + API foundation |
| 2 | 3-4 | 0 | 70 | Auth + Catalog APIs |
| 3 | 5-6 | 25 | 110 | Inventory, Orders, Prescription |
| 4 | 7-8 | 35 | 110 | Payment, AI, Dashboard |
| 5 | 9-10 | 0 | 130 | Recommendation, Security, Deploy |
| 6 | 11-12 | 140 | 0 | Mobile, remaining pages, polish |
| **TOTAL** | 12 weeks | **425 hrs** | **500 hrs** | Production-ready system |

---

## Critical Path

`
Tahap 1-2 ──→ Tahap 4 ──┐
                         ├──→ Tahap 17 (Integration) ──→ Tahap 18 (Mobile) ──→ Tahap 19 (Polish)
Tahap 3 ─────→ Tahap 4 ─┘
                         Backend Path:
Tahap 6 ──→ Tahap 7 (Auth) ──→ Tahap 10 (Orders) ──┐
                │                                  ├──→ Tahap 13 (Dashboard)
Tahap 8 (Catalog) ──→ Tahap 9 (Inventory) ────────┘
                │
             Tahap 11 (Prescription)
                │
             Tahap 12 (Payment)
                │
         Tahap 14 (AI) ──→ Tahap 15 (Recommendation)
                │
             Tahap 16 (Security)
`

**Blocking:**
- Frontend Tahap 1-2 must finish before Tahap 4
- Backend Tahap 6 blocks all subsequent backend
- Tahap 7 (Auth) blocks Tahap 10, 13, 17
- Tahap 10 (Orders) blocks Tahap 12, 13
- Tahap 17 (Integration) blocks Tahap 18 (Mobile)

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| FEFO logic complexity | Delays ordering, stock errors | Start early, pair programming, test grid |
| Database schema changes | Rework migrations, data loss | Lock schema after Tahap 6, versioning strict |
| Midtrans integration issues | Blocks payment, rework required | Test Sandbox early, follow docs strictly |
| AI API rate limits | Chat unavailable, fallback needed | Rate limit early, queue system for async |
| Frontend responsiveness issues | Quality suffers, timeline slips | Responsive components in Tahap 3 early |
| Security audit finds critical bugs | Delay deployment, rework | Security-first practices, early OWASP scan |
| Team unavailability | Task slippage | Cross-train, pair programming, docs |
| Scope creep (new features) | Timeline extends | Strict PRD adherence, change control |

---

## Success Criteria (Project Exit)

✅ **Backend:** 40+ endpoints, Sanctum auth, FEFO tested, payment integrated, AI responding, security audit passed, API documented

✅ **Frontend:** 11 pages complete, responsive design, all APIs integrated, token management, no errors, WCAG AA baseline, Lighthouse >80

✅ **Mobile:** Flutter app, Sanctum auth, catalog/cart/checkout working, order tracking, prescription upload

✅ **Deployment:** VPS with Nginx/HTTPS, CI/CD working, .env secured, monitoring active, backups ready

✅ **Documentation:** API contract (OpenAPI), deployment runbook, user guide, developer docs, training materials

✅ **Team:** Handoff ready, code reviewed, team trained, demo presented

---

**Generated:** 2026-11-16  
**Next Review:** Weekly standup + sprint planning every Monday

