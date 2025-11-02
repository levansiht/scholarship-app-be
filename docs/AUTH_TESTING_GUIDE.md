# 🔐 Authentication Testing Guide - Quick Reference

## Quick Start (5 Steps)

### 1️⃣ Start Server

```bash
npm run start:dev
```

**Expected:** Server running on http://localhost:3000

### 2️⃣ Register User (Swagger UI)

1. Navigate to http://localhost:3000/api
2. Open **POST /auth/register**
3. Click **Try it out**
4. Use this JSON:

```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "role": "STUDENT"
}
```

5. Click **Execute**
6. **Expected:** 201 Created with user data (no password in response)

### 3️⃣ Login & Get Token

1. Open **POST /auth/login**
2. Click **Try it out**
3. Use this JSON:

```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

4. Click **Execute**
5. **Copy the `accessToken` from response!**

### 4️⃣ Authorize Swagger

1. Click **🔓 Authorize** button (top right)
2. Enter: `Bearer YOUR_ACCESS_TOKEN_HERE` (replace with actual token)
3. Click **Authorize**
4. Click **Close**

### 5️⃣ Test Protected Endpoint

1. Open any endpoint (e.g., **GET /users**)
2. Click **Try it out**
3. Click **Execute**
4. **Expected:** 200 OK with data (because you're authenticated!)

---

## 🧪 Test Scenarios

### ✅ Valid Scenarios

| Test               | Endpoint            | Body                        | Expected Result                    |
| ------------------ | ------------------- | --------------------------- | ---------------------------------- |
| Register new user  | POST /auth/register | `{ email, password, role }` | 201 Created                        |
| Login valid user   | POST /auth/login    | `{ email, password }`       | 200 OK + token                     |
| Access with token  | GET /users          | (with Authorization header) | 200 OK                             |
| Create scholarship | POST /scholarships  | (with valid token)          | 201 Created (uses current user ID) |
| Submit application | POST /applications  | (with valid token)          | 201 Created (uses current user ID) |

### ❌ Invalid Scenarios

| Test                      | Endpoint            | Body/Header               | Expected Result  |
| ------------------------- | ------------------- | ------------------------- | ---------------- |
| Register duplicate email  | POST /auth/register | Same email as existing    | 400 Bad Request  |
| Login wrong password      | POST /auth/login    | Wrong password            | 401 Unauthorized |
| Login non-existent user   | POST /auth/login    | Non-existent email        | 401 Unauthorized |
| Access without token      | GET /users          | (no Authorization header) | 401 Unauthorized |
| Access with invalid token | GET /users          | Invalid token             | 401 Unauthorized |
| Weak password             | POST /auth/register | Password: "123"           | 400 Bad Request  |
| Invalid email             | POST /auth/register | Email: "notanemail"       | 400 Bad Request  |

---

## 📋 Test Checklist

### Authentication Flow

- [ ] Register new STUDENT user
- [ ] Register new ADMIN user
- [ ] Register new SPONSOR user
- [ ] Login with valid credentials
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Verify JWT token format (3 parts separated by dots)

### Protected Endpoints

- [ ] Access GET /users without token (should fail with 401)
- [ ] Access GET /users with valid token (should succeed)
- [ ] Access GET /scholarships without token (should fail)
- [ ] Access GET /scholarships with valid token (should succeed)
- [ ] Create scholarship as ADMIN (should use current user ID)
- [ ] Submit application as STUDENT (should use current user ID)

### Token Management

- [ ] Copy token from login response
- [ ] Use token in Authorization header: `Bearer <token>`
- [ ] Verify token works for multiple requests
- [ ] Test with expired token (change JWT_EXPIRES_IN to 1m for testing)

### Validation Tests

- [ ] Register with weak password (< 8 chars) - should fail
- [ ] Register with email without uppercase/lowercase/number - should fail
- [ ] Register with invalid email format - should fail
- [ ] Register with invalid role - should fail
- [ ] Login with empty fields - should fail

---

## 🔑 Seeded Users (From Previous Phase)

You can also login with these pre-seeded users:

| Email                     | Password     | Role    | Status |
| ------------------------- | ------------ | ------- | ------ |
| admin@scholarship.com     | Password123! | ADMIN   | ACTIVE |
| sponsor1@company.com      | Password123! | SPONSOR | ACTIVE |
| sponsor2@organization.com | Password123! | SPONSOR | ACTIVE |
| student1@university.edu   | Password123! | STUDENT | ACTIVE |
| student2@university.edu   | Password123! | STUDENT | ACTIVE |
| student3@university.edu   | Password123! | STUDENT | ACTIVE |

---

## 🛠️ cURL Examples

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "role": "STUDENT"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!"
  }'
```

### Access Protected Endpoint

```bash
# Replace YOUR_TOKEN with actual token from login response
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Scholarship (Admin)

```bash
curl -X POST http://localhost:3000/scholarships \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "AI Research Scholarship",
    "description": "For students pursuing AI research",
    "amount": 75000000,
    "numberOfSlots": 5,
    "deadline": "2025-12-31T23:59:59Z",
    "startDate": "2025-11-15T00:00:00Z",
    "tags": ["AI", "Research"],
    "thumbnailUrl": "https://example.com/ai.jpg"
  }'
```

---

## 🚨 Common Issues & Solutions

### Issue: 401 Unauthorized

**Solution:** Make sure you:

1. Logged in successfully and got a token
2. Copied the full token (starts with "eyJ...")
3. Added "Bearer " before the token
4. Set Authorization header correctly

### Issue: 400 Bad Request - Password validation

**Solution:** Password must:

- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number

### Issue: 400 Bad Request - Email exists

**Solution:** Use a different email address (emails must be unique)

### Issue: Token expired

**Solution:** Login again to get a new token (tokens expire after 7 days by default)

### Issue: Can't access Swagger UI

**Solution:**

1. Check server is running: `npm run start:dev`
2. Navigate to http://localhost:3000/api (note the `/api` path)
3. Check console for any errors

---

## 📊 Expected Response Examples

### Register Success (201)

```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2025-10-29T10:00:00.000Z",
  "updatedAt": "2025-10-29T10:00:00.000Z"
}
```

### Login Success (200)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE2OTg1MDAwMDAsImV4cCI6MTY5OTEwNDgwMH0.signature",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "role": "STUDENT",
    "status": "ACTIVE"
  }
}
```

### Unauthorized (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Validation Error (400)

```json
{
  "statusCode": 400,
  "message": "Validation failed: Password must be at least 8 characters",
  "error": "Bad Request"
}
```

---

## 🎯 Success Criteria

✅ All tests pass:

- Can register new users
- Can login and receive JWT token
- Can access protected endpoints with token
- Cannot access protected endpoints without token
- Password validation works correctly
- Email validation works correctly
- Duplicate email registration fails
- Invalid credentials login fails

---

## 📚 Related Docs

- [Phase 8 Complete Documentation](./PHASE_8_AUTHENTICATION_COMPLETE.md) - Full implementation details
- [API Testing Guide](./API_TESTING_GUIDE.md) - Comprehensive testing guide

---

_Last Updated: October 29, 2025_
