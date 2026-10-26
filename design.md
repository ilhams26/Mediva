# design.md — Panduan Desain & Implementasi Frontend Web Mediva (React)

Dokumen ini diturunkan dari file Figma **"Mediva — Login & Beranda"** (file key `YlDtDRwED0dGNXCaMcbTnz`), diperbarui 24 Oktober 2026 setelah perbaikan Figma (lihat bagian 7). Dipakai AI agent dan developer sebagai acuan membangun frontend web (staf & admin) dengan React.js. Aplikasi mobile (Flutter) di luar cakupan dokumen ini. Rujuk juga `PRD.md`, `workflow.md`, `agent.md`.

**Penanda keandalan** (baca dulu):
- **[Figma]** = nilai dibaca langsung dari desain. Ikuti persis.
- **[Usulan]** = tidak ada di desain (state, responsif, dialog, dll). Boleh diubah pemilik proyek.
- **[Cek]** = ambigu atau tidak konsisten di Figma. Tanyakan ke pemilik proyek sebelum mengimplementasikan.

---

## 1. Design Tokens

Taruh di `src/styles/tokens.css` dan impor sekali di entry point. Jangan menulis hex langsung di komponen.

```css
:root {
  /* Warna — [Figma] */
  --color-bg-page: #eaf5ff;
  --color-bg-sidebar: #dceeff;
  --color-surface: #ffffff;
  --color-chip: #eaf5ff;            /* kotak ikon di StatCard */
  --color-primary: #1565c0;         /* tombol utama, header tabel, link */
  --color-accent: #42a5f5;          /* dekorasi & grafik saja. JANGAN untuk teks atau latar teks putih */
  --color-nav-active: #1565c0;      /* menu sidebar aktif (teks putih) */
  --color-border-strong: #72bbee;   /* border card/panel dashboard */
  --color-border-soft: #d6e8fa;     /* border input login */
  --color-text-strong: #0d2f5e;     /* judul, angka */
  --color-text-muted: #4a6f9c;      /* label, isi tabel */
  --color-text-sidebar: #0b3c6f;    /* menu tidak aktif */
  --color-chart-bar: rgba(66, 165, 245, 0.75);
  --color-success-bg: #c8f7cd;      /* latar badge "Aman" (setelah perbaikan kontras) */
  --color-success-text: #1b5e20;    /* teks badge "Aman" */

  /* Warna status tambahan — [Usulan] (diambil dari palet Kinara lama) */
  --color-warning: #ff9800;
  --color-danger: #f44336;

  /* Tipografi — [Figma] */
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;

  /* Border — [Figma, seragam 2px] */
  --border-width-card: 2px;

  /* Radius — [Figma] */
  --radius-xs: 5px;   /* tombol & input di halaman dashboard, badge */
  --radius-sm: 8px;   /* header tabel, batang grafik */
  --radius-md: 12px;  /* menu aktif, chip ikon, input & tombol login */
  --radius-lg: 16px;  /* StatCard */
  --radius-xl: 20px;  /* Panel besar */
  --radius-2xl: 28px; /* kartu login */

  /* Bayangan — [Figma] */
  --shadow-stat: 0 6px 16px rgba(15, 51, 102, 0.08);
  --shadow-panel: 0 8px 20px rgba(15, 51, 102, 0.06);
  --shadow-login: 0 24px 60px rgba(21, 101, 192, 0.22);
  --shadow-cta: 0 10px 24px rgba(42, 136, 225, 0.4);

  /* Layout — [Figma] */
  --sidebar-width: 260px;
  --page-padding: 24px;
  --grid-gap: 24px;
}
```

### Skala tipografi [Figma] (font Inter)

