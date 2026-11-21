# Mediva — Design System & Frontend UI Specification

> **Dokumen acuan implementasi UI Web Mediva (React + Tailwind CSS).** Dokumen ini menerjemahkan rancangan Figma `Mediva — Login & Beranda` (file key: `YlDtDRwED0dGNXCaMcbTnz`) menjadi spesifikasi yang dapat diikuti developer dan AI coding agent.
>
> **Cakupan:** aplikasi web untuk peran `staf` dan `admin`. Aplikasi mobile Flutter berada di luar cakupan dokumen ini. Backend Laravel menyediakan autentikasi, data, dan otorisasi.
>
> **Sumber dan batas verifikasi:** struktur frame Figma telah dibaca. Dokumen ini juga mempertahankan detail visual yang terdokumentasi dalam `design.md` lama. Permintaan detail visual tiap frame melalui Figma MCP terkena batas pemanggilan pada paket Starter, sehingga nilai bertanda **[Implementasi]** adalah keputusan penerapan, bukan pengukuran baru dari Figma.

## 0. Cara membaca spesifikasi

Setiap aturan dibedakan menjadi:
- **[Figma]**: elemen, teks, ukuran, atau warna yang tercatat pada desain dan dokumen sumber.
- **[Implementasi]**: keputusan teknis agar desain bekerja di React, Tailwind, keyboard, dan berbagai ukuran layar.
- **[Perlu konfirmasi]**: bagian yang belum cukup jelas atau perlu dicocokkan kembali dengan frame Figma terbaru.

Urutan prioritas:
1. Pertahankan susunan, konten, warna, hierarki, dan proporsi desktop Figma.
2. Terapkan perilaku responsif tanpa menghilangkan fungsi atau konten.
3. Tambahkan state interaksi dan aksesibilitas yang tidak digambarkan mockup.
4. Jangan menciptakan fitur bisnis baru hanya karena area desain terlihat kosong.

---

# 1. Arah visual dan prinsip desain

Mediva adalah platform pengelolaan obat dengan identitas visual bersih, ramah, dan profesional. UI Web memakai dominasi biru dan putih, latar biru sangat muda, kartu putih, border biru muda, serta tipografi Inter.

Prinsip desain:
- **Jelas:** stok, transaksi, pesanan, status, dan tindakan utama mudah dipindai.
- **Konsisten:** komponen yang sama menggunakan warna, radius, tinggi kontrol, dan perilaku yang sama.
- **Ringan:** beri ruang kosong yang cukup; jangan menumpuk border, shadow, dan dekorasi.
- **Responsif:** sidebar desktop berubah menjadi navigasi mobile/tablet; tabel tetap dapat digunakan pada layar kecil.
- **Berorientasi tugas:** staf berfokus pada operasional; admin berfokus pada pemantauan dan pengelolaan pengguna sesuai hak akses.
- **Accessible:** fokus keyboard terlihat, label input jelas, ikon dekoratif disembunyikan dari screen reader, dan kontras teks memenuhi WCAG AA sedapat mungkin.

## 1.1 Identitas warna

Warna berikut berasal dari token terdokumentasi pada desain sebelumnya dan menjadi sumber utama tema.

| Token Tailwind | Nilai | Pemakaian |
|---|---|---|
| `mediva-page` | `#eaf5ff` | Latar dashboard |
| `mediva-sidebar` | `#dceeff` | Latar sidebar desktop |
| `mediva-surface` | `#ffffff` | Kartu, panel, form |
| `mediva-chip` | `#eaf5ff` | Latar chip ikon StatCard |
| `mediva-primary` | `#1565c0` | CTA, link, menu aktif, header tabel |
| `mediva-accent` | `#42a5f5` | Dekorasi dan grafik; bukan teks kecil di atas putih |
| `mediva-border` | `#72bbee` | Border kartu/panel |
| `mediva-border-soft` | `#d6e8fa` | Border input login |
| `mediva-text` | `#0d2f5e` | Heading, angka penting |
| `mediva-muted` | `#4a6f9c` | Label, teks tabel, helper text |
| `mediva-sidebar-text` | `#0b3c6f` | Menu tidak aktif |
| `mediva-success-bg` | `#c8f7cd` | Latar status Aman |
| `mediva-success-text` | `#1b5e20` | Teks status Aman |

Warna status tambahan adalah **[Implementasi]**, bukan warna status yang sudah terverifikasi pada Figma. Pilih pasangan foreground/background dengan rasio kontras minimal 4.5:1 untuk teks normal:
- Warning: latar kuning muda, teks cokelat tua.
- Danger: latar merah muda, teks merah tua.
- Info: latar biru muda, teks biru tua.
- Neutral: latar abu-abu muda, teks abu-abu gelap.

**Penting:** `#42a5f5` hanya untuk aksen dekoratif/grafik. Jangan gunakan sebagai teks kecil atau latar tombol dengan tulisan putih. Gunakan `#1565c0` untuk komponen interaktif yang memerlukan kontras kuat.

## 1.2 Tipografi

**[Figma]** Font utama: **Inter**. Jangan mencampur dengan Poppins atau font display lain.

