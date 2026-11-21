# Postman Testing Setup - Mediva API

## 📌 Important: READ ME FIRST

> ⚠️ **SECURITY FIRST**: Semua credentials dan sensitive data disimpan di **`.postman.json` (LOCAL ONLY)**. File ini **TIDAK boleh di-push** ke repository.

---

## 📚 Dokumentasi

| File | Tujuan |
|------|--------|
| **collection-status.md** | Status 26 endpoint yang sudah dibuat |
| **TESTING-GUIDE.md** | Panduan lengkap cara testing |
| **HOOK-EXPLANATION.md** | Penjelasan otomasi hook untuk testing |
| **SUMMARY.md** | Ringkasan setup & cara menggunakan |
| **SECURITY-AUDIT.md** | Audit keamanan - semua passed ✅ |
| **README.md** | File ini |

---

## 🚀 Quick Start (5 Menit)

### 1. Setup Postman Local Config
Buat file `.postman.json` di root (local only, jangan push):

```json
{
  "workspaceId": "[WORKSPACE_ID_DARI_POSTMAN]",
  "collectionId": "[COLLECTION_ID_DARI_POSTMAN]",
  "environmentIds": {
    "local": "[ENV_ID_DARI_POSTMAN]"
  }
}
```

> Dapatkan ID dari Postman UI → Settings → Collection/Environment

### 2. Start Laravel Server
```bash
cd Backend
php artisan serve
```

### 3. Testing di Postman
- Buka workspace Postman
- Pilih collection "Mediva API"
- Pilih environment "Mediva Local"
- Mulai testing endpoints

### 4. Automated Testing dengan Hook
- Edit file controller di Backend
- Save (Ctrl+S)
- Hook otomatis menjalankan test
- Lihat hasil di Kiro chat

---

## ✅ Security Checklist

Sebelum push ke GitHub, pastikan:

- [ ] `.postman.json` **TIDAK** ada di repository (otomatis ignore)
- [ ] `Pengerjaan/` folder **TIDAK** ada di repository (otomatis ignore)
- [ ] `.env` file **TIDAK** ada di repository (otomatis ignore)
- [ ] Run `git status` - pastikan file di atas tidak ter-list
- [ ] Baca `SECURITY-AUDIT.md` - pastikan semua passed ✅

---

## 📊 26 Endpoint Coverage

### By Category
- **Public** (7) - Register, Login, Forgot Password, etc
- **Protected** (3) - User info, Logout, Change password
- **Orders** (5) - CRUD operations
- **Resep** (4) - Prescription management
- **Admin** (7) - User management

### By Status
- ✅ All endpoints created
- ✅ All with example bodies
- ✅ All with documentation
- ✅ Hook configured for auto-testing

---

## 🔄 Workflow

### Manual Testing
```
Edit file → Buka Postman → Click endpoint → Send → Check response
```

### Automated Testing (Hook)
```
Edit file → Ctrl+S → Hook triggers → Auto test → Results in Kiro chat
```

---

## 🔒 Security Features

| Feature | Status |
|---------|--------|
| No API key in documentation | ✅ |
| No Collection ID exposed | ✅ |
| No credentials hardcoded | ✅ |
| .gitignore properly configured | ✅ |
| Local config ignored by git | ✅ |
| Documentation safe for GitHub | ✅ |

---

## 📋 Environment Setup

### Postman Local Environment Variables
Set di "Mediva Local" environment:

```
base_url        = http://localhost:8000
access_token    = (update setelah login)
test_phone      = 081234567890
test_password   = (password test Anda)
```

### Important Notes
- Update `access_token` setelah login
- `base_url` untuk local dev: `http://localhost:8000`
- Jangan hardcode credentials di file

---

## 🐛 Troubleshooting

**"Connection refused"**
→ Pastikan Laravel server berjalan: `php artisan serve`

**"401 Unauthorized"**
→ Login ulang, update access_token di environment

**"Validation failed"**
→ Check JSON body format & required fields

**"500 Error"**
→ Cek Laravel log: `tail -f Backend/storage/logs/laravel.log`

---

## 📞 Support

1. **Baca dokumentasi** sesuai kebutuhan
   - Testing: `TESTING-GUIDE.md`
   - Hook: `HOOK-EXPLANATION.md`
   - Security: `SECURITY-AUDIT.md`

2. **Jalankan Laravel server**
   ```bash
   cd Backend
   php artisan serve
   ```

3. **Test manual dulu** sebelum setup hook

---

## 🎯 Next Steps

- [ ] Setup `.postman.json` (local only)
- [ ] Start Laravel server
- [ ] Test manual di Postman
- [ ] Verify hook works
- [ ] Push ke GitHub (aman ✅)

---

## ⚠️ REMEMBER

```
🚀 Push Documentation to GitHub - OK ✅
❌ Push .postman.json to GitHub - FORBIDDEN
❌ Push Pengerjaan/ folder to GitHub - FORBIDDEN
❌ Expose API keys - NEVER
```

---

**Status**: ✅ Safe for Production

All documentation is ready for GitHub. No credentials exposed.
Local configuration files are properly ignored.

Enjoy secure API testing! 🔒🚀

