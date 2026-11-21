# Penjelasan Hook untuk Automated Testing Postman

## 🎯 Apa itu Hook?

Hook adalah **otomasi** yang berjalan otomatis ketika terjadi event tertentu di Kiro IDE. Hook akan menjalankan action (perintah atau prompt) tanpa perlu Anda memicu secara manual.

---

## 🔄 Bagaimana Cara Kerja Hook?

```
Event Terjadi → Hook Terpicu → Aksi Dijalankan → Hasil
```

### Contoh:
```
Anda menyimpan file Controller → Hook terpicu → Hook menjalankan test Postman → Menampilkan hasil testing
```

---

## 🎪 Jenis-jenis Hook untuk Postman Testing

### 1️⃣ **PostFileSave Hook**
**Kapan terpicu?** Ketika Anda **menyimpan/save file** (Ctrl+S)

**Tujuan:** Jika developer mengubah controller/routes API, otomatis testing berjalan untuk memastikan tidak ada yang rusak.

**Contoh Skenario:**
```
Developer edit: /Backend/app/Http/Controllers/OrderController.php
↓
Tekan Ctrl+S (save)
↓
Hook terpicu
↓
Hook menjalankan Postman collection test untuk Orders endpoints
↓
Hasil: "❌ 2 test failed, ✅ 3 test passed"
↓
Developer melihat hasilnya dan bisa langsung perbaiki
```

### 2️⃣ **PostTaskExec Hook**
**Kapan terpicu?** Ketika Anda **menyelesaikan task** di Spec mode

**Tujuan:** Setelah selesai implementasi task, otomatis jalankan Postman test untuk verifikasi.

---

## 🔧 Opsi Hook untuk Postman Testing

### **Option A: Simple Notification (Recommended)**
Hook menjalankan test dan **menampilkan hasilnya** kepada Anda.

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Auto Test API on File Save",
      "trigger": "PostFileSave",
      "matcher": "Backend/(app/Http/Controllers/.*\\.php|routes/.*\\.php)$",
      "action": {
        "type": "agent",
        "prompt": "File API telah diubah. Jalankan Postman collection 'Mediva API' dengan environment 'Mediva Local' untuk memverifikasi endpoint masih berfungsi. Tampilkan hasil testing lengkap dengan status setiap endpoint dan tunjukkan error jika ada."
      }
    }
  ]
}
```

**Apa yang terjadi:**
- Anda edit Controller/Routes
- Simpan file (Ctrl+S)
- Kiro otomatis menjalankan Postman test
- Anda melihat hasil: ✅ atau ❌

---

### **Option B: Command-based Testing (Advanced)**
Hook menjalankan **PowerShell script** untuk testing.

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Auto Test API on Save",
      "trigger": "PostFileSave",
      "matcher": "Backend/app/Http/Controllers/.*\\.php$",
      "action": {
        "type": "command",
        "command": "powershell -Command \"Write-Host 'Testing Postman Collection...'; echo 'Hasil test akan dijalankan di Postman'\""
      }
    }
  ]
}
```

---

## 📊 Diagram Alur Hook

```
┌─────────────────┐
│  Developer      │
│  Edit File      │
└────────┬────────┘
         │
         ├─ Simpan (Ctrl+S)
         ↓
┌─────────────────────────────────────┐
│     PostFileSave Hook Terpicu        │
│  (matcher: .*Controller\.php$)      │
└────────┬────────────────────────────┘
         │
         ├─ Hook Action: "Agent"
         │   └─ Jalankan Postman test
         ↓
┌─────────────────────────────────────┐
│   Postman Collection Running         │
│  - Test Health Check                │
│  - Test Login                        │
│  - Test Orders CRUD                 │
│  - Test Error Handling              │
└────────┬────────────────────────────┘
         │
         ├─ Results:
         │  ✅ 18 passed
         │  ❌ 2 failed
         ↓
┌─────────────────────────────────────┐
│  Developer Melihat Hasil             │
│  Di Kiro IDE Chat                   │
└─────────────────────────────────────┘
         │
         ├─ Jika error: Perbaiki code
         ├─ Simpan ulang (Ctrl+S)
         └─ Hook terpicu lagi → Test ulang
```