| Peran teks | Ukuran sumber | Berat | Utility Tailwind |
|---|---:|---|---|
| Judul halaman | 32px | Bold | `text-3xl font-bold` |
| Subjudul halaman | 16px | Medium | `text-base font-medium` |
| Judul panel | 16px | SemiBold | `text-base font-semibold` |
| Angka stat card | 22px | Bold | `text-[22px] font-bold` |
| Label stat card | 12px | Regular | `text-xs` |
| Menu navigasi | 13px | SemiBold | `text-[13px] font-semibold` |
| Header tabel | 12px | Bold | `text-xs font-bold` |
| Isi tabel | 12px | Regular | `text-xs` |
| Tombol | 12px | SemiBold | `text-xs font-semibold` |
| Label grafik | 10px | Regular | `text-[10px]` |
| Role ADMIN/STAFF | 12px | Bold | `text-xs font-bold` |
| Brand login | 22px | Bold | `text-[22px] font-bold` |
| Input/helper login | 13px | Regular | `text-[13px]` |

**[Implementasi] keterbacaan:** isi tabel dan label yang terlalu kecil boleh dinaikkan ke 13–14px bila sulit dibaca pada perangkat nyata. Jangan mengecilkan teks di bawah 12px demi kemiripan visual.

## 1.3 Radius, border, dan elevation

| Token | Nilai sumber | Pemakaian |
|---|---:|---|
| `radius-xs` | 5px | Tombol/filter/input tabel, badge |
| `radius-sm` | 8px | Header tabel, batang grafik |
| `radius-md` | 12px | Menu aktif, chip ikon, input/tombol login |
| `radius-lg` | 16px | StatCard |
| `radius-xl` | 20px | Panel besar |
| `radius-2xl` | 28px | Kartu login |
| Border kartu/panel | 2px | Border biru pada kartu/panel |
| Border pemisah tabel | 1px | Garis antarbaris |

Bayangan sumber:
- StatCard: `0 6px 16px rgba(15, 51, 102, 0.08)`.
- Panel: `0 8px 20px rgba(15, 51, 102, 0.06)`.
- Kartu login: `0 24px 60px rgba(21, 101, 192, 0.22)`.
- CTA login: `0 10px 24px rgba(42, 136, 225, 0.4)`.

Gunakan shadow dengan hemat. Border dan warna permukaan tetap menjadi pembeda utama antarbagian.

---

# 2. Tailwind CSS: konfigurasi dan aturan pemakaian

## 2.1 Teknologi frontend

- React.js dengan Vite.
- Tailwind CSS untuk styling komponen dan layout.
- Heroicons sebagai library ikon UI.
- React Router untuk route dan route guard.
- Axios untuk komunikasi API.
- Recharts untuk grafik transaksi dan donut metode pembayaran.
- Inter sebagai font aplikasi.

Jangan membuat file CSS per komponen untuk menggantikan utility Tailwind. CSS global hanya untuk import font, reset/base, variabel tema bila diperlukan, dan styling pihak ketiga yang tidak dapat ditangani utility.

**Versi Tailwind:** ikuti versi yang sudah ada di `Web/package.json`. Contoh di bawah menggunakan pendekatan CSS-first Tailwind modern. Jika project memakai Tailwind v3, pindahkan token yang sama ke `tailwind.config.js`; jangan mencampur dua pendekatan konfigurasi.

## 2.2 Tema Tailwind modern

Tambahkan ke `Web/src/index.css` atau CSS entry point yang sudah dipakai Vite:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --color-mediva-page: #eaf5ff;
  --color-mediva-sidebar: #dceeff;
  --color-mediva-surface: #ffffff;
  --color-mediva-chip: #eaf5ff;
  --color-mediva-primary: #1565c0;
  --color-mediva-accent: #42a5f5;
  --color-mediva-border: #72bbee;
  --color-mediva-border-soft: #d6e8fa;
  --color-mediva-text: #0d2f5e;
  --color-mediva-muted: #4a6f9c;
  --color-mediva-sidebar-text: #0b3c6f;
  --color-mediva-success-bg: #c8f7cd;
  --color-mediva-success-text: #1b5e20;

  --radius-mediva-xs: 5px;
  --radius-mediva-sm: 8px;
  --radius-mediva-md: 12px;
  --radius-mediva-lg: 16px;
  --radius-mediva-xl: 20px;
  --radius-mediva-2xl: 28px;

  --shadow-mediva-stat: 0 6px 16px rgba(15, 51, 102, 0.08);
  --shadow-mediva-panel: 0 8px 20px rgba(15, 51, 102, 0.06);
  --shadow-mediva-login: 0 24px 60px rgba(21, 101, 192, 0.22);
  --shadow-mediva-cta: 0 10px 24px rgba(42, 136, 225, 0.4);
}
```

Google Fonts dapat diganti dengan file font lokal bila Inter sudah disimpan di project. Jangan memuat font eksternal dan font lokal secara tidak perlu sekaligus.

## 2.3 Penggunaan utility

Gunakan nama token Tailwind agar komponen tidak mengulang hex:

```jsx
<div className="min-h-screen bg-mediva-page font-sans text-mediva-text">
  <section className="rounded-mediva-xl border-2 border-mediva-border bg-mediva-surface shadow-mediva-panel">
    ...
  </section>
