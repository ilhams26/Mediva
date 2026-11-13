# Roadmap Backend Mediva --- Laravel 12 + Supabase PostgreSQL + pgvector

**Arsitektur acuan:** Laravel 12 sebagai REST API, Supabase PostgreSQL
sebagai database, React.js untuk web staf/admin, dan Flutter untuk
aplikasi pembeli. Autentikasi seluruh klien menggunakan **Laravel
Sanctum Personal Access Token (Bearer Token)**.

**Kondisi awal:** 13 migration telah diterapkan di Supabase (berdasarkan
kondisi awal proyek), model Laravel sudah dibuat, dan implementasi
backend masih perlu dilanjutkan serta diverifikasi terhadap repository
terkini. Selalu periksa status migration sebelum menjalankan perubahan.

> **Sumber keputusan:** PRD Mediva, khususnya bagian Authentication,
> Security, AI, dan Success Criteria. Jika dokumen roadmap lama berbeda
> dengan PRD, ikuti PRD dan perbarui roadmap ini.

## Prinsip utama

1.  **Satu sumber kebenaran skema adalah migration Laravel.** Jangan
    mengubah skema langsung dari dashboard Supabase atau tool lain,
    kecuali perubahan darurat yang kemudian direkonsiliasi ke migration.
2.  **Sanctum menggunakan API Token, bukan SPA Authentication.** React
    dan Flutter menerima token setelah login, lalu mengirim
    `Authorization: Bearer <token>` pada endpoint terproteksi.
3.  **Tidak menggunakan JWT dan tidak menggunakan autentikasi
    cookie/CSRF Sanctum SPA** untuk arsitektur Mediva yang ditetapkan
    PRD.
4.  **Jangan mengaktifkan middleware `statefulApi()`** selama aplikasi
    hanya menggunakan Bearer Token. Jangan mengatur
    `SANCTUM_STATEFUL_DOMAINS` untuk alur ini.
5.  Secret hanya disimpan di `.env` lokal atau secret manager server.
    Jangan commit `.env`, password Supabase, APP_KEY, Midtrans Server
    Key, atau Gemini API Key.
6.  Setiap fase memiliki kriteria **"Selesai kalau"**. Jangan
    melanjutkan fase sebelum kriteria pentingnya terpenuhi.

------------------------------------------------------------------------

## Fase 1 --- Fondasi REST API

-   Rapikan struktur: `Controllers`, `Requests` (validasi), `Resources`
    (format JSON), `Services` (logika bisnis), `Models`, dan middleware.
-   Tetapkan format respons JSON yang konsisten untuk sukses dan error.
-   Pastikan exception API dikembalikan sebagai JSON dan detail stack
    trace tidak bocor di production.
-   Atur CORS agar origin React yang diizinkan dapat mengakses API.
    Karena menggunakan Bearer Token, **`supports_credentials` tidak
    diperlukan untuk autentikasi**; jangan mengaktifkan credential
    cookie hanya untuk Sanctum.
-   Daftarkan alias middleware role satu kali di `bootstrap/app.php`,
    lalu gunakan alias yang sama pada route.
-   Buat endpoint health check, misalnya `GET /api/health`.
-   Terapkan rate limiter dasar untuk login, OTP, dan endpoint AI.
-   Atur environment production: `APP_DEBUG=false`, HTTPS, dan secret
    server.

**Selesai kalau:** `/api/health` berjalan; respons API konsisten; CORS
hanya mengizinkan origin yang diperlukan; error production tidak
membocorkan detail; middleware role teruji.

## Fase 2 --- Autentikasi Sanctum API Token & Pengguna

### Metode autentikasi yang wajib digunakan

-   React web dan Flutter mobile menggunakan **Sanctum Personal Access
    Token**.
-   Login berhasil mengembalikan informasi user dan `plainTextToken`
    satu kali.
