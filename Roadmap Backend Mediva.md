# Roadmap Backend Mediva — Laravel 12 + Supabase (PostgreSQL + pgvector)

*Kondisi awal: 13 migration sudah ter-apply di Supabase (semua tabel masih kosong), model Laravel sudah dibuat. Belum ada route, controller, service, auth, test.*

**Aturan emas:** satu sumber kebenaran skema = **migration Laravel**. Jangan ubah skema langsung dari dashboard Supabase atau tool lain, supaya tabel `migrations` tidak berbeda dengan kondisi database asli.

Urutan fase ikut dependency: fondasi → keamanan akses → data inti → stok → transaksi → fitur turunan → AI → pengerasan. Tiap fase punya **"Selesai kalau"** — jangan lanjut sebelum semuanya terpenuhi.

---

## Fase 0 — Koreksi Fondasi Database (sebelum ada data nyata)

Hasil audit skema vs PRD (detail ada di chat). Kerjakan lewat **migration baru** (karena belum ada data, `migrate:fresh` masih aman):

1. **RLS Supabase** — aktifkan Row Level Security di semua tabel `public` agar tidak terbuka lewat API Supabase + anon key. Tes dulu bahwa koneksi Laravel tetap jalan.
2. **Resep ↔ pesanan** — tambahkan `order_id` (nullable, FK) di `resep`, supaya checkout bisa memastikan resep sah untuk pesanan itu.
3. **Desain embedding** — tabel `obat_embeddings` menyimpan vector + teks sumber (`content`), dimensi kolom ditetapkan **768** sesuai model Gemini `text-embedding-004`.
4. **Constraint bisnis** — `CHECK (jumlah_sisa >= 0)` di `batches`, `CHECK (qty > 0)` di `order_items`.
5. **Jejak FEFO** — tambah `batch_id` (nullable, FK) di `pergerakan_stok`.
6. **Kolom Midtrans** di `orders` — mis. `midtrans_transaction_id`, `snap_token`, `paid_at`.
7. **Index** untuk foreign key yang sering di-query (`orders.user_id`, `order_items.order_id`, `order_items.obat_id`, `resep.user_id`, `notifikasis.user_id`, `pergerakan_stok.obat_id`).
8. **Primary key** untuk `interaksi_penggunas` dan tabel embedding.
9. **Users** — kolom `is_active` (untuk "nonaktifkan user"), simpan OTP dalam bentuk **hash**, samakan penulisan role (`staf` vs `staff`) di seluruh kode.
10. **Sanctum** — jalankan `php artisan install:api`, putuskan session driver (tabel `sessions` belum ada).
11. Seeder: 1 admin, 1 staf, 1 pembeli, beberapa kategori, 10–20 obat contoh, beberapa batch.

**Selesai kalau:** `php artisan migrate:fresh --seed` sukses, semua poin P1 audit teratasi, model punya `$table`/relasi/`$fillable`/casts yang cocok.

---

## Fase 1 — Fondasi API

- Struktur folder: `Controllers` → `Services` → `Models`, plus `Requests` (validasi) dan `Resources` (format JSON).
- Format respons seragam (sukses & error), handler exception global, `APP_DEBUG=false` di production.
- CORS untuk React (credentials aktif) dan konfigurasi domain stateful Sanctum.
- Middleware role (`pembeli`/`staf`/`admin`) dengan **satu nama alias saja** (pelajaran dari Project 2: alias di bootstrap dan route pernah beda).
- Rate limiter dasar (login, OTP, AI).

**Selesai kalau:** endpoint `/api/health` jalan, error selalu JSON tanpa stack trace, middleware role teruji.

## Fase 2 — Autentikasi & Pengguna

- Mobile (pembeli): register, login, logout, `/me`, JWT.
- Web (staf/admin): Sanctum SPA (cookie + CSRF).
- OTP: random, kedaluwarsa 5 menit, dibatasi jumlah percobaan dan permintaan, disimpan hash.
- Lupa/reset password, ganti password.
- Manajemen user (admin): CRUD, ubah role, nonaktifkan.
- Pembeli ditolak dari endpoint staf/admin; user nonaktif tidak bisa login.

**Selesai kalau:** feature test untuk login benar/salah, throttling, akses lintas role, OTP kedaluwarsa/percobaan habis.

## Fase 3 — Katalog

- CRUD kategori dan obat (staff), upload foto produk.
- Endpoint publik: daftar obat (paginasi, pencarian, filter kategori), detail obat.
- Stok total = jumlah `jumlah_sisa` seluruh batch (computed, bukan kolom).
- Obat keras: detail boleh dilihat tanpa login, tapi tidak bisa masuk keranjang/checkout tanpa resep tervalidasi.

**Selesai kalau:** katalog bisa difilter/dicari, obat nonaktif tidak muncul untuk pembeli.

## Fase 4 — Batch, Stok & FEFO