---

## ⚙️ Cara Setup Hook untuk Postman

### Step 1: Buat Hook File

Di Kiro IDE, gunakan command palette:
- Tekan `Ctrl+Shift+P`
- Ketik: `Open Kiro Hook UI`
- Atau manual buat file di `.kiro/hooks/`

### Step 2: Konfigurasi Hook

**File**: `.kiro/hooks/postman-auto-test.json`

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Postman Auto Test on API File Change",
      "trigger": "PostFileSave",
      "matcher": "Backend/(app/Http/(Controllers|Requests)/.*\\.php|routes/api\\.php)$",
      "action": {
        "type": "agent",
        "prompt": "API backend file telah disimpan. Jalankan automated testing menggunakan Postman collection 'Mediva API' dengan environment 'Mediva Local'. Tampilkan hasil test lengkap: endpoint mana yang passed dan mana yang failed."
      }
    }
  ]
}
```

### Step 3: Konfigurasi Pattern (Matcher)

Pattern menentukan **file mana yang akan trigger hook**:

```regex
Backend/(app/Http/(Controllers|Requests)/.*\.php|routes/api\.php)$
```

Artinya: Hook terpicu ketika file **di folder berikut** di-save:
- `Backend/app/Http/Controllers/*.php` - Semua controller
- `Backend/app/Http/Requests/*.php` - Semua request validation
- `Backend/routes/api.php` - Routes file

---

## 🚀 Benefit Hook untuk Team Development

### Tanpa Hook (Manual Testing)
```
Developer code → Commit → CI/CD run test → Tunggu hasil → Perbaiki → Repeat
```
⏱️ Memakan waktu, perlu menunggu

### Dengan Hook (Automated)
```
Developer code → Save file (Ctrl+S) → Instant test result → Langsung tahu ada error
```
⚡ Instant feedback, langsung tahu masalah

---

## 💡 Use Cases

### 1. **Developer Mengubah Order Controller**
```
Anda edit: OrderController.php
↓ Save
↓ Hook terpicu
↓ Test Orders endpoints automatically
↓ Anda lihat hasil: "Update status endpoint failed - expected 200 got 500"
↓ Langsung debug & fix
```

### 2. **Tambah Validation Request Baru**
```
Anda tambah: CreateResepRequest.php
↓ Save
↓ Hook test POST /api/resep dengan validation
↓ Hasil: "✅ Validation working correctly"
```

### 3. **Update Routes**
```
Anda ubah: routes/api.php
↓ Save
↓ Hook test semua endpoint yang terpengaruh
↓ Pastikan tidak ada 404 atau routing error
```

---

## ⚠️ Catatan Penting

1. **Hook hanya berjalan di Kiro IDE** - Harus Anda gunakan Kiro untuk development
2. **Server harus berjalan** - Laravel server (`php artisan serve`) harus aktif untuk test berjalan
3. **Environment variable penting** - base_url di Postman harus sesuai (default: http://localhost:8000)
4. **Token perlu diupdate** - Jika token expired, test akan gagal auth
5. **Jangan simpan credentials di file** - Semua ID dan key disimpan di `.postman.json` (local only)

---

## 📋 Checklist Setup Hook

- [ ] Laravel server berjalan: `php artisan serve`
- [ ] Postman collection sudah dibuat: "Mediva API"
- [ ] Environment "Mediva Local" sudah ada
- [ ] base_url di environment benar: `http://localhost:8000`
- [ ] Hook file dibuat: `.kiro/hooks/postman-auto-test.json`
- [ ] Hook matcher pattern benar
- [ ] Test hook dengan save file Controller
- [ ] Credentials disimpan di local `.postman.json` (tidak di-push)

---

## 🔒 Security Notes

- Collection ID dan Environment ID disimpan di `.postman.json` (local only)
- Postman API Key tidak boleh disimpan di file yang di-push
- Semua credentials harus di-set di environment variable lokal
- `.postman.json` harus ada di .gitignore