</div>
```

Buat komponen React untuk pola styling berulang. Hindari `style={{...}}` untuk nilai desain statis; inline style hanya untuk nilai dinamis dari data/chart bila dibutuhkan.

---

# 3. Ikon: Heroicons

Seluruh ikon antarmuka harus berasal dari **Heroicons React** (`@heroicons/react`). Jangan menggunakan Iconify, emoji, glyph Unicode, atau mencampur beberapa icon pack.

Pemasangan dilakukan dari direktori frontend:

```bash
cd Web
npm install @heroicons/react
```

Pemetaan ikon:

| Fungsi | Heroicon yang disarankan |
|---|---|
| Beranda | `HomeIcon` |
| Kelola Obat | `ArchiveBoxIcon` |
| Kelola Stok | `CubeIcon` atau `Squares2X2Icon` |
| Laporan | `ChartBarIcon` |
| Kasir | `CalculatorIcon` atau `ShoppingCartIcon` |
| Pesanan | `ClipboardDocumentListIcon` |
| Kelola Pengguna | `UsersIcon` |
| Logout | `ArrowRightOnRectangleIcon` |
| Menu mobile | `Bars3Icon` |
| Tutup drawer | `XMarkIcon` |
| Profil/avatar | `UserCircleIcon` |
| Pencarian | `MagnifyingGlassIcon` |
| Kalender | `CalendarDaysIcon` |
| Tambah | `PlusIcon` |
| Edit | `PencilSquareIcon` |
| Hapus | `TrashIcon` |
| Peringatan stok | `ExclamationTriangleIcon` |
| Pengaturan | `AdjustmentsHorizontalIcon` atau `Cog6ToothIcon` |
| Obat/produk | `BeakerIcon` |
| Notifikasi | `BellIcon` |
| Dropdown | `ChevronDownIcon` |
| Export/download | `ArrowDownTrayIcon` |
| Cetak | `PrinterIcon` |
| Lihat detail | `EyeIcon` |
| Status sukses | `CheckCircleIcon` |

Contoh:

```jsx
import {
  HomeIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

<HomeIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
```

Pedoman ukuran:
- Ikon menu desktop: 20–22px.
- Ikon tombol kecil: 16–18px.
- Ikon chip StatCard: 20–24px.
- Ikon avatar: 42px sesuai referensi desktop.
- Ikon dekoratif diberi `aria-hidden="true"`.
- Tombol ikon wajib memiliki `aria-label` atau teks pendamping.

Gunakan varian outline untuk navigasi dan aksi umum; gunakan solid hanya jika diperlukan untuk meniru penekanan visual atau status. Bila Figma memiliki ikon vektor khusus yang harus dipertahankan persis, ekspor sebagai SVG lokal dan mintakan persetujuan sebelum menyimpang dari standar Heroicons.

---

# 4. Kerangka aplikasi dan navigasi responsif

## 4.1 Desktop AppShell

**[Figma]** Frame dashboard utama menggunakan kanvas 1440 × 900. Sidebar 260px dan area konten memiliki padding sekitar 24px. Header halaman menempatkan judul/subjudul di kiri serta tanggal, role, dan avatar di kanan.

Struktur komponen:

```text
App
├── AuthProvider
├── ProtectedRoute
└── AppShell
    ├── Sidebar (desktop)
    │   ├── BrandLogo
    │   ├── NavigationMenu
    │   └── LogoutAction
    ├── MobileHeader (mobile/tablet)
    │   ├── MenuButton
    │   ├── BrandLogo
    │   └── ProfileSummary
    ├── MobileNavigationDrawer
    └── MainContent
        ├── PageHeader
        └── Outlet (halaman aktif)
```

Desktop:
- Sidebar selebar 260px dan setinggi viewport.
- Sidebar memakai latar `mediva-sidebar`.
- Logo Mediva berada di area atas. Referensi sumber mencatat aset sekitar 197 × 87px; gunakan aset lokal hasil ekspor Figma, bukan URL sementara.
- Item menu sekitar 228 × 42px, margin horizontal 16px, radius 12px.
- Ikon di kiri label dengan jarak konsisten.
- Menu aktif memakai `mediva-primary` dengan teks putih.
- Menu tidak aktif memakai `mediva-sidebar-text`.
- Logout berada di bagian bawah sidebar.
- Konten utama mengisi sisa ruang dan dapat discroll tanpa membuat sidebar ikut bergeser.

**[Implementasi]** Gunakan `flex` atau grid dengan `min-w-0`; jangan mengunci lebar konten menjadi 1132px.

## 4.2 Navbar/drawer responsif

Desain dasar Figma adalah sidebar desktop. Navbar/drawer berikut adalah **[Implementasi]** untuk tablet dan ponsel.

Breakpoint perilaku (mengikuti breakpoint Tailwind standar kecuali project memiliki konfigurasi khusus):
- **Desktop `lg` ke atas (≥1024px):** sidebar tetap terlihat, lebar 260px.
- **Di bawah `lg`:** sidebar desktop disembunyikan; tampilkan top navigation bar dengan tombol menu.
- **Mobile/tablet:** tombol menu membuka drawer dari sisi kiri. Drawer menampilkan logo, menu sesuai role, dan logout.
- Drawer ditutup saat menu dipilih, tombol close ditekan, backdrop diklik, atau tombol Escape ditekan.
- Saat drawer terbuka, cegah scroll body di belakangnya dan kembalikan fokus secara masuk akal ketika ditutup.
- Tampilkan menu aktif pada desktop dan drawer.
- Jangan tampilkan menu yang tidak sesuai role.
- Navbar tidak boleh menutupi judul, filter, tabel, atau form.

Contoh kerangka layout:

```jsx
<div className="min-h-screen bg-mediva-page">
  <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] bg-mediva-sidebar lg:block">
    {/* desktop sidebar */}
  </aside>

  <div className="lg:pl-[260px]">
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-mediva-border/50 bg-white/95 px-4 backdrop-blur lg:hidden">
      {/* menu button, logo, profile */}
    </header>

    <main className="min-w-0 p-4 sm:p-6">
      {/* PageHeader + route page */}
    </main>
  </div>
