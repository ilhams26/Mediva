# Mediva API Testing

## Overview
This directory contains the comprehensive API testing suite and results for the Mediva Laravel backend.

## Files

### 📄 `final-test-results.md`
Complete test report covering all 48+ endpoints across 7 phases:
- **Date:** 2026-11-24
- **Total Tests:** 53
- **Coverage:** 30.2%
- **Status:** 16 passed, 19 failed, 18 observed/skipped

#### Test Phases Covered:
1. **FASE 1:** Auth & Health (12 endpoints)
2. **FASE 2:** User Management (6 endpoints)
3. **FASE 3:** Product Catalog (10 endpoints)
4. **FASE 4:** Stock & Batch Management (5 endpoints)
5. **FASE 5:** POS Kasir (1 endpoint)
6. **FASE 6:** Orders & Payments (7 endpoints)
7. **FASE 7:** Resep / Prescriptions (4 endpoints)
8. **Authorization Matrix:** Cross-role authorization tests (6 tests)

### 🐍 `test_api.py`
Python script used to execute the comprehensive API tests. Can be re-run with:

```bash
python test_api.py
```

**Requirements:**
- Python 3.x
- `requests` library (`pip install requests`)

## Test Users
The following test users were used (must exist in database):

| Role  | Login ID       | Password   |
|-------|----------------|------------|
| Admin | 081234567890   | Admin123!  |
| Staff | 081234567891   | Staff123!  |
| Buyer | 081234567892   | Buyer123!  |

## Key Findings

### ✅ Working Endpoints
- Health check
- Authentication (login/logout)
- User profile retrieval
- Public catalog endpoints
- Prescription submission and listing
- Order listing

### ❌ Issues Found
1. **Rate Limiting (429):** Some endpoints hit throttle limits during testing
2. **Token Expiry:** After logout/re-login, some tokens became invalid
3. **Missing Data:** No obat records in database caused 404 errors
4. **Field Validation:** Some endpoints require different field names than documented
5. **Authorization:** Staff token had issues - requires investigation

### 🔍 Authorization Matrix Results
- ✓ Buyer correctly denied access to admin endpoints (403)
- ✓ Unauthenticated requests correctly return 401
- ✓ Buyer correctly denied access to staff-only endpoints (403)
- ✗ Admin token became invalid after re-login (should have been 403 for staff-only endpoints)

## Recommendations

1. **Seed Database:** Add sample obat, kategori, and batch data for testing
2. **Fix Staff Login:** Investigate why staff login returns 422 error
3. **Token Management:** Review token expiration and refresh logic
4. **Rate Limiting:** Adjust throttle settings for development/testing
5. **Field Names:** Standardize field names across endpoints (e.g., `password` vs `new_password`)
6. **Authorization:** Ensure role-based middleware is properly applied

## Re-running Tests

To re-run the comprehensive test suite:

```bash
# Navigate to the directory
cd c:\laragon\www\Mediva\Pengerjaan\Postman

# Ensure Laravel server is running on http://127.0.0.1:8000

# Run the test script
python test_api.py

# View results
# Results are saved to final-test-results.md
```

## Notes

- Tests are **read-only** where possible (no permanent data modifications)
- Test data created during execution is cleaned up when possible
- Some tests are skipped if prerequisites are not met (e.g., no test order ID)
- OTP-related endpoints were tested with dummy values to observe responses
- All HTTP requests were made with 10-second timeout

## Integration with Postman

The user has manually imported the Mediva API collection into Postman. This directory contains:
- Automated test results for reference
- Python script for regression testing
- Detailed endpoint coverage report

For manual testing, use the Postman collection. For automated/regression testing, use the Python script.

---

**Last Updated:** 2026-11-24  
**Test Environment:** http://127.0.0.1:8000/api  
**Laravel Version:** 11.x  
**Database:** MySQL via Laragon