| Peran | Ukuran / berat | Warna |
|---|---|---|
| Judul halaman ("Dashboard Staff") | 32 / Bold | `--color-text-strong` |
| Subjudul halaman | 16 / Medium | `--color-text-strong` |
| Judul panel ("Grafik Transaksi") | 16 / SemiBold | `--color-text-strong` |
| Angka StatCard | 22 / Bold | `--color-text-strong` |
| Label StatCard | 12 / Regular | `--color-text-muted` |
| Menu sidebar | 13 / SemiBold | `--color-text-sidebar` (aktif: putih) |
| Header tabel | 12 / Bold | putih |
| Isi tabel | 12 / Regular | `--color-text-muted` |
| Tombol | 12 / SemiBold | putih |
| Label sumbu grafik | 10 / Regular | `--color-text-muted` |
| Peran pengguna ("STAFF" / "ADMIN") | 12 / Bold | `--color-primary` |
| Merek di kartu login | 22 / Bold | `--color-primary` |
| Input & teks pendukung login | 13 / Regular | `--color-text-muted` |

Font tunggal **Inter**. Teks tanggal dan tombol "Filter" yang tadinya Poppins sudah diganti ke Inter di Figma.

**[Usulan]** Ukuran 10–12px untuk isi tabel dan label cukup kecil. Pertimbangkan minimal 13–14px untuk isi tabel.

---

## 2. Layout (AppShell)

Desain dibuat pada kanvas **1440 × 900**.

- **Grid:** `grid-template-columns: var(--sidebar-width) 1fr`. Sidebar tetap 260px, tinggi penuh.
- **Konten:** mulai 24px dari sidebar, margin kanan 24px, lebar 1132px pada desain. Jangan fixed, buat fluid dengan `padding: var(--page-padding)`.
- **Baris StatCard:** 4 kolom sama lebar, gap 24px (4 × 260 + 3 × 24 = 1132).
- **Baris panel:** panel utama (700) + panel samping (412) dengan gap 20px = 1132. Gunakan `grid-template-columns: 1fr 412px`.
- **Header halaman:** judul + subjudul di kiri atas (top 24px). Kanan atas: tanggal, label peran, ikon avatar 42px.

**[Usulan] Responsif** (desain hanya desktop):
- ≥1280px: sesuai desain.
- 1024–1279px: StatCard 2×2, panel samping turun di bawah panel utama.
- <1024px: sidebar jadi drawer (tombol menu di header), satu kolom, tabel dibungkus `overflow-x: auto`.

---

## 3. Komponen

Bangun sebagai komponen kecil di `src/components/`. Semua nilai ukuran dari Figma.

**Sidebar**
- Lebar 260, latar `--color-bg-sidebar`. Logo (gambar `Logo_Mediva`, 197 × 87) di kiri-atas (offset 8, 14). Ekspor logo dari Figma sebagai aset lokal; jangan memakai URL sementara Figma (kedaluwarsa 7 hari).
- **SidebarItem:** lebar 228, tinggi 42, radius 12, margin kiri 16, jarak antar item 52px. Ikon di x=37–40, label di x=71. Aktif: latar `--color-nav-active`, teks putih. Tidak aktif: teks `--color-text-sidebar`.
- "Logout" terpaku di bawah (y≈820), opasitas 0.85, ikon `fluent:arrow-enter-16-filled`.
- Menu per peran: lihat bagian 5.

**PageHeader** — judul (32/Bold), subjudul (16/Medium), tanggal, peran + avatar (`iconamoon:profile-circle-bold`, 42px).

**StatCard** — 260 × 170, putih, radius 16, `--shadow-stat`, border `var(--border-width-card)` warna `--color-border-strong`. Chip ikon 40 × 40 (radius 12, `--color-chip`) di kiri-atas, label (12) di bawahnya, angka (22 Bold).

**Panel** — kartu putih radius 20, `--shadow-panel`, border `var(--border-width-card)` warna `--color-border-strong`. Judul 16 SemiBold padding 24.

**Button (primary)** — latar `--color-primary`, teks putih 12 SemiBold, radius 5, tinggi 38 (di halaman tabel: "+ Tambah Obat" lebar 112). Varian login: latar `--color-primary`, tinggi 48, radius 12, `--shadow-cta`.

**SearchInput** — putih, border 0.5px hitam, radius 5, tinggi 38, lebar 197, placeholder "Telusuri nama obat" warna `--color-primary`.