</div>
```

Drawer harus berupa komponen React dengan state, bukan hanya elemen visual. Gunakan `<button>` untuk trigger dan navigasi React Router untuk item.

## 4.3 PageHeader

Setiap halaman operasional menampilkan:
- Judul halaman di kiri.
- Subjudul/deskripsi singkat di bawah judul.
- Area kanan berisi tanggal, role `STAFF` atau `ADMIN`, dan avatar/profil.
- Pada layar sempit, metadata boleh turun ke baris berikutnya; judul jangan terpotong.
- Pada mobile, tanggal dapat dipindahkan ke bawah judul atau diringkas hanya bila informasi yang sama tetap tersedia dan tidak penting untuk tugas.

---

# 5. Spesifikasi komponen UI

Komponen reusable dibuat di `Web/src/components/`. Komponen layout seperti AppShell dan Sidebar berada di `Web/src/layouts/`.

## 5.1 StatCard

**[Figma]**
- Desktop sekitar 260 × 170px.
- Permukaan putih, radius 16px.
- Border 2px `mediva-border`.
- Shadow StatCard.
- Chip ikon 40 × 40px, radius 12px, latar `mediva-chip`.
- Label di bawah chip; angka utama 22px bold.
- Empat card dalam satu baris di kanvas 1440px dengan gap sekitar 24px.

**[Implementasi]** Lebar kartu mengikuti grid, bukan dipaksa fixed di layar sempit. Tablet menggunakan 2 kolom; mobile 1 kolom atau 2 kolom bila lebar cukup. Angka panjang dan mata uang harus tetap terbaca.

## 5.2 Panel

Panel digunakan untuk grafik, notifikasi, tabel, keranjang, dan validasi resep:
- Permukaan putih, radius 20px.
- Border 2px `mediva-border`.
- Shadow panel.
- Padding judul sekitar 24px pada desktop; dapat turun menjadi 16px pada mobile.
- Hindari panel bersarang jika tidak diperlukan.

## 5.3 Button

Varian:
- `primary`: latar `mediva-primary`, teks putih, radius sekitar 5px, tinggi sekitar 38px untuk aksi tabel.
- `login`: tinggi sekitar 48px, radius 12px, shadow CTA.
- `secondary`: permukaan putih, border biru, teks biru.
- `danger`: warna merah dengan kontras yang memadai untuk tindakan destruktif.
- `ghost`: transparan untuk aksi ringan atau tombol ikon.

State wajib: default, hover, focus-visible, active, disabled, loading. Gunakan disabled ketika request berlangsung agar form tidak terkirim berulang.

## 5.4 SearchInput

- Input putih, border tipis, radius sekitar 5px pada tabel desktop.
- Placeholder contoh: “Telusuri nama obat”.
- Ikon pencarian Heroicons.
- Lebar mengikuti ruang; jangan mengunci 197px pada mobile.
- Search harus benar-benar memfilter data atau mengirim parameter pencarian ke API.

## 5.5 DateRangeFilter

- Dua input tanggal `Dari` dan `Sampai`, dipisahkan tanda rentang.
- Referensi desktop sekitar 131 × 30px per input dan tombol Filter sekitar 75 × 30px.
- Ikon kalender menggunakan `CalendarDaysIcon`.
- Pada mobile, input disusun vertikal atau grid dua kolom sesuai ruang.
- Validasi: tanggal awal tidak boleh melewati tanggal akhir.
- Tombol Filter menjalankan filter data/API.

## 5.6 DataTable

- Header memakai latar `mediva-primary`, teks putih bold.
- Tinggi header referensi sekitar 40px dan radius 8px.
- Baris referensi sekitar 67px dengan garis pemisah 1px.
- Isi tabel menggunakan `mediva-muted`.
- Kolom aksi menggunakan tombol ikon Heroicons.
- Tampilkan empty state saat data kosong, loading saat memuat, dan error saat request gagal.
- Pagination awal 10 baris per halaman adalah **[Implementasi]**.
- Bungkus tabel dengan `overflow-x-auto` pada layar sempit dan pertahankan header kolom.
- Bila tabel sangat penting di ponsel, tampilan daftar/kartu boleh menjadi alternatif responsif tanpa menghilangkan informasi.
- Aksi edit/hapus hanya tampil jika role memiliki izin. Dialog konfirmasi hapus adalah **[Implementasi]**.

## 5.7 StatusBadge

Status yang tercatat pada desain sumber:
- `Aman`: latar `#c8f7cd`, teks `#1b5e20`.

Status tambahan yang perlu disepakati dengan logika bisnis:
- `Menipis`
- `Habis`
- `Kedaluwarsa`