-   Klien menyimpan token dengan penyimpanan yang sesuai:
    -   React: utamakan memory aplikasi; jika perlu persistensi sesi,
        gunakan penyimpanan yang dirancang dengan pertimbangan risiko
        XSS. Jangan menyimpan token sensitif sembarangan.
    -   Flutter: gunakan secure storage, misalnya
        `flutter_secure_storage`.
-   Setiap request ke endpoint terproteksi mengirim:
    -   `Authorization: Bearer <token>`
    -   `Accept: application/json`
-   Route terproteksi menggunakan middleware `auth:sanctum`.
-   Logout menghapus token yang sedang digunakan melalui
    `currentAccessToken()->delete()`.
-   Sediakan endpoint `/api/user` atau `/api/me` untuk mengambil user
    dari token aktif.
-   Model `User` harus menggunakan trait `Laravel\Sanctum\HasApiTokens`.
-   Pastikan migration `personal_access_tokens` tersedia dan telah
    diterapkan.
-   **Jangan gunakan JWT, Sanctum SPA cookie authentication, CSRF cookie
    flow, atau middleware `statefulApi()`** untuk skema autentikasi ini.
-   `SANCTUM_STATEFUL_DOMAINS` tidak diperlukan untuk Bearer Token.
-   Session Laravel bukan mekanisme autentikasi API Mediva. Gunakan
    `SESSION_DRIVER=file` kecuali ada fitur web lain yang secara
    eksplisit membutuhkan session database.

### Fitur pengguna

-   Register dan login pembeli.
-   Login staf/admin sesuai aturan role dan kebijakan pembuatan akun.
-   Logout dan lihat profil sendiri.
-   OTP: kode acak, kedaluwarsa 5 menit, batasi jumlah percobaan dan
    permintaan, simpan dalam bentuk hash.
-   Lupa/reset password dan ganti password.
-   Manajemen user oleh admin: CRUD, ubah role, dan nonaktifkan akun.
-   Pembeli ditolak dari endpoint staf/admin; user nonaktif tidak boleh
    memperoleh akses.
-   Terapkan rate limiting dan pesan error yang aman.

**Selesai kalau:** token dibuat dan divalidasi; request tanpa token/
token salah ditolak; logout mencabut token; akses lintas role ditolak;
user nonaktif tidak dapat mengakses API; feature test login, logout,
OTP, dan throttling lulus.

## Fase 3 --- Katalog

-   CRUD kategori dan obat oleh staf sesuai aturan role.
-   Upload foto produk dengan validasi tipe dan ukuran file.
-   Endpoint publik: daftar obat (paginasi, pencarian, filter kategori)
    dan detail obat.
-   Stok total dihitung dari jumlah `jumlah_sisa` seluruh batch, bukan
    disimpan sebagai angka duplikat yang mudah tidak sinkron.
-   Obat nonaktif tidak ditampilkan sebagai produk yang dapat dibeli.
-   Obat keras boleh memiliki informasi yang dapat dilihat, tetapi tidak
    boleh masuk keranjang/checkout tanpa resep tervalidasi.

**Selesai kalau:** katalog dapat dicari dan difilter; validasi upload
berjalan; produk nonaktif tidak dapat dibeli; aturan obat keras
diterapkan pada endpoint pembelian.

## Fase 4 --- Batch, Stok & FEFO

-   Buat `InventoryService` untuk penerimaan stok, pembuatan batch,
    penyesuaian stok, daftar batch, dan peringatan stok.
-   Terapkan FEFO (*First Expired, First Out*): gunakan batch dengan
    tanggal kedaluwarsa paling dekat yang masih memiliki stok dan belum
    kedaluwarsa.
-   Saat stok keluar, kurangi `jumlah_sisa` batch terkait dan catat
    `pergerakan_stok` beserta `batch_id`.
-   Gunakan database transaction dan `lockForUpdate()` untuk mencegah
    race condition ketika beberapa transaksi berlangsung bersamaan.
