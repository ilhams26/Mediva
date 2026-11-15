# Fonnte Setup Guide - WhatsApp OTP Integration

**Setup Fonnte untuk Production Mediva**

---

## 📋 Step-by-Step Setup

### 1. Create Fonnte Account
1. Visit https://fonnte.com
2. Klik **"Daftar Gratis"**
3. Register dengan email & nomor HP
4. Verifikasi email
5. Login ke dashboard

---

### 2. Get API Token
1. Login ke Fonnte dashboard
2. Sidebar → **"Account"** → **"Device"**
3. Connect WhatsApp device:
   - Scan QR code dengan WhatsApp
   - Atau connect via phone number
4. Setelah connected → **"Setting"** → **"API Key"**
5. Copy API token (format: `xxxxxxxxxxxxxxxxxxxx`)

---

### 3. Configure Laravel Backend
Update `.env`:
```env
# TESTING MODE (Default - No WhatsApp sent)
FONNTE_ENABLED=false
FONNTE_TOKEN=null

# PRODUCTION MODE (Uncomment & fill after setup)
# FONNTE_ENABLED=true
# FONNTE_TOKEN=paste_your_token_here
```

**Important:**
- ✅ `.env` sudah di `.gitignore` (aman)
- ✅ `.env.example` hanya template (no real token)
- ❌ **NEVER** commit real token ke GitHub

---

### 4. Test Connection (Production Mode)
1. Enable production:
   ```env
   FONNTE_ENABLED=true
   FONNTE_TOKEN=your_actual_token
   ```

2. Clear cache:
   ```bash
   php artisan config:clear
   ```

3. Test register via Postman:
   ```bash
   POST /api/register
   {
       "username": "test_fonnte",
       "no_hp": "081234567890",
       "password": "password123",
       "password_confirmation": "password123"
   }
   ```

4. Check WhatsApp pada nomor `081234567890`

---

### 5. Monitor Quota
1. Dashboard Fonnte → **"Quota"**
2. Free tier: **1000 messages/month**
3. Monitor usage:
   - Registration OTP
   - Password reset OTP
   - Notification (future)

---

### 6. Error Handling

#### Fonnte API Failed
**Symptom:** Response `otp_sent: false`

**Check:**
1. `storage/logs/laravel.log` → Error message
2. Fonnte dashboard → Device status (connected?)
3. Quota tersisa?
4. Token valid?

#### WhatsApp Not Received
**Common Issues:**
1. Phone number format salah (must start with `628`)
2. WhatsApp number not registered
3. Device offline di Fonnte dashboard
4. Blocked by WhatsApp (spam)

---

### 7. Best Practices

#### Quota Management
- Testing: Use `FONNTE_ENABLED=false` (no quota usage)
- Development: Use personal number only
- Production: Monitor daily usage

#### Security
- ✅ Token stored in `.env` (not in code)
- ✅ `.env` in `.gitignore`
- ✅ Rate limiting on OTP endpoints
- ❌ Never share token publicly

#### Message Template
Current template (can customize in `FonteService.php`):
```
🏥 MEDIVA - Smart Medicine Platform

Kode verifikasi Anda: 123456

Berlaku 10 menit.

Jangan bagikan kode ini ke siapa pun.
```

---

## 🔥 Production Checklist

Before going live:
- [ ] Fonnte account verified
- [ ] WhatsApp device connected
- [ ] API token configured in `.env`
- [ ] `FONNTE_ENABLED=true` set
- [ ] Test with real phone number
- [ ] Message received successfully
- [ ] Quota monitored (set alert at 80%)
- [ ] Error logging enabled
- [ ] Rate limiting configured

---

## 📞 Support

**Fonnte Support:**
- Website: https://fonnte.com
- WhatsApp: +62 858-4949-4948
- Email: support@fonnte.com

**Documentation:**
- API Docs: https://fonnte.com/api
- FAQ: https://fonnte.com/faq

---

## 💡 Tips

### Switch Testing ↔ Production
```bash
# Switch to Testing (Development)
FONNTE_ENABLED=false

# Switch to Production
FONNTE_ENABLED=true
```

### Check Quota via Curl (Optional)
```bash
curl -X POST https://api.fonnte.com/quota \
  -H "Authorization: YOUR_TOKEN"
```

### Backup Strategy
Keep token secure:
1. Store in password manager (LastPass, 1Password)
2. Share dengan team lead only
3. Rotate token jika leaked

---

## Next Steps
1. Complete setup steps above
2. Test dalam Testing Mode dulu
3. Switch ke Production Mode
4. Monitor quota & errors
5. Ready untuk production deployment! 🚀
