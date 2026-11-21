# Postman Collection Status - Mediva API

**Collection**: Mediva API
**Workspace**: Ilham Ghazali's Workspace
**Total Endpoints**: 26

> ⚠️ **KEAMANAN**: Collection ID dan Environment ID disimpan di `.postman.json` (local only, tidak di-push ke git)

---

## ✅ Endpoint yang Sudah Ditambahkan

### Public Endpoints (7)
- [x] GET `/api/health` - Health check
- [x] POST `/api/register` - Register user
- [x] POST `/api/verify-otp-register` - Verify OTP Register
- [x] POST `/api/login` - Login
- [x] POST `/api/forgot-password` - Request reset password
- [x] POST `/api/verify-otp` - Verify OTP reset
- [x] POST `/api/reset-password` - Reset password

### Protected Endpoints (3)
- [x] GET `/api/user` - Get current user
- [x] POST `/api/logout` - Logout
- [x] POST `/api/change-password` - Change password

### Orders (5)
- [x] GET `/api/orders` - Get all orders
- [x] POST `/api/orders` - Create order
- [x] GET `/api/orders/1` - Get order detail
- [x] PATCH `/api/orders/1/status` - Update order status
- [x] POST `/api/orders/1/cancel` - Cancel order

### Resep (4)
- [x] GET `/api/resep` - Get all resep
- [x] POST `/api/resep` - Create resep
- [x] GET `/api/resep/1` - Get resep detail
- [x] POST `/api/resep/1/validate` - Validate resep

### Admin Endpoints (7)
- [x] GET `/api/obat/count` - Get obat count
- [x] GET `/api/users` - Get all users
- [x] POST `/api/users` - Create user
- [x] GET `/api/users/1` - Get user detail
- [x] PUT `/api/users/1` - Update user
- [x] DELETE `/api/users/1` - Delete user
- [x] PATCH `/api/users/1/status` - Toggle user status

---

## Environment Variables

Setup di Postman environment "Mediva Local":

| Variable | Value | Sensitive |
|----------|-------|-----------|
| `base_url` | `http://localhost:8000` | ❌ No |
| `access_token` | (dari login response) | ✅ Yes |
| `test_phone` | `081234567890` | ❌ No |
| `test_password` | (update dengan password Anda) | ✅ Yes |

---

## Testing Manual Flow

1. **Health Check** → GET /api/health (no auth)
2. **Register** → POST /api/register
3. **Verify OTP** → POST /api/verify-otp-register
4. **Login** → POST /api/login
5. **Save Token** → Copy access_token ke environment variable
6. **Get User** → GET /api/user (test authenticated)
7. **Create Order** → POST /api/orders

---

## 🔒 Security Notes

- Collection ID dan Environment ID disimpan di `.postman.json` (local only)
- Postman API Key tidak boleh disimpan di repo
- Sensitive variables harus di-set di local environment
- Jangan commit `.postman.json`