**DateRangeFilter** — dua input tanggal (131 × 30, border 0.5px hitam, radius 5, ikon `lets-icons:date-today-light`) dipisah "-", lalu tombol "Filter" (75 × 30, `--color-primary`).

**DataTable** — header bar latar `--color-primary`, tinggi 40, radius 8, teks putih 12 Bold. Baris tinggi ±67 dengan garis pemisah 1px; isi 12 Regular `--color-text-muted`. Kolom aksi: ikon edit `ci:note-edit` (22px) dan hapus `basil:trash-solid` (24px).

**StatusBadge** — 61 × 20, radius 5, 12 SemiBold. State di Figma: "Aman" (latar `--color-success-bg`, teks `--color-success-text`). **[Usulan]** "Menipis" (latar kuning muda, teks cokelat tua), "Habis" / "Kedaluwarsa" (latar merah muda, teks merah tua), semuanya dengan kontras ≥ 4,5:1.

**BarChart** — 7 batang lebar 36, radius 8, `--color-chart-bar`, label tanggal di bawah. Gunakan Recharts (`BarChart`, radius atas 8, warna dari token). **DonutChart** (dashboard admin, "Metode Pembayaran") + legenda di bawah.

**EmptyState** — teks tengah 12, `--color-text-muted` (contoh: "Belum ada notifikasi", "Belum ada pesanan masuk.").

**Ikon** — di Figma memakai set Iconify. Pakai `@iconify/react` dengan nama berikut:

| Tempat | Ikon |
|---|---|
| Beranda | `ant-design:home-filled` |
| Kasir | `hugeicons:cashier-02` |
| Logout, "Obat Masuk" | `fluent:arrow-enter-16-filled` |
| Antrean Pesanan | `lsicon:order-filled` |
| Obat Menipis | `ant-design:warning-filled` |
| Notifikasi kosong | `hugeicons:medicine-02` |
| Kelola Pengguna | `gravity-ui:person-pencil` |
| Batch stok | `fluent:cube-multiple-20-filled` |
| Tombol Sesuaikan | `arcticons:settings` |

Ikon "Kelola Obat", "Kelola Stok", "Laporan", "Pesanan", dan "Jumlah Obat" berupa vektor kustom: ekspor SVG dari Figma ke `src/assets/icons/`.

---

## 4. Halaman (peta Figma → route)

| Route | Peran | Frame Figma (ID) | Isi utama |
|---|---|---|---|
| `/login` | semua | Login (`1:2`) | kartu login, area robot 3D |
| `/` | staf | Beranda (`1:15`) | 4 StatCard (Jumlah Obat, Antrean Pesanan, Obat Masuk, Obat Menipis), Grafik Transaksi + filter tanggal, panel Notifikasi |
| `/` | admin | Beranda admin (`95:435`) | StatCard (Pendapatan Bulan Ini, Total Obat Real, Pesanan Selesai, Obat Menipis), Grafik Transaksi, donut "Metode Pembayaran" |
| `/obat` | staf | Kelola Obat (`14:921`) | tabel Kode, Nama Obat, Kategori, Stok, Status, Aksi; pencarian; "+ Tambah Obat" |
| `/obat` | admin | Data Obat (`21:1123`) | tabel yang sama **tanpa kolom Aksi dan tanpa tombol tambah** (hanya lihat) |
| `/stok` | staf | Kelola Stok (`14:954`) | tabel Nama Obat, Total Stok Real, Detail Batch (Kadaluarsa, Sisa & Aksi) dengan tombol "Sesuaikan"; "+ Tambah Stok" |
| `/laporan` | staf, admin | Laporan (`14:985`, `21:1194`) | filter tanggal; tabel No, Tanggal, Nama Obat, Pemasukan, Pengeluaran, Stok Akhir + baris TOTAL; "Export Excel", "Cetak PDF" |
| `/kasir` | staf | Kasir (`14:1031`) | "Katalog Obat" (pencarian, grid kartu produk 220 × 140) + panel "Keranjang" (total, uang diterima, "Bayar Sekarang") |
| `/pesanan` | staf | Pesanan (`14:1065`) | tabel "Daftar Pesanan Masuk" (Kode Pesanan, Pembeli, Metode, Total, Status, Detail) + panel "Validasi Resep Obat Keras" |
| `/pengguna` | admin | Kelola Pengguna (`21:1050`) | tabel Kode, Nama Pengguna, Username, Peran, Aksi; "+ Tambah Pengguna" |