Jangan menentukan ambang stok dari UI. Ambang harus mengikuti backend/PRD. Gunakan teks dan warna sekaligus agar status tidak bergantung pada warna saja.

## 5.8 Chart

**Grafik Transaksi**
- Contoh frame menggunakan 7 batang, lebar sekitar 36px, radius atas 8px.
- Warna batang `rgba(66, 165, 245, 0.75)`.
- Label tanggal contoh 21–27 Sep.
- Filter tanggal berada di area grafik.
- Implementasikan dengan Recharts, responsive container, tooltip, dan label terbaca.
- Data grafik berasal dari API; angka contoh Figma hanya mockup.

**Donut Metode Pembayaran**
- Muncul di dashboard admin.
- Donut berada di tengah panel dan legenda di bawah.
- Warna kategori konsisten antara segmen dan legenda.
- Sediakan ringkasan teks/label alternatif agar informasi tidak hanya disampaikan melalui visual.

## 5.9 EmptyState, loading, dan error

Empty state yang tercatat antara lain:
- “Belum ada notifikasi”
- “Belum ada pesanan masuk.”
- “Tidak ada antrean resep. Semua sudah tervalidasi.”

**[Implementasi]** Pisahkan state:
- Loading: skeleton atau indikator dengan teks.
- Empty: ikon/ilustrasi sederhana dan pesan bahwa data belum tersedia.
- Error: pesan mudah dipahami dan tombol coba lagi bila relevan.
- Success: toast atau inline feedback.

Jangan tampilkan empty state selama request masih berjalan.

---

# 6. Pemetaan halaman Figma ke route

ID berikut dipertahankan dari dokumentasi desain sebelumnya; cocokkan kembali bila frame di Figma diganti atau diarsipkan.

| Route | Role | Frame Figma | Konten utama |
|---|---|---|---|
| `/login` | Staf/Admin | Login `1:2` | Form login, brand Mediva, area robot 3D |
| `/` | Staf | Beranda `1:15` | Empat StatCard, Grafik Transaksi + filter, panel Notifikasi |
| `/` | Admin | Beranda Admin `95:435` | Empat StatCard, Grafik Transaksi, donut Metode Pembayaran |
| `/obat` | Staf | Kelola Obat `14:921` | Tabel obat, pencarian, tambah, edit, hapus |
| `/obat` | Admin | Data Obat `21:1123` | Tabel obat hanya-baca; tanpa aksi/tombol tambah |
| `/stok` | Staf | Kelola Stok `14:954` | Total stok real, detail batch, kedaluwarsa, sisa stok, sesuaikan, tambah stok |
| `/laporan` | Staf/Admin | Staf `14:985`, Admin `21:1194` | Filter tanggal, tabel pergerakan stok, total, export Excel dan cetak PDF |
| `/kasir` | Staf | Kasir `14:1031` | Katalog obat, pencarian, keranjang, total, uang diterima, bayar |
| `/pesanan` | Staf | Pesanan `14:1065` | Daftar pesanan masuk dan panel validasi resep obat keras |
| `/pengguna` | Admin | Kelola Pengguna `21:1050` | Tabel pengguna, tambah/edit/hapus sesuai izin backend |

## 6.1 Login

**[Figma]**
- Frame desktop 1440 × 900.
- Latar putih dengan tiga bidang/blob biru blur dan tiga dekorasi kapsul miring.
- Kartu login sekitar 400 × 560px, putih sedikit transparan, border putih, radius 28px, dan shadow login.
- Slot robot 3D sekitar 240 × 240px menonjol dari atas kartu.
- Brand Mediva dan teks “Smart Medicine Platform - masuk ke akun Anda”.
- Input Username dan Password sekitar 336 × 48px.
- Tombol Masuk sekitar 48px tinggi.
- Link “Lupa sandi?” dan teks versi `v1.0`.

**[Implementasi]**
- Form menjadi fokus utama; dekorasi dan robot tidak menutupi input.
- Pada ponsel, kartu memakai lebar `calc(100% - 32px)` dengan `max-width: 400px`.
- Robot boleh diperkecil/disembunyikan pada perangkat berkemampuan rendah atau saat `prefers-reduced-motion` aktif.
- Validasi username/password dan tampilkan error dekat input.
- Link lupa sandi hanya aktif bila backend mendukung reset password.
- Login tetap dapat digunakan ketika model 3D gagal dimuat.

## 6.2 Dashboard Staf

Header “Dashboard Staff” dengan subjudul “Pantauan aktivitas hari ini”. Empat StatCard:
1. Jumlah Obat.
2. Antrean Pesanan.
3. Obat Masuk.
4. Obat Menipis.

Konten bawah:
- Grafik Transaksi dengan filter tanggal.
- Panel Notifikasi di sebelah kanan; kondisi kosong menampilkan “Belum ada notifikasi”.

Pada desktop panel grafik lebih lebar daripada panel notifikasi. Pada layar kecil, panel ditumpuk.

## 6.3 Dashboard Admin

Header “Dashboard Admin” dan subjudul “Pantauan aktivitas hari ini”. Empat StatCard:
1. Pendapatan Bulan Ini.
2. Total Obat Real.
3. Pesanan Selesai.
4. Obat Menipis.

