# FRONTEND_ROADMAP.md — Mediva Web Admin/Staf (React)

Roadmap lengkap 11 halaman frontend web Mediva, dengan urutan pengerjaan 8 tahap untuk mencapai 4 halaman demo dalam 5 jam.

**Target presentasi:** 4 halaman screenshot-ready untuk dosen sebelum melanjutkan backend.

**Lebar desain:** 1440px. Responsif nantinya.

---

## Ringkasan 11 Halaman

### Peran: Staff
1. **Dashboard Staf** (/) — StatCard (4 metrik), Grafik Transaksi, Notifikasi panel
2. **Kelola Obat** (/obat) — Tabel obat 5 kolom (Kode, Nama, Kategori, Stok, Status), pencarian, "+ Tambah"
3. **Kelola Stok** (/stok) — Tabel batch stok, detail kadaluarsa, panel "+ Sesuaikan"
4. **Laporan** (/laporan) — Filter tanggal, tabel transaksi 7 kolom, Export/Cetak
5. **Kasir** (/kasir) — Grid katalog obat + side panel keranjang & bayar
6. **Pesanan** (/pesanan) — Tabel daftar pesanan, panel validasi resep obat keras

### Peran: Admin
7. **Dashboard Admin** (/) — StatCard (4 metrik berbeda), Grafik Transaksi, Donut Metode Pembayaran
8. **Kelola Pengguna** (/pengguna) — Tabel user 4 kolom (Kode, Nama, Username, Peran), "+ Tambah"
9. **Data Obat** (/obat) — Tabel obat (view-only, tanpa Aksi, tanpa "+ Tambah")
10. **Laporan** (/laporan) — Sama dengan staf (filter tanggal, Export/Cetak)

### Peran: Semua
11. **Login** (/login) — Kartu login 400×560, placeholder robot 3D (masih draf)

---

## Tahap 1: Setup Design System & Struktur Folder (30 menit)

### Tujuan
- Siapkan tokens.css dengan semua warna, font, spacing, shadow dari design.md
- Impor font Inter dari Unpkg atau import lokal
- Setup folder struktur React
- Setup .env untuk API URL

### File yang dibuat