-   Batch kedaluwarsa tidak boleh dijual.
-   Validasi jumlah stok tidak boleh menjadi negatif.

**Selesai kalau:** test FEFO untuk urutan batch, stok kurang, lintas
batch, batch kedaluwarsa, pembatalan, dan transaksi bersamaan lulus.

## Fase 5 --- Pesanan & Checkout

-   Gunakan satu `OrderService` untuk seluruh jalur pesanan (kasir web
    dan checkout mobile). Jangan membuat dua implementasi pengurangan
    stok.
-   Checkout memvalidasi stok, status obat, resep untuk obat keras,
    serta harga dari database.
-   Total harga dihitung di server; jangan mempercayai harga atau total
    yang dikirim klien.
-   Buat `orders` dan `order_items`, lalu kurangi stok melalui mekanisme
    FEFO dalam satu transaksi database.
-   Tetapkan transisi status yang jelas, misalnya
    `diproses → siap_diambil → selesai`, atau `dibatalkan` dengan
    pengembalian stok yang benar.
-   Pembeli hanya boleh melihat atau membatalkan pesanan miliknya sesuai
    aturan status (ownership check).
-   Pastikan operasi checkout dan pembatalan idempoten jika endpoint
    berpotensi dikirim ulang.

**Selesai kalau:** stok konsisten untuk kasir dan mobile; harga dihitung
server; pembatalan mengembalikan stok tepat satu kali; transisi status
ilegal dan akses pesanan milik orang lain ditolak.

## Fase 6 --- Resep

-   Simpan file resep pada private storage, bukan public storage.
-   Akses file melalui endpoint terotorisasi untuk pemilik resep, staf
    yang berwenang, dan admin.
-   Staf dapat memvalidasi atau menolak resep.
-   Catat `validated_by`, `validated_at`, status, dan alasan penolakan
    jika relevan.
-   Hubungkan resep dengan pesanan dan pastikan checkout obat keras
    hanya dapat dilanjutkan jika resep memenuhi aturan.
-   Berikan notifikasi hasil validasi.

**Selesai kalau:** file resep tidak dapat diakses tanpa otorisasi;
status validasi tercatat; checkout obat keras menolak resep yang belum
disetujui.

## Fase 7 --- Pembayaran Midtrans (Sandbox)

-   Buat Snap token di server berdasarkan data pesanan yang tersimpan.
-   Jangan mempercayai nominal pembayaran dari klien.
-   Verifikasi signature callback Midtrans sebelum mengubah status
    pembayaran:
    `SHA512(order_id + status_code + gross_amount + ServerKey)`.
-   Cocokkan nominal callback dengan total pesanan.
-   Buat pemrosesan callback idempoten agar callback berulang tidak
    menggandakan efek.
-   Simpan Server Key hanya di `.env`/secret manager.
-   Gunakan URL publik melalui server uji atau tunnel saat menguji
    callback.

**Selesai kalau:** signature salah ditolak; callback sah mengubah status
dengan benar; callback berulang tidak menggandakan transaksi; nominal
diverifikasi.

## Fase 8 --- Notifikasi, Dashboard & Laporan

-   Endpoint notifikasi: daftar, jumlah belum dibaca, tandai dibaca, dan
    tandai semua dibaca.
-   Endpoint agregat dashboard: jumlah obat, antrean pesanan, stok
    masuk, stok menipis, dan grafik transaksi.
-   Terapkan filter tanggal dan role sesuai kebutuhan.
-   Sediakan laporan stok, transaksi, dan keuangan dalam PDF/Excel.
-   Pastikan query agregasi efisien dan data dibatasi berdasarkan hak
    akses.

**Selesai kalau:** angka dashboard sesuai data transaksi; filter tanggal
berjalan; laporan dapat diunduh oleh role berwenang; endpoint tidak
membocorkan data lintas role.

## Fase 9 --- AI Assistant