### Halaman Login (`1:2`) — **masih draf: area robot menunggu aset 3D (bagian 9)**
- Latar putih dengan tiga blob biru terblur (lingkaran besar, `filter: blur`) dan tiga kapsul dekoratif miring (dua warna `--color-accent`/`--color-primary` + putih).
- Kartu 400 × 560, putih 92% opasitas, border putih, radius 28, `--shadow-login`, terpusat.
- Isi kartu: area robot 240 × 240 menonjol di atas kartu (offset −121px, tepi putus-putus pada draf), lockup logo + "Mediva", teks "Smart Medicine Platform - masuk ke akun Anda", dua input (336 × 48, radius 12, border `--color-border-soft`), tombol "Masuk", tautan "Lupa sandi?", teks versi.
- Buat `<RobotSlot />` kosong dulu. Nanti diisi canvas React Three Fiber (kepala mengikuti kursor).

---

## 5. Peran, menu, dan route guard

```js
// src/config/nav.js — menu mengikuti Figma
export const NAV = {
  staf: [
    { label: 'Beranda', to: '/' },
    { label: 'Kelola Obat', to: '/obat' },
    { label: 'Kelola Stok', to: '/stok' },
    { label: 'Laporan', to: '/laporan' },
    { label: 'Kasir', to: '/kasir' },
    { label: 'Pesanan', to: '/pesanan' },
  ],
  admin: [
    { label: 'Beranda', to: '/' },
    { label: 'Kelola Pengguna', to: '/pengguna' },
    { label: 'Data Obat', to: '/obat' },
    { label: 'Laporan', to: '/laporan' },
  ],
};
```

- `ProtectedRoute` mengecek login dan peran. Pembeli ditolak dari seluruh web.
- Frontend **hanya menyembunyikan menu**. Otorisasi sebenarnya ada di backend (PRD §17).
- Nilai peran mengikuti database: `admin`, `staf`, `pembeli`.

---

## 6. Integrasi & kebiasaan UI

- **Autentikasi: token Sanctum (Bearer).** Satu instance axios, token ditempel otomatis, respons 401 membersihkan token dan mengarahkan ke `/login`:

```js
// src/services/tokenStore.js — token di memori + sessionStorage (bukan localStorage)
let token = sessionStorage.getItem('mediva_token');
export const getToken = () => token;
export const setToken = (t) => { token = t; sessionStorage.setItem('mediva_token', t); };
export const clearToken = () => { token = null; sessionStorage.removeItem('mediva_token'); };
```

```js
// src/services/api.js
import axios from 'axios';
import { getToken, clearToken } from './tokenStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export default api;
```

  Jangan memakai `dangerouslySetInnerHTML`, karena token yang bisa dibaca JavaScript rentan bila terjadi XSS. Masa berlaku token web dibuat pendek (lihat `PRD.md` §16).
- Semua pemanggilan API lewat `src/services/` (satu instance axios, base URL dari `import.meta.env`), bukan langsung di komponen.
- Format respons backend: `{ status, message, data }`. Error validasi 422 ditampilkan di bawah input terkait.
- **[Usulan] State yang belum didesain:** hover/focus/disabled tombol dan input, skeleton loading tabel, toast sukses/gagal (di desain mobile ada toast "Berhasil Menambahkan" yang bisa jadi acuan gaya), dialog konfirmasi hapus, halaman 404/403.
- **[Usulan]** Pagination 10 baris per halaman untuk tabel.
- Format uang `Rp 20.000` (`Intl.NumberFormat('id-ID')`); tanggal `27-09-2026 12:54`.