Konten bawah:
- Grafik Transaksi dengan filter tanggal.
- Panel Donut “Metode Pembayaran” dengan legenda.
- Admin tidak mendapatkan aksi operasional yang tidak diberikan pada role-nya.

## 6.4 Kelola Obat (Staf) dan Data Obat (Admin)

Kolom tabel:
- Kode.
- Nama Obat.
- Kategori.
- Stok.
- Status.
- Aksi (khusus Staf, sesuai hak akses).

Staf: pencarian nama obat, tombol “+ Tambah Obat”, dan aksi tambah/edit/hapus sesuai endpoint serta policy backend.

Admin: tampilan hanya-baca; tidak menampilkan tombol tambah atau kolom aksi sesuai keputusan desain terdokumentasi.

## 6.5 Kelola Stok (Staf)

Tampilkan ringkasan stok per obat dan rincian batch:
- Nama Obat.
- Total Stok Real.
- Detail Batch.
- Tanggal kedaluwarsa.
- Sisa stok.
- Aksi “Sesuaikan”.
- Tombol “+ Tambah Stok”.

Detail batch dapat menjadi baris turunan, expandable row, atau pola visual yang paling dekat dengan frame Figma. Jangan menghilangkan rincian batch dari pengguna.

## 6.6 Laporan

Tersedia untuk staf dan admin:
- Filter tanggal awal dan akhir.
- Kolom: No, Tanggal, Nama Obat, Pemasukan, Pengeluaran, Stok Akhir.
- Baris TOTAL.
- Tombol Export Excel.
- Tombol Cetak PDF.

Gunakan format tanggal lokal Indonesia dan Rupiah. File harus dibuat melalui backend atau mekanisme export yang telah disepakati, bukan file palsu di sisi UI.

## 6.7 Kasir

Dua area desktop:
- Panel “Katalog Obat”: pencarian dan grid kartu produk. Referensi kartu sekitar 220 × 140px.
- Panel “Keranjang”: item terpilih, total, input uang diterima, dan tombol “Bayar Sekarang”.

**[Implementasi]** Tablet dapat menumpuk katalog dan keranjang atau menampilkan keranjang sticky tanpa menutupi katalog. Pada mobile, keranjang dapat menjadi panel/bottom sheet. Validasi stok, nominal pembayaran, dan kembalian harus mengikuti backend. Cegah pembayaran terkirim dua kali saat tombol loading.

## 6.8 Pesanan

Dua area desktop:
- Panel “Daftar Pesanan Masuk” dengan kolom Kode Pesanan, Pembeli, Metode, Total, Status, Detail.
- Panel “Validasi Resep Obat Keras”.

Empty state pesanan: “Belum ada pesanan masuk.” Empty state resep: “Tidak ada antrean resep. Semua sudah tervalidasi.”

Tindakan validasi resep harus menampilkan informasi yang cukup dan meminta konfirmasi petugas. Status akhir harus bersumber dari backend.

## 6.9 Kelola Pengguna (Admin)

Kolom tabel:
- Kode.
- Nama Pengguna.
- Username.
- Peran.
- Aksi.

Tombol “+ Tambah Pengguna”. Aksi tambah/edit/hapus hanya dilakukan bila endpoint dan kebijakan backend mengizinkan. Konfirmasi hapus adalah **[Implementasi]**.

---

# 7. Navigasi per role dan keamanan route

Role aplikasi yang tercatat: `admin`, `staf`, dan `pembeli`. Web ditujukan untuk staf/admin; pembeli menggunakan aplikasi mobile.

Menu staf:
- Beranda `/`
- Kelola Obat `/obat`
- Kelola Stok `/stok`
- Laporan `/laporan`
- Kasir `/kasir`
- Pesanan `/pesanan`

Menu admin:
- Beranda `/`
- Kelola Pengguna `/pengguna`
- Data Obat `/obat`
- Laporan `/laporan`

Contoh konfigurasi:

```jsx
import {
  HomeIcon,
  ArchiveBoxIcon,
  CubeIcon,
  ChartBarIcon,
  CalculatorIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export const NAV_ITEMS = {
  staf: [
    { label: 'Beranda', to: '/', icon: HomeIcon },
    { label: 'Kelola Obat', to: '/obat', icon: ArchiveBoxIcon },
    { label: 'Kelola Stok', to: '/stok', icon: CubeIcon },
    { label: 'Laporan', to: '/laporan', icon: ChartBarIcon },
    { label: 'Kasir', to: '/kasir', icon: CalculatorIcon },
    { label: 'Pesanan', to: '/pesanan', icon: ClipboardDocumentListIcon },
  ],
  admin: [
    { label: 'Beranda', to: '/', icon: HomeIcon },
    { label: 'Kelola Pengguna', to: '/pengguna', icon: UsersIcon },
    { label: 'Data Obat', to: '/obat', icon: ArchiveBoxIcon },
    { label: 'Laporan', to: '/laporan', icon: ChartBarIcon },
  ],
};
```

Ketentuan:
- Route `/` memilih dashboard sesuai role login.
- `ProtectedRoute` memeriksa autentikasi dan role.
- Frontend menyembunyikan menu yang tidak sesuai role, tetapi **bukan lapisan keamanan**.
- Semua otorisasi wajib ditegakkan oleh Laravel/backend.
- Pembeli tidak boleh mengakses halaman web staf/admin.
- Jika role tidak berhak, arahkan ke halaman 403 atau dashboard yang benar.
- Jangan hanya mengandalkan role dalam state lokal tanpa validasi sesi/token.