-   Buat perintah Artisan/job untuk membuat embedding data obat dan
    memperbaruinya saat data relevan berubah.
-   Gunakan pgvector untuk retrieval kemiripan (misalnya cosine
    distance) dan filter hanya obat yang aktif serta sesuai aturan
    akses.
-   Panggil Gemini melalui `AIService`; API key hanya berada di `.env`
    atau secret manager.
-   Terapkan dua lapis kontrol sesuai PRD:
    1.  Aplikasi menentukan data/konteks dan jenis pertanyaan yang boleh
        diproses.
    2.  System instruction membatasi perilaku model pada ruang lingkup
        Mediva.
-   Jangan menjadikan jawaban AI sebagai diagnosis atau pengganti tenaga
    kesehatan. Untuk pertanyaan medis berisiko, arahkan pengguna mencari
    bantuan profesional.
-   Terapkan fallback saat API gagal atau informasi tidak tersedia.
-   Terapkan rate limit per user dan logging tanpa menyimpan data
    sensitif yang tidak diperlukan.
-   Lindungi retrieval dan prompt dari prompt injection; jangan
    memperlakukan isi katalog atau input pengguna sebagai instruksi
    sistem.

**Selesai kalau:** pengujian mencakup pertanyaan relevan, tidak relevan,
ambigu, obat tidak ditemukan, konteks kosong, pertanyaan medis berisiko,
API gagal, dan prompt injection.

## Fase 10 --- Smart Recommendation

-   Catat `interaksi_penggunas` seperti `view`, `add_to_cart`, dan
    `purchase` sesuai desain database.
-   Buat kandidat rekomendasi berdasarkan:
    -   Produk populer dari agregasi transaksi.
    -   Co-purchase dari relasi `order_items`.
    -   Kemiripan semantik menggunakan pgvector jika tersedia dan
        relevan.
-   Buat `RecommendationService` untuk menggabungkan kandidat, memberi
    ranking, dan memfilter produk tidak aktif, stok habis, atau produk
    yang membutuhkan resep sesuai aturan.
-   Hindari rekomendasi yang menampilkan obat tidak tersedia atau
    melanggar aturan penjualan.

**Selesai kalau:** pengujian mencakup pengguna tanpa histori, pengguna
dengan histori, produk populer, produk terkait, stok habis, produk
nonaktif, dan kondisi tanpa kandidat.

## Fase 11 --- Pengerasan Keamanan & Pengujian

-   Audit autentikasi Bearer Token, otorisasi role, ownership,
    pencabutan token, dan masa berlaku token.
-   Validasi seluruh input dan file; terapkan rate limit pada endpoint
    sensitif.
-   Pastikan secret tidak ada di repository, log, response API, atau
    dokumentasi.
-   Pastikan `.env` diabaikan Git dan `.env.example` hanya berisi
    placeholder aman.
-   Jalankan `composer audit`, Larastan/PHPStan, pengujian otomatis, dan
    OWASP ZAP sesuai kesiapan aplikasi.
-   Perbarui threat model, termasuk ancaman upload resep, penyalahgunaan
    token, dan AI prompt injection.
-   Dokumentasikan API dengan OpenAPI/Scribe atau koleksi Postman
    sebagai kontrak untuk React dan Flutter.
-   Periksa index PostgreSQL, query lambat, dan index vector (misalnya
    HNSW) ketika volume embedding sudah memerlukannya.
-   Pastikan CORS sesuai origin resmi dan tidak mengaktifkan cookie
    credentials jika tidak digunakan.

**Selesai kalau:** test suite lulus; audit keamanan utama ditangani;
secret tidak terlacak di Git; dokumentasi API sinkron dengan
implementasi; akses endpoint telah diuji untuk setiap role.

## Fase 12 --- Integrasi Klien & Rilis

-   Integrasikan React web untuk staf/admin mengikuti desain Figma.
-   Integrasikan Flutter untuk pembeli.
-   Kedua klien menggunakan kontrak REST API dan Sanctum Bearer Token
    yang sama.