---

## 7. Status keputusan & catatan

### Sudah diputuskan pemilik proyek (24 Oktober 2026)
1. **Peran admin mengikuti Figma:** admin hanya memantau (Beranda admin, Kelola Pengguna, Data Obat hanya lihat, Laporan PDF/Excel). `PRD.md` v1.1 sudah disamakan.
2. **Login boleh tetap draf:** area robot menunggu aset 3D. Langkah pembuatannya ada di bagian 9.
3. **Lebar border seragam 2px** (token `--border-width-card`).
4. **Autentikasi memakai token Sanctum (Bearer) untuk web dan mobile.** Tidak ada JWT dan tidak ada cookie SPA. `PRD.md` §16 sudah disamakan.
5. **Font tunggal Inter.** Poppins diganti di Figma dan di dokumen ini.

### Sudah diperbaiki di Figma (24 Oktober 2026)
- Border 3px → 2px di semua frame web (9 elemen).
- Kontras warna: kotak menu aktif `#42a5f5` → `#1565c0` (10 elemen), tombol Masuk → `#1565c0`, badge "Aman" jadi latar `#c8f7cd` + teks `#1b5e20` (4 elemen), teks biru muda kecil ("STAFF"/"ADMIN", tanggal) → `#1565c0` (10 elemen).
- Layer ganda di panel grafik Beranda staf (`8:569`) dihapus. Frame lama "Kelola Obat" (`9:526`) **disembunyikan dan diberi nama "ARSIP"**. Hapus manual bila sudah yakin.
- Judul, subjudul, label peran, dan avatar di frame Kelola Obat sekarang berada di dalam frame (sebelumnya lepas di kanvas).
- Teks "v1.0" di kartu login digeser ke dalam kartu.
- Font Poppins diganti Inter pada 9 teks (tanggal dan tombol "Filter"). Tidak ada Poppins tersisa di frame web.
- Salah ketik diperbaiki (6 teks): "pergerakkan" → "pergerakan", "onlline" → "online", "Detai" → "Detail", "Member KinaraPharma" → "Member Mediva".

### Kontras setelah perbaikan (hitungan WCAG, minimal 4,5:1 untuk teks kecil)

| Kombinasi | Rasio | Hasil |
|---|---|---|
| putih di `#1565c0` (menu aktif, tombol) | 5,75 | lulus |
| `#1b5e20` di `#c8f7cd` (badge) | 6,61 | lulus |
| `#1565c0` di `#eaf5ff` (label peran, tanggal) | ±5,2 | lulus |
| `#4a6f9c` di putih / di `#eaf5ff` | 5,19 / 4,70 | lulus |
| `#0d2f5e` di putih | 13,25 | lulus |

Aturan: `--color-accent` (`#42a5f5`) hanya untuk dekorasi dan grafik. Jangan dipakai sebagai warna teks atau latar teks putih (rasio putih di `#42a5f5` hanya 2,65).

### Masih terbuka
1. **[Usulan]** Halaman Login belum memakai aset logo asli, ruang kosong di bawah kartu masih ada, dan latarnya masih putih (dashboard memakai `#eaf5ff`). Rapikan saat robot sudah masuk.
2. **[Usulan]** State yang belum didesain (hover, focus, disabled, loading, error, dialog konfirmasi hapus, 404/403) dan versi responsif.

## 8. Urutan pengerjaan frontend

1. `tokens.css`, font Inter, struktur folder (`components`, `pages`, `layouts`, `services`, `hooks`, `context`, `routes`, `utils`).
2. `AppShell` (Sidebar + PageHeader) dan `ProtectedRoute` dengan data peran palsu.
3. Komponen dasar: Button, SearchInput, Panel, StatCard, DataTable, StatusBadge, EmptyState.
4. Halaman Login (tanpa robot) + alur autentikasi.
5. Dashboard staf → Kelola Obat → Kelola Stok → Laporan → Kasir → Pesanan.
6. Halaman admin: Dashboard admin, Kelola Pengguna, Data Obat (baca saja).
7. State loading/error/kosong, responsif, lalu `<RobotSlot />` dengan model 3D.

