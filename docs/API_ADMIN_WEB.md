# API Documentation for Admin & Sponsor Web

> **Tài liệu tổng hợp toàn bộ API dành cho vai trò ADMIN và SPONSOR. Mỗi API đều ghi rõ quyền truy cập (ADMIN, SPONSOR, hoặc cả hai).**

---

## 1. Overview

- **Base URL:**
  - Production: `https://scholarship-app-be-production.up.railway.app`
  - Development: `http://localhost:3000`
  - Swagger: `{BASE_URL}/api/docs`
- **Authentication:** JWT Bearer Token in `Authorization` header
- **Roles:** `ADMIN`, `SPONSOR`, `STUDENT`

---

## 2. Role Capabilities

| Action                      | ADMIN    | SPONSOR           |
| --------------------------- | -------- | ----------------- |
| View scholarships           | ✅ (all) | ✅ (all)          |
| Create scholarship          | ✅ (any) | ✅ (own)          |
| Update scholarship          | ✅ (any) | ✅ (own)          |
| Publish/Close scholarship   | ✅ (any) | ✅ (own)          |
| Manage categories           | ✅       | ✅ (own)          |
| Manage requirements         | ✅       | ✅ (own)          |
| Manage eligibility          | ✅       | ✅ (own)          |
| View applications           | ✅ (all) | ✅ (own schlrshp) |
| Approve/Reject applications | ✅ (all) | ✅ (own schlrshp) |
| Manage users                | ✅       | ❌                |
| Verify sponsors             | ✅       | ❌                |
| Sponsor profile management  | ✅ (any) | ✅ (own)          |
| Health check                | ✅       | ✅                |

---

## 3. Authentication

### Register (Admin accounts must be created by another admin)

**POST /auth/register** (for STUDENT/SPONSOR only)

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "securePass123",
  "fullName": "Nguyen Van A",
  "role": "STUDENT",
  "phone": "+84912345678",
  "address": "123 Nguyen Hue, Q1, TPHCM",
  "dateOfBirth": "2000-01-15"
}
```

**Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "student@example.com",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2024-11-03T00:00:00.000Z",
  "updatedAt": "2024-11-03T00:00:00.000Z"
}
```

**Error:** 400 (Validation), 409 (Email exists)

**Business Logic:**

- Tạo tài khoản mới cho user (Student hoặc Sponsor)
- Password được hash tự động bằng bcrypt
- Status mặc định là ACTIVE
- Role ADMIN chỉ có thể tạo bởi Admin khác (không qua API này)

---

### Login