---

# 8. Integrasi API dan perilaku UI

## 8.1 Axios

Semua request API harus melalui satu instance `src/services/api.js`; jangan memanggil Axios langsung dari komponen halaman.

Spesifikasi terdokumentasi:
- Base URL dari `import.meta.env.VITE_API_URL`.
- Header `Accept: application/json`.
- Token Sanctum Bearer ditambahkan melalui request interceptor.
- Respons 401 membersihkan token dan mengarahkan ke login.
- Bentuk respons API yang diharapkan: `{ status, message, data }`.
- Error validasi 422 ditampilkan dekat field terkait.

Contoh pola:

```jsx
// src/services/api.js
import axios from 'axios';
import { getToken, clearToken } from './tokenStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
```

Jangan menaruh token/API secret di source code atau file yang dikomit. Jangan menggunakan `dangerouslySetInnerHTML` untuk konten pengguna/API. Strategi penyimpanan token harus mengikuti keputusan keamanan PRD dan backend; dokumentasi terdahulu mencatat token disimpan di memori + `sessionStorage`, bukan `localStorage`.

## 8.2 Format data

- Mata uang: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
- Tanggal: format Indonesia konsisten, contoh `27-09-2026 12:54`.
- Status memakai teks yang bisa dibaca, bukan warna saja.
- Tampilkan loading/error/empty/success secara konsisten.
- Gunakan debounce untuk pencarian yang memanggil API.
- Hindari request berulang ketika pengguna mengklik tombol berkali-kali.

## 8.3 Aksesibilitas dan interaksi

- Semua input memiliki label.
- Semua tombol dapat dioperasikan dengan keyboard.
- Gunakan `focus-visible` yang jelas.
- Drawer memiliki label, kontrol close, dan dukungan Escape.
- Dialog memiliki judul, fokus terkelola, dan perilaku tutup yang dapat diprediksi.
- Tabel memakai header semantik.
- Grafik menyediakan ringkasan tekstual/label.
- Jangan mengandalkan warna saja untuk status.
- Hargai `prefers-reduced-motion`.
- Sticky header/sidebar tidak boleh menutupi elemen fokus.

---

# 9. Aset visual dan robot 3D

## 9.1 Logo

Gunakan logo Mediva asli hasil ekspor Figma sebagai aset lokal. Jangan merujuk URL sementara Figma karena URL export dapat kedaluwarsa. Lokasi yang disarankan:
- `src/assets/brand/mediva-logo.svg`, atau
- `public/brand/mediva-logo.svg`.

Jangan menggambar ulang logo memakai teks bila aset asli tersedia.

## 9.2 Robot pada Login

**[Figma/dokumentasi terdahulu]** area robot sekitar 240 × 240px menonjol dari bagian atas kartu login. Dokumen lama menyebut slot sebagai placeholder yang menunggu aset 3D.

Arah desain model:
- Robot asisten kesehatan yang ramah.
- Material putih glossy dengan aksen biru.
- Kepala membulat sedikit lebih besar daripada badan.
- Visor navy gelap dengan dua mata cyan.
- Antena tipis dengan ujung lampu hijau.
- Lengan pendek membulat, telapak terbuka menghadap ke atas.
- Menghadap depan, proporsi halus, tanpa sudut tajam.

Alur aset:
1. Buat model 3D dengan tool pilihan tim.
2. Pisahkan kepala dan badan agar kepala bergerak independen.
3. Ekspor GLB.
4. Simpan di `public/models/mediva-robot.glb`.
5. Periksa node kepala dan sesuaikan nama node pada komponen React.
6. Kompres model; target di bawah 2–3 MB adalah sasaran optimasi, bukan ukuran yang terukur dari Figma.
7. Instal Three.js/React Three Fiber/Drei di project `Web`, bukan root monorepo.

```bash
cd Web
npm install three @react-three/fiber @react-three/drei
```

Interaksi yang diharapkan:
- Kepala mengikuti pointer secara lembut di desktop.
- Gerakan dimatikan saat `prefers-reduced-motion` aktif.
- Sediakan placeholder bila WebGL tidak didukung atau GLB gagal dimuat.
- Robot tidak boleh menghalangi input, tombol, atau aksesibilitas login.
- Pada mobile, perkecil atau sembunyikan robot jika ruang layar terbatas.

Nama node `Head` hanya contoh; jangan mengasumsikannya sebelum file model diperiksa.

---

# 10. Responsive behavior matrix

Desain dasar terdokumentasi pada desktop 1440 × 900. Rincian berikut adalah **[Implementasi]** untuk perangkat yang belum dicakup frame desktop.

| Area | Desktop `lg`+ | Tablet `md`–`lg` | Mobile `<md` |
|---|---|---|---|
| Navigasi | Sidebar 260px | Topbar + drawer | Topbar + drawer |
| Header halaman | Judul kiri, metadata kanan | Metadata dapat turun | Judul dan metadata ditumpuk |
| StatCard | 4 kolom jika cukup | 2 kolom | 1 kolom atau 2 bila cukup |
| Panel dashboard | Dua panel berdampingan | Bertumpuk | Bertumpuk |
| Tabel | Lebar konten | Scroll horizontal bila perlu | Scroll horizontal atau card list |
| Filter tanggal | Satu baris | Wrap | Ditumpuk |
| Kasir | Katalog + keranjang berdampingan | Dapat bertumpuk | Keranjang ringkas/bottom sheet |
| Login | Kartu 400px dengan robot | Kartu max-width | Kartu fluid, robot diperkecil |
| Modal/dialog | Terpusat | Terpusat dengan margin | Hampir selebar layar, tinggi scroll |