- `InventoryService`: tambah stok (buat batch), penyesuaian, daftar batch, peringatan stok menipis dan mendekati kedaluwarsa.
- FEFO: pilih batch `expired_date` terdekat yang masih punya sisa; kurangi `jumlah_sisa`; catat `pergerakan_stok` (+ `batch_id`).
- Semua dalam **DB transaction + row locking** (`lockForUpdate`) agar tidak balapan saat dua transaksi bersamaan.
- Batch kedaluwarsa tidak boleh dijual.

**Selesai kalau:** test FEFO (urutan batch, stok kurang, lintas batch, kedaluwarsa, concurrent) hijau.

## Fase 5 — Pesanan & Checkout

- **Satu `OrderService`** untuk semua jalur (kasir web & checkout mobile) — jangan ada dua logika stok.
- Checkout: validasi stok, cek resep untuk obat keras, hitung total di server (jangan percaya harga dari klien), buat `orders` + `order_items`, kurangi stok via FEFO.
- Status: `diproses → siap_diambil → selesai`, atau `dibatalkan` (stok dikembalikan). Aturan transisi status ditulis jelas.
- Pembeli hanya bisa lihat/batalkan pesanan miliknya yang masih di proses (ownership check).

**Selesai kalau:** stok konsisten antara kasir dan mobile, pembatalan mengembalikan stok, transisi ilegal ditolak.

## Fase 6 — Resep

- Upload ke **private storage** (bukan public); akses file lewat endpoint terotorisasi (pemilik, staf, admin).
- Staf validasi/tolak, catat `validated_by` dan `validated_at`, kirim notifikasi hasil.
- Resep terhubung ke pesanan.

**Selesai kalau:** URL file resep tidak bisa dibuka tanpa login yang berhak.

## Fase 7 — Pembayaran Midtrans (Sandbox)

- Buat Snap token dari data pesanan di server.
- Callback: **verifikasi signature** (`SHA512(order_id + status_code + gross_amount + server_key)`) sebelum mengubah `payment_status`.
- Idempoten (callback ganda tidak menggandakan efek), cocokkan jumlah dengan total pesanan.
- Butuh URL publik untuk callback saat uji (VPS atau tunnel).

**Selesai kalau:** callback dengan signature salah ditolak, callback sah mengubah status satu kali.

## Fase 8 — Notifikasi, Dashboard & Laporan

- Endpoint notifikasi: daftar, jumlah belum dibaca, tandai dibaca, tandai semua.
- Endpoint agregat dashboard (jumlah obat, antrean pesanan, obat masuk, obat menipis, grafik transaksi).
- Laporan stok/transaksi/keuangan: PDF dan Excel.

## Fase 9 — AI Assistant

- Perintah artisan/job untuk membuat embedding semua obat (dan memperbarui saat obat berubah).
- Retrieval pgvector (cosine) + filter obat aktif; kirim konteks ke Gemini lewat `AIService` (key hanya di `.env`).
- Dua lapis kontrol (PRD §19): aplikasi menentukan data & pertanyaan yang boleh; system instruction membatasi perilaku model.
- Fallback saat API gagal/informasi tidak ada, rate limit per user, log tanpa data sensitif.
- Uji 7 kasus wajib (valid, tidak relevan, ambigu, produk tidak ditemukan, konteks kosong, pertanyaan medis berisiko, API gagal) + uji prompt injection.

## Fase 10 — Smart Recommendation

- Pencatatan `interaksi_penggunas` (view / add_to_cart / purchase).
- Kandidat: populer (agregasi), co-purchase (self-join `order_items`), semantik (pgvector).
- `RecommendationService` menggabungkan + memfilter (aktif, stok ada, aturan resep) + ranking.
- Uji 7 kasus wajib (tanpa histori, dengan histori, populer, terkait, stok habis, nonaktif, tanpa kandidat).

## Fase 11 — Pengerasan & Pengujian

- Checklist keamanan PRD §18: authz & ownership, rate limit, validasi, error aman, secret tidak di repo.
- Larastan, `composer audit`, OWASP ZAP; perbarui threat model termasuk ancaman AI.
- Dokumentasi API (OpenAPI/Scribe atau koleksi Postman) — ini juga kontrak untuk React dan Flutter.
- Index vector (HNSW) bila data embedding sudah banyak; cek query lambat.

## Fase 12 — Klien & Rilis

- React web (staf/admin) mengikuti desain Figma → Flutter pembeli → robot 3D login & ikon AI.
- Deploy: VPS + Nginx + HTTPS, CI/CD GitHub Actions, `migrate --force`, secret dikelola di server.
- Dokumentasi akhir, alur demo, checklist Success Criteria PRD §34.

---

## Ritme kerja per fase (supaya tidak berantakan)

1. Tulis kontrak endpoint (method, path, request, response) → 2. test dulu/bersamaan → 3. service → 4. controller tipis → 5. uji di Postman → 6. commit kecil.