**Selesai kalau:** setiap halaman cocok dengan screenshot Figma pada lebar 1440px, tidak ada hex di luar `tokens.css`, dan menu serta route sesuai peran.

---

## 9. Area robot 3D di halaman Login (dikerjakan nanti)

Saat ini `<RobotSlot />` hanya placeholder (kotak 240 × 240 yang menonjol di atas kartu login). Urutan membuat robot, saat kamu siap:

1. **Generate di Tripo** memakai prompt robot full body (pose kedua telapak tangan terbuka di depan dada). Referensi: foto robot dari demo Three.js bisa diunggah sebagai gambar acuan.
   ```
   A friendly futuristic AI assistant robot mascot for a healthcare app, rounded soft-edged design, glossy white plastic body with bright blue glossy accents, smooth spherical head slightly larger than the torso, a dark navy oval visor across the face, two small glowing cyan eye lights embedded in the visor, no visible mouth, a thin antenna on top of the head with a small glowing green tip light, rounded cylindrical torso, two short rounded arms bent forward with both palms open and facing up at chest height as if presenting or holding a flat object, small rounded ear-like side modules on the head, clean seamless surface with subtle panel lines, high-gloss clearcoat plastic material, soft studio lighting, symmetrical front-facing neutral standing pose, modern minimalist sci-fi product design style, smooth huggable proportions, no sharp edges, single character centered, clean topology suitable for rigging, plain neutral background
   ```
2. **Segmentasi di Tripo** (menu Segment): pilih **Simple (2–6 bagian)** supaya kepala terpisah dari badan. Jangan pilih Detailed.
3. **Ekspor GLB.** Simpan sebagai `public/models/mediva-robot.glb`. Target ukuran di bawah 2–3 MB. Kalau lebih besar, kecilkan dengan `gltf-transform` (kompresi Draco) atau kurangi jumlah poligon.
4. **Cek nama node kepala** di hasil ekspor (buka file di gltf.report atau Spline). Contoh: `Head`. Sesuaikan nama pada kode di bawah. Kalau kepala tidak terpisah, putar seluruh robot sedikit saja (hapus bagian `head`).
5. **Pasang dependensi:** `npm i three @react-three/fiber @react-three/drei`.
6. **Komponen kerangka** (ganti isi `<RobotSlot />`):

```jsx
// src/components/RobotScene.jsx
import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Robot({ pointer }) {
  const { scene, nodes } = useGLTF('/models/mediva-robot.glb');
  const head = nodes.Head; // sesuaikan dengan nama node hasil segmentasi

  useFrame((_, delta) => {
    const target = head ?? scene;
    const k = Math.min(1, delta * 6); // kehalusan gerak
    target.rotation.y += (pointer.current.x * 0.5 - target.rotation.y) * k;
    target.rotation.x += (-pointer.current.y * 0.3 - target.rotation.x) * k;
  });

  return <primitive object={scene} />;
}

export default function RobotScene() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // lacak kursor di seluruh jendela, bukan hanya di atas kanvas
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 35 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 3, 4]} intensity={1} />
      <Suspense fallback={null}>
        <Robot pointer={pointer} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/models/mediva-robot.glb');
```

7. **Kebiasaan yang perlu ada:** hormati `prefers-reduced-motion` (matikan gerak kepala), tampilkan kotak placeholder bila WebGL tidak tersedia, dan pastikan form login tetap bisa dipakai walau model gagal dimuat.

**Selesai kalau:** kepala mengikuti kursor dengan halus, kedua tangan terlihat menopang tepi atas kartu, model dimuat di bawah 2 detik pada koneksi biasa, dan login tetap berfungsi tanpa robot.

Catatan: ikon asisten kecil di pojok kanan bawah (kepala saja) ada di aplikasi mobile Flutter, di luar dokumen ini. Prompt Tripo untuk kepala saja ada di percakapan sebelumnya.