Jangan menggunakan 1440px atau 1132px sebagai lebar fixed konten. Gunakan `max-width`, grid, flex, `minmax()`, dan breakpoint Tailwind.

---

# 11. Struktur folder frontend yang disarankan

Sesuaikan dengan struktur yang sudah ada; jangan menggandakan folder atau menghapus implementasi existing.

```text
Web/
├── public/
│   ├── brand/
│   └── models/
├── src/
│   ├── assets/
│   │   └── brand/
│   ├── components/
│   │   ├── buttons/
│   │   ├── charts/
│   │   ├── feedback/
│   │   ├── forms/
│   │   ├── navigation/
│   │   ├── tables/
│   │   └── ui/
│   ├── layouts/
│   │   ├── AppShell.jsx
│   │   ├── Sidebar.jsx
│   │   └── MobileNavigation.jsx
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── medicines/
│   │   ├── stock/
│   │   ├── reports/
│   │   ├── cashier/
│   │   ├── orders/
│   │   └── users/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── config/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── package-lock.json
```

`package.json` dan `package-lock.json` untuk React/Vite berada di `Web/`. Jangan membuat package manifest tambahan di root kecuali tim secara sadar mengadopsi tooling monorepo yang memang memerlukannya.

---

# 12. Urutan implementasi

1. **Audit frontend existing:** periksa `Web/package.json`, versi Tailwind, struktur Vite, dependency, dan CSS entry point.
2. **Setup tema Tailwind:** masukkan warna, font, radius, dan shadow; pastikan utility token ter-generate.
3. **Komponen dasar:** Button, Input, Panel, StatCard, StatusBadge, EmptyState, DataTable.
4. **AppShell desktop:** Sidebar, PageHeader, route active state.
5. **Navbar responsif:** topbar, drawer, backdrop, Escape, lock scroll, close on navigation.
6. **Route dan role guard:** uji menu staf/admin dan akses route langsung.
7. **Login:** form, validasi, error API, kemudian robot 3D setelah aset siap.
8. **Dashboard staf dan admin:** stat card, chart, notifikasi/donut.
9. **Halaman data:** Kelola Obat, Kelola Stok, Laporan, Kelola Pengguna.
10. **Alur transaksi:** Kasir dan Pesanan.
11. **Polish state:** loading, empty, error, success, disabled, dialog.
12. **Responsive QA:** uji minimal 1440px, 1024px, 768px, 390px, dan 360px.
13. **Visual QA:** bandingkan setiap halaman dengan frame Figma terkait pada desktop. Catat perbedaan intentional karena responsive design.

---

# 13. Definition of Done

- [ ] Seluruh halaman yang dipetakan tersedia pada route yang benar.
- [ ] Tampilan desktop mempertahankan hierarki, konten, dan bahasa visual Figma.
- [ ] Warna, font, radius, border, dan shadow berasal dari token Tailwind.
- [ ] Tidak ada CSS per komponen yang menduplikasi utility Tailwind.
- [ ] Semua ikon UI menggunakan Heroicons React; tidak ada campuran Iconify.
- [ ] Sidebar desktop dan navbar/drawer mobile berfungsi.
- [ ] Menu dan route sesuai role; backend tetap menjadi sumber otorisasi utama.
- [ ] Tabel dapat digunakan pada layar sempit.
- [ ] Semua tombol/input memiliki state interaksi jelas.
- [ ] Loading, empty, error, dan success state ditangani.
- [ ] Form dan navigasi dapat digunakan dengan keyboard.
- [ ] Robot tidak menghalangi login dan menghormati reduced motion.
- [ ] Tidak ada secret/token dalam source code.
- [ ] Semua aset statis memakai file lokal, bukan URL sementara Figma.
- [ ] Tidak ada overflow horizontal pada halaman selain area tabel yang memang dapat discroll.
- [ ] QA visual pada desktop 1440px dan pengujian tablet/mobile telah dilakukan.

---

# 14. Hal yang perlu dikonfirmasi

1. Apakah seluruh halaman pada tabel route masih merupakan versi final Figma, terutama Kasir, Pesanan, dan Kelola Pengguna?
2. Apakah admin tetap hanya-baca pada Data Obat, sesuai keputusan yang terdokumentasi sebelumnya?
3. Apakah alur “Lupa sandi?” telah didukung backend?
4. Apakah robot 3D sudah tersedia sebagai GLB final atau masih placeholder?
5. Apakah ambang status stok (`Aman`, `Menipis`, `Habis`) sudah ditetapkan pada PRD/backend?
6. Apakah struktur responsive yang diusulkan telah disetujui sebagai perilaku produk?

Jika ada perbedaan antara dokumen ini, PRD, backend, dan Figma terbaru, jangan menebak. Catat konflik dan minta keputusan pemilik proyek sebelum mengubah hak akses atau aturan bisnis.