-   React dan Flutter menangani penyimpanan token sesuai platform,
    mengirim header Bearer, dan menghapus token lokal saat logout.
-   Integrasikan robot 3D untuk onboarding/login dan ikon AI sesuai
    rancangan UI.
-   Deploy ke VPS dengan Nginx dan HTTPS.
-   Siapkan CI/CD GitHub Actions.
-   Kelola `.env` dan seluruh secret di server, bukan di repository.
-   Jalankan migration production dengan `php artisan migrate --force`
    setelah backup dan pemeriksaan rilis.
-   Siapkan dokumentasi akhir, alur demo, dan checklist Success Criteria
    PRD.

**Selesai kalau:** React dan Flutter dapat login, mengakses endpoint
sesuai role, dan logout; deployment HTTPS berjalan; migration production
aman; checklist rilis dan demo terpenuhi.

------------------------------------------------------------------------

## Konfigurasi autentikasi dan runtime yang menjadi acuan

Untuk arsitektur Bearer Token, konfigurasi terkait di `.env` dapat
menggunakan:

``` env
# API Token Sanctum: tidak menggunakan SPA cookie authentication
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Pilihan runtime lokal; sesuaikan bila aplikasi sudah membutuhkan worker queue
CACHE_STORE=database
QUEUE_CONNECTION=database
```

Ketentuan penting:

-   Jangan menambahkan `SANCTUM_STATEFUL_DOMAINS` untuk autentikasi
    Bearer Token.
-   Jangan menambahkan `SESSION_DOMAIN` untuk autentikasi Bearer Token.
-   Jangan mengaktifkan `$middleware->statefulApi()` di
    `bootstrap/app.php` selama SPA cookie authentication tidak
    digunakan.
-   Tetap gunakan `auth:sanctum` pada route API terproteksi.
-   Pastikan `User` menggunakan `HasApiTokens` dan migration
    `personal_access_tokens` sudah diterapkan.
-   `CACHE_STORE=database` dan `QUEUE_CONNECTION=database` membutuhkan
    tabel `cache` dan `jobs` jika fitur tersebut digunakan. Pastikan
    migration terkait sudah diterapkan. Untuk lingkungan sederhana,
    driver dapat disesuaikan, tetapi keputusan harus konsisten dengan
    kebutuhan aplikasi.
-   `SESSION_DRIVER=file` menghindari kebutuhan tabel `sessions`;
    session bukan mekanisme autentikasi API Mediva.

## Ritme kerja setiap fase

1.  Tulis kontrak endpoint: method, path, autentikasi, role, request,
    dan response.
2.  Buat test terlebih dahulu atau bersamaan dengan implementasi.
3.  Implementasikan logika bisnis di service.
4.  Buat controller tetap tipis.
5.  Validasi request menggunakan Form Request dan format response
    menggunakan API Resource.
6.  Uji endpoint di Postman atau automated test.
7.  Periksa perubahan migration dan konsistensi database.
8.  Commit perubahan kecil dengan pesan yang jelas.
9.  Perbarui dokumentasi jika kontrak endpoint atau perilaku sistem
    berubah.

## Catatan perubahan dari roadmap lama

-   Menghapus pemisahan autentikasi Mobile JWT dan Web Sanctum SPA.
-   Mengganti seluruh autentikasi klien menjadi Sanctum Personal Access
    Token (Bearer Token), sesuai PRD.
-   Menghapus kebutuhan `SANCTUM_STATEFUL_DOMAINS`, cookie credentials,
    CSRF SPA, dan middleware `statefulApi()` untuk arsitektur ini.
-   Menegaskan bahwa tabel `personal_access_tokens` diperlukan,
    sedangkan tabel `sessions` tidak diperlukan untuk autentikasi API
    Token.
-   Menjaga cache dan queue sebagai keputusan runtime terpisah dari
    autentikasi.