**POST /auth/login**

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "securePass123"
}
```

**Response (200):**

```json
{
  "access_token": "...",
  "user": {
    "id": "...",
    "email": "student@example.com",
    "role": "STUDENT",
    "fullName": "Nguyen Van A"
  }
}
```

**Error:** 401 (Invalid credentials), 403 (Banned/Inactive)

**Business Logic:**

- Xác thực email và password
- Trả về JWT token (expires in 24 hours)
- Token chứa: userId, email, role

---

## 4. Scholarship Management

### List Scholarships

**GET /scholarships?page=1&limit=10**  
**Permission:** ADMIN, SPONSOR
...existing code...

### Create Scholarship

**POST /scholarships**  
**Permission:** ADMIN (any sponsor), SPONSOR (own)
...existing code...

### Update Scholarship

**PATCH /scholarships/:id**  
**Permission:** ADMIN (any), SPONSOR (own)
...existing code...

### Publish Scholarship

**PATCH /scholarships/:id/publish**  
**Permission:** ADMIN (any), SPONSOR (own)
...existing code...

### Close Scholarship

**PATCH /scholarships/:id/close**  
**Permission:** ADMIN (any), SPONSOR (own)
...existing code...

### Add/Remove Category, Requirements, Eligibility, Documents

**Permission:** ADMIN (any), SPONSOR (own)
...existing code...

---

## 5. Sponsor Profile Management

### Create Sponsor Profile

**POST /sponsors/profile**  
**Permission:** SPONSOR (own)
**Request Body:**

```json
{
  "organizationName": "FPT Corporation",
  "contactEmail": "sponsor@fpt.com",
  "phone": "+84912345678",
  "address": "123 Nguyen Hue, Q1, TPHCM",
  "website": "https://fpt.com"
}
```

**Response (201):**

```json
{
  "id": "...",
  "userId": "...",
  "organizationName": "FPT Corporation",
  "contactEmail": "sponsor@fpt.com",
  ...
}
```

### Get My Sponsor Profile

**GET /sponsors/profile/me**  
**Permission:** SPONSOR (own)

### Update My Sponsor Profile

**PATCH /sponsors/profile**  
**Permission:** SPONSOR (own)

### Get Sponsor Profile by User ID

**GET /sponsors/profile/:userId**  
**Permission:** ADMIN (any), SPONSOR (own)

### Verify Sponsor (Admin)

**PATCH /sponsors/:id/verify**  
**Permission:** ADMIN

---

## 6. Application Management

### List Applications

**GET /applications**  
**Permission:** ADMIN (all), SPONSOR (own scholarships)

### Get Application Details

**GET /applications/:id**  
**Permission:** ADMIN (all), SPONSOR (own scholarships)

### Approve Application

**PATCH /applications/:id/approve**  
**Permission:** ADMIN (all), SPONSOR (own scholarships)

### Reject Application

**PATCH /applications/:id/reject**  
**Permission:** ADMIN (all), SPONSOR (own scholarships)

---

## 7. User Management (Admin only)

### Get User by ID

**GET /users/:id**  
**Permission:** ADMIN

### List Users

**GET /users**  
**Permission:** ADMIN

### Update User

**PATCH /users/:id**  
**Permission:** ADMIN

### Change User Password

**PATCH /users/:id/password**  
**Permission:** ADMIN

### Suspend User

**PATCH /users/:id/suspend**  
**Permission:** ADMIN

### Activate User

**PATCH /users/:id/activate**  
**Permission:** ADMIN

---

## 8. System

### Health Check

**GET /health**  
**Permission:** ADMIN, SPONSOR

---

## 9. Error Handling, Types, Notes

...existing code...

---

## 5. Scholarship Categories

### Get All Categories

- `GET /scholarships/categories`

### Add Category to Scholarship

- `POST /scholarships/:id/categories`

### Remove Category from Scholarship

- `DELETE /scholarships/:id/categories/:categoryId`

---

## 6. Scholarship Documents

### Upload Document

- `POST /scholarships/:scholarshipId/documents`

### List Documents

- `GET /scholarships/:scholarshipId/documents`

### Get Document Details

- `GET /scholarships/:scholarshipId/documents/:documentId`

### Download Document

- `GET /scholarships/:scholarshipId/documents/:documentId/download`

### Delete Document

- `DELETE /scholarships/:scholarshipId/documents/:documentId`

---

## 7. Scholarship Requirements

### Add Requirement

- `POST /scholarships/:scholarshipId/requirements`

### Get Requirements

- `GET /scholarships/:scholarshipId/requirements`

### Update Requirement

- `PATCH /scholarships/:scholarshipId/requirements/:requirementId`

### Delete Requirement

- `DELETE /scholarships/:scholarshipId/requirements/:requirementId`

---

## 8. Eligibility Criteria

### Set Eligibility Criteria

- `POST /scholarships/:scholarshipId/eligibility`

### Update Eligibility Criteria

- `PATCH /scholarships/:scholarshipId/eligibility`

### Get Eligibility Criteria

- `GET /scholarships/:scholarshipId/eligibility`

---

## 9. Application Management

### List Applications

- `GET /applications` (see Swagger for filters)

### Get Application Details

- `GET /applications/:id`

### Approve Application

- `PATCH /applications/:id/approve`

### Reject Application

- `PATCH /applications/:id/reject`

---

## 10. User Management

### Get User by ID

- `GET /users/:id`

### List Users

- `GET /users`

### Update User

- `PATCH /users/:id`

### Change User Password

- `PATCH /users/:id/password`

### Suspend User

- `PATCH /users/:id/suspend`

### Activate User

- `PATCH /users/:id/activate`

---

## 11. Sponsor Verification

### Verify Sponsor

- `PATCH /sponsors/:id/verify`

---

## 12. System

### Health Check

- `GET /health`

---

## 13. Error Handling

- Standard error format:

```json
{
  "statusCode": 400,
  "message": "Error message or array",
  "error": "Bad Request"
}
```

- See full error code table in main API guide.

---

## 14. TypeScript Types

- See `API_GUIDE_FOR_FRONTEND.md` for all types and enums used in responses.

---

## 15. Notes

- For request/response details, validation, and business logic, see the main API guide or Swagger docs.
- All endpoints require `Authorization: Bearer {token}` unless marked as public.
- Admin can perform all actions on any resource.

---

## 16. References

- **Swagger Documentation:** `{BASE_URL}/api/docs`
- **Main API Guide:** `docs/API_GUIDE_FOR_FRONTEND.md`
- **Last Updated:** November 2025
