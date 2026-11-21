# Mediva — Smart Medicine Platform

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com)
[![Laravel](https://img.shields.io/badge/Laravel-12-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Flutter](https://img.shields.io/badge/Flutter-3-blue)](https://flutter.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)

Platform apotek hybrid (online & offline) dengan AI Assistant dan Smart Product Recommendation. Mendukung transaksi mobile order dan offline POS.

## 🎯 Konsep

Mediva adalah platform digital yang menyediakan dua jalur transaksi:

1. **Mobile Order** — Pembeli memesan obat melalui aplikasi mobile, checkout online, bayar via Midtrans atau cash saat pengambilan
2. **Offline POS** — Staf melayani pembeli walk-in di apotek menggunakan sistem kasir web

Dengan memanfaatkan teknologi AI (Gemini API), Mediva menyediakan:
- **Mediva AI Assistant** untuk menjawab pertanyaan terkait obat menggunakan bahasa natural
- **Smart Product Recommendation** berdasarkan semantic similarity (pgvector), co-purchase analysis, dan popularity

## 📚 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| **[PRD.md](./PRD.md)** | Product Requirements Document — source of truth untuk scope, arsitektur, dan aturan bisnis |
| **[PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)** | Roadmap pengembangan dengan status implementasi aktual per fase |
| **[design.md](./design.md)** | Spesifikasi desain UI/UX (referensi dari Figma) |
| **[workflow.md](./workflow.md)** | Aturan kerja AI agent saat development |
| **[agent.md](./agent.md)** | Standar coding & konvensi untuk AI agent |

> **Wajib dibaca:** PRD.md adalah sumber kebenaran utama. AI agent/MCP yang bekerja di project ini harus merujuk ke PRD.md sebelum membuat keputusan implementasi.

## 🏗️ Arsitektur

```
┌─────────────────────┐
│   React.js Web       │
│   Staf & Admin       │
└──────────┬────────────┘
           │ REST API
┌─────────────────────┐  ▼
│  Flutter Mobile       │──► Laravel 12 API
│  Pembeli              │       │
└─────────────────────┘        ├──────────────► PostgreSQL
                                │                   │
                                │                   └── pgvector
                                ├──────────────► Gemini API
                                └──────────────► Midtrans
```

## 🛠️ Technology Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend Web** | React.js (Staf & Admin) |
| **Mobile** | Flutter (Pembeli) |
| **Backend** | Laravel 12 (PHP ≥ 8.3) REST API |
| **Database** | PostgreSQL 16 dengan pgvector extension |
| **AI Provider** | Gemini API (embeddings & chat) |
| **Payment** | Midtrans Sandbox |
| **Authentication** | Laravel Sanctum (Bearer token) |
| **Cache** | Redis (optional) |

## 🚀 Status Implementasi

> **Status berdasarkan audit source code aktual, bukan estimasi**

| Fase | Status | Progress | Notes |
|------|--------|----------|-------|
| Fase 1: Foundation & Auth | ✅ Complete | 100% | Authentication API & Web login working |
| Fase 2: Order & Prescription | ⚠️ Partial | ~30% | Backend ada (with issues), Frontend belum |
| Fase 3: Product Catalog | ❌ Not Started | ~5% | Only `count()` endpoint exists |
| Fase 4: Stock & Batch | ❌ Not Started | ~10% | Models exist, no UI/endpoints |
| Fase 5: POS Kasir | ❌ Not Started | 0% | Needs migration fixes first |
| Fase 6: Payment Integration | ❌ Not Started | ~20% | Columns exist, integration belum |
| Fase 7: AI & Recommendations | ❌ Not Started | ~5% | Database ready, service belum |
| Fase 8: Notifications | ❌ Not Started | ~5% | Table exists, service belum |
| Fase 9: Dashboard & Reports | ❌ Not Started | ~10% | Placeholders only |
| Fase 10: Mobile Flutter | 🚫 BLOCKED | 0% | Folder `Mobile/` tidak ada |

**Overall Progress:** ~10% (realistically, only auth fully working)

Lihat **[PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)** untuk detail lengkap per fase dengan fakta source code.

Lihat **[PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)** untuk detail lengkap per fase.

## 📦 Struktur Project

```
Mediva/
├── Backend/              # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   ├── Resources/
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── Web/                  # React.js (Staf & Admin)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── routes/
│   └── package.json
├── Mobile/               # Flutter (Pembeli) — Coming Soon
├── PRD.md               # Product Requirements Document
├── PROJECT_ROADMAP.md   # Roadmap & Timeline
├── design.md            # UI/UX Design Specs
├── workflow.md          # AI Agent Workflow Rules
└── agent.md             # Coding Standards
```

## 🔧 Setup Development

### Prerequisites
- PHP ≥ 8.3
- Composer
- Node.js ≥ 18
- PostgreSQL ≥ 16
- Flutter SDK (untuk mobile)

### Backend Setup

```bash
cd Backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database di .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=mediva
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# Run migrations & seeders
php artisan migrate --seed

# Start development server
php artisan serve
```

### Web Setup

```bash
cd Web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure API endpoint di .env
# VITE_API_URL=http://localhost:8000/api
# (Pastikan tidak ada trailing slash)

# Start development server
npm run dev
```

### Mobile Setup 🚫 NOT AVAILABLE

**Status:** Mobile Flutter **belum dikembangkan**. Folder `Mobile/` tidak ada di repository.

Development Flutter akan dimulai setelah:
- Backend Catalog API selesai
- Order & Prescription API stabil
- Payment Integration ready

```bash
# Placeholder — akan diupdate saat Flutter development dimulai
# cd Mobile
# flutter pub get
# flutter run
```

## 🧪 Testing

### Backend Tests

```bash
cd Backend
php artisan test
```

### Web Tests

```bash
cd Web
npm run test
```

## 🔐 Authentication

Project ini menggunakan **Laravel Sanctum** dengan Bearer token (bukan cookie-based SPA).

**Flow:**
1. Client mengirim kredensial ke `/api/login`
2. Backend mengembalikan Bearer token
3. Client menyertakan header `Authorization: Bearer <token>` di setiap request
4. `/api/logout` menghapus token dari database

**Endpoints:**
- POST `/api/register` — Register dengan OTP verification
- POST `/api/verify-otp-register` — Verify OTP after registration
- POST `/api/login` — Login dan dapatkan Bearer token
- POST `/api/logout` — Logout (authenticated)
- POST `/api/forgot-password` — Request OTP untuk reset password
- POST `/api/verify-otp` — Verify OTP reset password
- POST `/api/reset-password` — Reset password dengan OTP valid
- POST `/api/change-password` — Change password (authenticated)

**Token expiration:**
- Web (staf/admin): 8 jam
- Mobile (pembeli): 7 hari (ketika Flutter ready)

**Storage:**
- Web: `sessionStorage` (tidak `localStorage` untuk security)
- Mobile (nanti): `flutter_secure_storage`
2. Backend mengembalikan Bearer token
3. Client menyertakan header `Authorization: Bearer <token>` di setiap request
4. `/api/auth/logout` menghapus token dari database

**Token expiration:**
- Web (staf/admin): 8 jam
- Mobile (pembeli): 7 hari

## 🎨 Design System

Desain UI/UX mengikuti spesifikasi di **[design.md](./design.md)** yang bersumber dari Figma file "Mediva — Login & Beranda".

**Key Points:**
- Primary Color: `#3B82F6` (Blue)
- Font: Inter
- Layout: Sidebar navigation (web), Bottom navigation (mobile)
- Component library: shadcn/ui (web), Material 3 (mobile)

## 📝 Development Guidelines

### Untuk Developer

1. **Baca PRD.md terlebih dahulu** — source of truth untuk semua keputusan
2. **Ikuti konvensi di agent.md** — coding standards & best practices
3. **Update dokumentasi** — setiap perubahan signifikan harus update PRD/Roadmap
4. **Test before commit** — minimal unit test untuk business logic
5. **Authorization di backend** — frontend hanya menyembunyikan UI, bukan security boundary

### Untuk AI Agent

Lihat **[workflow.md](./workflow.md)** untuk aturan lengkap tentang:
- Kapan harus merujuk dokumentasi
- Bagaimana membuat keputusan implementasi
- Bagaimana menangani ambiguitas
- Kapan harus bertanya vs autonomous decision

## 🚧 Known Issues & Limitations

### Critical Issues (Harus Diperbaiki)
- ⚠️ **OrderService** menggunakan status `'pending'` yang tidak ada di migration
- ⚠️ **API Routes** authorization salah: `updateOrderStatus` & `validateResep` masih `role:admin` (harusnya `role:staf`)
- ⚠️ **orders table** tidak support POS walk-in (user_id NOT NULL, missing created_by & order_source)

### Not Implemented Yet
- ❌ **Mobile Flutter** — Folder `Mobile/` tidak ada, perlu dibuat dari nol
- ❌ **Product Catalog API** — Hanya `count()` endpoint, belum ada full CRUD
- ❌ **KategoriController** — Belum ada
- ❌ **ObatService** — Business logic layer belum ada
- ❌ **AI Service** — Database ready (pgvector), service belum implementasi
- ❌ **Recommendation Service** — Belum implementasi
- ❌ **Midtrans Integration** — Columns ada, integration belum
- ❌ **Notification Service** — Table ada, service & triggers belum
- ❌ **Dashboard real data** — Placeholder only, no aggregation queries
- ❌ **Laporan PDF/Excel** — Belum implementasi
- ❌ **Web pages** — CRUD Obat, Stok, Pesanan, Resep, Kasir, Laporan semua belum ada

### Partial Implementation
- ⚠️ **OrderController** — Endpoints ada tapi ada bugs (status & authorization)
- ⚠️ **ResepController** — Endpoints ada tapi authorization salah
- ⚠️ **Web Dashboard** — Structure ada, data belum

Lihat **[PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)** untuk detail lengkap semua issues & tasks.

## 📄 License

Academic project — mata kuliah Rekayasa Perangkat Lunak.

## 👥 Team

Project 3 — Mediva Smart Medicine Platform

## 📞 Contact

Untuk pertanyaan atau diskusi, lihat dokumentasi di PRD.md atau contact team.