1. **src/styles/tokens.css** — warna, tipografi, spacing, radius, shadow
2. **src/styles/global.css** — reset CSS, warna latar halaman
3. **src/components/** — folder kosong untuk tahap berikutnya
4. **src/pages/** — folder kosong
5. **src/layouts/** — folder kosong
6. **src/services/** — folder kosong
7. **src/hooks/** — folder kosong
8. **src/routes/** — folder kosong
9. **src/utils/** — folder kosong
10. **.env.local** — \VITE_API_URL=http://localhost:8000/api\
11. **vite.config.js** — cek sudah ada (buat baru kalau perlu)
12. Update **package.json** — axios, react-router-dom, @iconify/react

### Checklist
- [ ] tokens.css memiliki semua warna (primary, bg-page, bg-sidebar, dll)
- [ ] global.css mengimpor font Inter
- [ ] Folder struktur rapi di src/
- [ ] package.json sudah install dependencies

---

## Tahap 2: Layout Infrastructure (Sidebar, PageHeader, AppShell, nav.js) (45 menit)

### Tujuan
- Buat Sidebar dengan menu staf/admin mengikuti Figma
- Buat PageHeader (judul halaman + peran + avatar)
- Buat AppShell wrapper
- Buat ProtectedRoute dengan fake auth (data pembuat acuan)
- Buat routes config (nav.js)

### File yang dibuat

1. **src/components/Sidebar.jsx** — Logo, menu items, logout
2. **src/components/PageHeader.jsx** — Judul halaman, peran, avatar, tanggal
3. **src/layouts/AppShell.jsx** — grid 2 kolom (sidebar + konten)
4. **src/routes/ProtectedRoute.jsx** — middleware cek login & peran
5. **src/config/nav.js** — menu per peran (staf/admin)
6. **src/App.jsx** — setup BrowserRouter, route definisi
7. **src/context/AuthContext.jsx** — store peran, token, user (fake data dulu)
8. **src/main.jsx** — impor App, provider (wrap AuthContext)

### Komponen Sidebar
- Lebar 260px, latar --color-bg-sidebar
- Logo placeholder (bisa pakai teks "Mediva" dulu, gambar Figma nanti)
- Menu items dari 
av.js sesuai peran
- Logout di bawah

### Komponen PageHeader
- Judul halaman (32 Bold)
- Subjudul (16 Medium) — opsional per halaman
- Tanggal (13 Regular, --color-text-muted)
- Label peran ("STAFF" / "ADMIN", 12 Bold, --color-primary)
- Avatar placeholder (42px, icon)

### Komponen AppShell
- Grid grid-template-columns: var(--sidebar-width) 1fr
- Sidebar tetap 260px
- Main konten dengan padding 24px

### ProtectedRoute
- Cek token dari AuthContext
- Cek peran user vs halaman
- Redirect ke /login jika tidak autentikasi
- Redirect ke 403 jika peran tidak sesuai

### Checklist
- [ ] Sidebar render menu sesuai peran
- [ ] PageHeader tampil di atas halaman
- [ ] AppShell layout 260px + fluid content
- [ ] ProtectedRoute blok akses pembeli & role tidak sesuai
- [ ] nav.js menu staf & admin sesuai Figma

---

## Tahap 3: UI Components (StatCard, Button, DataTable, SearchInput, dll) (50 menit)

### Tujuan
- Buat 8 komponen dasar reusable
- Pastikan styling dari tokens.css, semua value dari Figma

### Komponen yang dibuat

1. **StatCard.jsx** — 260×170, putih, radius 16, shadow, chip ikon + label + angka
   - Props: label, value, icon, bgColor
   - Contoh: <StatCard label="Jumlah Obat" value="1.245" icon="ant-design:home-filled" />

2. **Button.jsx** — primary, secondary, danger (optional)
   - Props: children, variant, size, disabled, onClick
   - Styling dari tokens (--color-primary, --radius-xs)
   - Contoh: <Button onClick={...}>+ Tambah Obat</Button>

3. **SearchInput.jsx** — lebar 197, border putih, radius 5, placeholder "Telusuri..."
   - Props: value, onChange, placeholder
   - Styling dari tokens

4. **Panel.jsx** — kartu putih, radius 20, shadow, border, judul di dalam
   - Props: title, children
   - Contoh: <Panel title="Grafik Transaksi">{chart}</Panel>

5. **DataTable.jsx** — header biru 40px, baris dengan garis pemisah, kolom aksi (edit/hapus)
   - Props: columns (array header), data (array baris), onEdit, onDelete, loading
   - Columns: [{ key: 'nama', label: 'Nama Obat' }, ...]
   - Baris 67px tinggi, teks 12 Regular

6. **StatusBadge.jsx** — "Aman", "Menipis", "Habis", warna sesuai
   - Props: status
   - Styling dari tokens (warna sukses, warning, danger)

7. **SearchDateRangeFilter.jsx** — search box + tanggal dari-ke + tombol Filter
   - Props: onSearch, onFilter, defaultRange
   - Contoh: <SearchDateRangeFilter onSearch={...} onFilter={...} />

8. **EmptyState.jsx** — teks tengah, placeholder
   - Props: message, icon
   - Contoh: <EmptyState message="Belum ada pesanan masuk." />

### Paket ikon
- Setup @iconify/react dengan ikon dari Figma
- Pakai <Icon icon="ant-design:home-filled" /> di komponen

### Checklist
- [ ] StatCard styling cocok Figma (260×170, shadow, border)
- [ ] Button primary latar --color-primary, teks putih
- [ ] SearchInput border halus, placeholder jelas
- [ ] Panel dengan judul 16 SemiBold
- [ ] DataTable header biru, baris 67px
- [ ] StatusBadge warna sesuai status
- [ ] EmptyState teks centered, --color-text-muted
- [ ] Semua ikon dari Iconify

---

## Tahap 4: 4 Halaman Demo (Dashboard Staf, Kelola Obat, Dashboard Admin, Kelola Pengguna) (90 menit)

### Tujuan
- Buat 4 halaman untuk presentasi dosen
- Styling dari Figma, data palsu (mock data), layout cocok 1440px
- Siap screenshot

### Halaman 1: Dashboard Staf (/)

**File:** src/pages/DashboardStaf.jsx

**Isi:**
- PageHeader ("Dashboard Staf", tanggal)
- 4 StatCard row (4 kolom, gap 24px):
  - "Jumlah Obat" (icon), 1245
  - "Antrean Pesanan" (icon), 38
  - "Obat Masuk Hari Ini" (icon), 12
  - "Obat Menipis" (icon), 5
- Panel "Grafik Transaksi" 700px (BarChart 7 batang, label sumbu X tanggal, sumbu Y angka)
- Panel samping "Notifikasi" 412px (3-4 item teks, atau EmptyState)
- Grid: 1 row StatCard, 1 row 2 panel (700+412+gap)

**Data palsu:**
`js
const mockStats = [
  { label: 'Jumlah Obat', value: 1245, icon: 'mdi:pill' },
  { label: 'Antrean Pesanan', value: 38, icon: 'mdi:file-document' },
  { label: 'Obat Masuk Hari Ini', value: 12, icon: 'fluent:arrow-enter-16-filled' },
  { label: 'Obat Menipis', value: 5, icon: 'ant-design:warning-filled' },
];
const mockChart = [
  { tanggal: '21 Sep', transaksi: 120 },
  { tanggal: '22 Sep', transaksi: 200 },
  // ...7 hari
];
const mockNotif = [
  'Obat aspirin stok menipis (sisa 2 dus)',
  'Batch paracetamol kadaluarsa 27-09-2026',
  // ...atau EmptyState
];
`

**Checklist:**
- [ ] StatCard layout 4 kolom, 260px masing-masing
- [ ] StatCard angka 22 Bold, label 12, shadow & border sesuai
- [ ] Grafik bar dengan Recharts (sumbu X tanggal, sumbu Y angka)
- [ ] Panel Notifikasi jika kosong pakai EmptyState
- [ ] Spacing antara row = 24px
- [ ] Layout cocok 1440px, sidebar 260 + konten 1132

### Halaman 2: Kelola Obat (/obat) — Staf

**File:** src/pages/KelolaObat.jsx

**Isi:**
- PageHeader ("Kelola Obat", "Manajemen data obat di sistem")
- SearchInput + "+ Tambah Obat" button (row 1)
- DataTable (5 kolom: Kode, Nama Obat, Kategori, Stok, Status; kolom Aksi: edit/hapus)
- 10 baris mock, loading state opsional
- Pagination opsional (10 per halaman)

**Data palsu:**
`js
const mockObats = [
  { kode: 'OB001', nama: 'Paracetamol 500mg', kategori: 'Analgesik', stok: 245, status: 'Aman' },
  { kode: 'OB002', nama: 'Aspirin 100mg', kategori: 'Antiinflamasi', stok: 8, status: 'Menipis' },
  // ...8 item lagi
];
`

**Kolom tabel:**
- Kode (12 Regular --color-text-muted)
- Nama Obat (12 Regular)
- Kategori (12 Regular)
- Stok (12 Regular)
- Status (StatusBadge, "Aman" hijau / "Menipis" kuning / "Habis" merah)
- Aksi (2 ikon: edit + hapus, cursor pointer)

**Checklist:**
- [ ] SearchInput lebar 197, padding 12, radius 5
- [ ] "+ Tambah Obat" button primary 112 lebar
- [ ] Header tabel biru --color-primary, teks putih 12 Bold
- [ ] Baris 67px tinggi, garis pemisah 1px
- [ ] StatusBadge warna sesuai
- [ ] Ikon edit/hapus clickable (dummy onClick dulu)
- [ ] Jika kosong pakai EmptyState

### Halaman 3: Dashboard Admin (/)

**File:** src/pages/DashboardAdmin.jsx

**Isi:**
- PageHeader ("Dashboard Admin", tanggal)
- 4 StatCard row (metrik berbeda staf):
  - "Pendapatan Bulan Ini" (icon), "Rp 45.000.000"
  - "Total Obat Real" (icon), 3200
  - "Pesanan Selesai" (icon), 156
  - "Obat Menipis" (icon), 5
- Panel "Grafik Transaksi" 700px
- Panel samping "Metode Pembayaran" 412px (DonutChart, legenda di bawah)

**Data palsu:**
`js
const mockStatsAdmin = [
  { label: 'Pendapatan Bulan Ini', value: 'Rp 45.000.000', icon: 'mdi:cash' },
  { label: 'Total Obat Real', value: 3200, icon: 'mdi:package' },
  { label: 'Pesanan Selesai', value: 156, icon: 'mdi:check-circle' },
  { label: 'Obat Menipis', value: 5, icon: 'ant-design:warning-filled' },
];
const mockDonut = [
  { name: 'Transfer Bank', value: 45, fill: '#1565c0' },
  { name: 'E-Wallet', value: 30, fill: '#42a5f5' },
  { name: 'Tunai', value: 25, fill: '#90caf9' },
];
`

**DonutChart:**
- Pakai Recharts DonutChart
- Warna dari token (biru gelap, biru medium, biru terang)
- Legenda di bawah (3 item)

**Checklist:**
- [ ] StatCard layout sama, metrik berbeda dari staf
- [ ] Grafik sama dengan staf
- [ ] Donut chart dengan legend bawah
- [ ] Angka "Rp 45.000.000" format Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })

### Halaman 4: Kelola Pengguna (/pengguna) — Admin

**File:** src/pages/KelolaUser.jsx

**Isi:**
- PageHeader ("Kelola Pengguna", "Manajemen akun staf")
- SearchInput + "+ Tambah Pengguna" button
- DataTable (4 kolom: Kode, Nama Pengguna, Username, Peran; kolom Aksi: edit/hapus)
- 10 baris mock

**Data palsu:**
`js
const mockUsers = [
  { kode: 'US001', nama: 'Budi Santoso', username: 'budi_santoso', peran: 'STAF' },
  { kode: 'US002', nama: 'Siti Rahma', username: 'siti_rahma', peran: 'STAF' },
  { kode: 'US003', nama: 'Ahmad Admin', username: 'ahmad_admin', peran: 'ADMIN' },
  // ...7 item lagi
];
`

**Checklist:**
- [ ] SearchInput lebar 197
- [ ] "+ Tambah Pengguna" button primary
- [ ] Header tabel biru, teks putih
- [ ] Baris 67px, garis pemisah
- [ ] Peran tampil sebagai label teks ("STAF" / "ADMIN")
- [ ] Ikon aksi clickable (dummy)

---

## Tahap 5+: Halaman Lainnya (Timeline Berikutnya)

Setelah 4 halaman demo disetujui:

### Tahap 5: Halaman Kasir, Kelola Stok, Pesanan (90 menit)
- **Kasir** (/kasir) — grid katalog 220×140, side panel keranjang
- **Kelola Stok** (/stok) — tabel batch, detail kadaluarsa
- **Pesanan** (/pesanan) — tabel daftar pesanan, panel validasi resep

### Tahap 6: Login & Auth (60 menit)
- Halaman Login (/login) dengan form
- Integrasi backend API (POST /api/login, POST /api/register)
- Token management (sessionStorage)
- Redirect 401 ke /login

### Tahap 7: Laporan & Export (45 menit)
- **Laporan** (/laporan) — filter tanggal, tabel transaksi, Export Excel/PDF
- Integrasikan dengan backend /api/laporan

### Tahap 8: Responsive & Refinement (60+ menit)
- Layout mobile (<1024px)
- Sidebar → drawer
- StatCard 2×2 → 1 kolom
- Tabel overflow-x
- Touch-friendly button size

### Tahap 9+: Polish & 3D Robot (waktu fleksibel)
- State loading/error/empty
- Dialog konfirmasi hapus
- Toast notif (sukses/gagal)
- Hover/focus/disabled state
- 3D robot di login (React Three Fiber, model Tripo)
- 404/403 error pages

---

## Setup Inisial (sebelum Tahap 1)

Jika belum ada folder Web/:

### Buat struktur React baru (Vite)
\\\ash
cd c:\\laragon\\www\\Mediva
npm create vite@latest Web -- --template react
cd Web
npm install
npm install axios react-router-dom @iconify/react recharts
\\\

### Atau pakai folder Web yang sudah ada
\\\ash
cd Web
npm install axios react-router-dom @iconify/react recharts
\\\

### File .env.local
\\\
VITE_API_URL=http://localhost:8000/api
\\\

---

## Timeline Ringkas

| Tahap | File | Durasi | Cumulative |
|---|---|---|---|
| 1 | tokens.css, global.css, folder struktur | 30 min | 30 min |
| 2 | Sidebar, PageHeader, AppShell, ProtectedRoute, nav.js, AuthContext | 45 min | 75 min |
| 3 | StatCard, Button, DataTable, SearchInput, Panel, StatusBadge, EmptyState, BarChart, DonutChart | 50 min | 125 min |
| 4 | DashboardStaf, KelolaObat, DashboardAdmin, KelolaUser (4 halaman) | 90 min | 215 min (3h 35min) |
| — | **Presentasi & feedback dosen** | — | — |
| 5 | Kasir, KelolaStok, Pesanan | 90 min | 305 min (5h 5min) |
| 6 | Login, API integration, auth flow | 60 min | 365 min (6h 5min) |
| 7 | Laporan, Export Excel/PDF | 45 min | 410 min (6h 50min) |
| 8 | Responsive design (<1024px) | 60+ min | 470+ min |
| 9+ | Polish, robot 3D, error states | fleksibel | — |

**Target 4 halaman (Tahap 1-4):** 3 jam 35 menit ✓

---

## Kualitas Acceptance (Tahap 1-4)

Halaman dianggap "demo-ready" jika:

1. ✓ **Layout cocok Figma pada 1440px** (tidak perlu responsive dulu)
2. ✓ **Styling semua dari tokens.css** (tidak ada hex hardcoded di JSX)
3. ✓ **Data mock jelas di file komponen** (atau file terpisah mock data)
4. ✓ **Komponen modular & reusable** (StatCard, Button, Panel, dll bisa pakai ulang)
5. ✓ **Menu & route sesuai peran** (staf vs admin melihat menu/halaman berbeda)
6. ✓ **Sidebar & header konsisten di semua halaman**
7. ✓ **Tidak ada console error** (warning boleh, tapi error harus 0)
8. ✓ **Screenshot halaman cocok dengan Figma**
9. ✓ **Commit git dengan pesan jelas** (setiap tahap)

---

## Figma Reference

File Figma: **"Mediva — Login & Beranda"** (key: YlDtDRwED0dGNXCaMcbTnz)

Frame yang dicerminkan di tahap 1-4:
- Dashboard Staff (1:15)
- Kelola Obat (14:921)
- Dashboard Admin (95:435)
- Kelola Pengguna (21:1050)
- All tokens from design.md

---

## Git Strategy

Setiap tahap commit terpisah:

\\\ash
# Tahap 1
git add src/styles/ src/config/ .env.local
git commit -m "[FEAT] Tahap 1: Design system & folder struktur"

# Tahap 2
git add src/components/Sidebar.jsx src/components/PageHeader.jsx src/layouts/ src/routes/ src/context/ src/App.jsx
git commit -m "[FEAT] Tahap 2: Layout infrastructure & AppShell"

# Tahap 3
git add src/components/StatCard.jsx src/components/Button.jsx ... (semua UI komponen)
git commit -m "[FEAT] Tahap 3: Reusable UI components"

# Tahap 4
git add src/pages/
git commit -m "[FEAT] Tahap 4: 4 halaman demo (Staf, Obat, Admin, Pengguna)"
\\\

Branch: tetap di ilham.

---

## Catatan

- **Jangan hardcode warna, ukuran, spacing di JSX.** Semua dari tokens.css.
- **Ikon dari Iconify** (@iconify/react), bukan emoji atau SVG custom dulu.
- **Data mock di file komponen atau folder src/mock/** untuk mudah diganti API nanti.
- **Tanggal format:** 27-09-2026 12:54 memakai Intl.DateTimeFormat.
- **Uang format:** \Rp 20.000.000\ memakai \Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })\.
- **Login & robot 3D boleh dikerjakan nanti** (fokus 4 halaman dashboard dulu).
- **Tidak perlu responsive** untuk Tahap 1-4 (desktop 1440px saja).

---

## Approval Gate

Setelah Tahap 4 selesai + screenshot OK:
- Tunjukkan 4 halaman ke dosen ✓
- Dapatkan feedback
- Lanjut Tahap 5-7 (halaman lainnya + login + laporan)
- Atau ubah sesuai feedback

Selesai!
