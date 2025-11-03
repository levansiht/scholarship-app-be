# API Documentation for Frontend

## Base Information

**Base URL**

```
Production: https://scholarship-app-be-production.up.railway.app
Development: http://localhost:3000
Swagger: {BASE_URL}/api/docs
```

**Authentication:** JWT Bearer Token in `Authorization` header

---

## Table of Contents

### Authentication

- [1. Register](#1-register)
- [2. Login](#2-login)

### Scholarships

- [3. List Scholarships](#3-list-scholarships)
- [4. Search Scholarships](#4-search-scholarships)
- [5. Get Scholarship Details](#5-get-scholarship-details)
- [6. Create Scholarship](#6-create-scholarship)
- [7. Update Scholarship](#7-update-scholarship)
- [8. Publish Scholarship](#8-publish-scholarship)

### Applications

- [9. Submit Application](#9-submit-application)
- [10. Upload Documents](#10-upload-documents)
- 11-15: Approve, Reject, Withdraw... (xem Swagger)

### Users & System

- APIs quản lý users (Admin only) - xem Swagger
- Health check endpoint

---

### 1. Register

```http
POST /auth/register
Content-Type: application/json
```

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

**Validation:**

- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `fullName`: Required, min 2 characters
- `role`: Required, enum: `STUDENT` | `SPONSOR`
- `phone`: Optional, format: `+84xxxxxxxxx`
- `address`: Optional, string
- `dateOfBirth`: Optional, ISO date format

**Success Response (201):**

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

**Error Responses:**

| Code | Error            | Description          |
| ---- | ---------------- | -------------------- |
| 400  | Validation Error | Invalid input fields |
| 409  | Conflict         | Email already exists |

```json
// 400 Example
{
  "statusCode": 400,
  "message": ["email must be a valid email", "password must be at least 6 characters"],
  "error": "Bad Request"
}

// 409 Example
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

**Business Logic:**

- Tạo tài khoản mới cho user (Student hoặc Sponsor)
- Password được hash tự động bằng bcrypt
- Status mặc định là ACTIVE
- Role ADMIN chỉ có thể tạo bởi Admin khác (không qua API này)

---

### 2. Login

```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "securePass123"
}
```

**Validation:**

- `email`: Required, string
- `password`: Required, string

**Success Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InN0dWRlbnRAZXhhbXBsZS5jb20iLCJyb2xlIjoiU1RVREVOVEITH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@example.com",
    "role": "STUDENT",
    "fullName": "Nguyen Van A"
  }
}
```

**Error Responses:**

| Code | Error        | Description                   |
| ---- | ------------ | ----------------------------- |
| 401  | Unauthorized | Invalid email or password     |
| 403  | Forbidden    | Account is INACTIVE or BANNED |

```json
// 401 Example
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}

// 403 Example
{
  "statusCode": 403,
  "message": "Your account has been banned",
  "error": "Forbidden"
}
```

**Business Logic:**

- Xác thực email và password
- Trả về JWT token (expires in 24 hours)
- Token chứa: userId, email, role
- Frontend lưu token vào localStorage và gửi kèm mọi request sau

---

### 3. List Scholarships

```http
GET /scholarships?page=1&limit=10
```

**Permission:** Public (no auth required)

**Query Parameters:**

| Parameter | Type   | Required | Default | Description               |
| --------- | ------ | -------- | ------- | ------------------------- |
| page      | number | No       | 1       | Page number               |
| limit     | number | No       | 10      | Items per page (max: 100) |

**Success Response (200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "STEM Excellence Scholarship 2024",
      "description": "Full scholarship for engineering students with outstanding academic records",
      "amount": 50000000,
      "deadline": "2024-12-31T23:59:59.000Z",
      "requirements": "GPA >= 3.5, STEM major, Research proposal",
      "benefits": "Full tuition + 5M VND monthly allowance",
      "quantity": 10,
      "status": "PUBLISHED",
      "field": "STEM",
      "gpaRequirement": 3.5,
      "sponsorId": "660e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Responses:**

| Code | Error       | Description                 |
| ---- | ----------- | --------------------------- |
| 400  | Bad Request | Invalid page or limit value |

**Business Logic:**

- Hiển thị danh sách tất cả scholarships đã PUBLISHED
- Không yêu cầu đăng nhập
- Hỗ trợ phân trang
- Status có thể là: DRAFT (chưa public), PUBLISHED (đang mở), CLOSED (đã đóng)

---

### 4. Search Scholarships

```http
GET /scholarships/search?keyword=AI&field=STEM&minAmount=10000000
```

**Permission:** Public

**Query Parameters:**

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| keyword   | string | No       | Search in title, description                 |
| field     | string | No       | Filter by field (STEM, BUSINESS, ARTS, etc.) |
| minAmount | number | No       | Minimum scholarship amount                   |
| maxAmount | number | No       | Maximum scholarship amount                   |
| minGpa    | number | No       | Minimum GPA requirement                      |
| status    | string | No       | Filter by status (default: PUBLISHED)        |
| page      | number | No       | Page number (default: 1)                     |
| limit     | number | No       | Items per page (default: 10)                 |

**Success Response (200):**

```json
{
  "data": [...],  // Same format as List Scholarships
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

**Business Logic:**

- Tìm kiếm scholarship theo nhiều tiêu chí
- Keyword search trong title và description
- Filter theo field (ngành học), amount (số tiền), GPA requirement
- Kết hợp được nhiều filter cùng lúc

---

### 5. Get Scholarship Details

```http
GET /scholarships/:id
```

**Permission:** Public

**Path Parameters:**

- `id`: Scholarship UUID

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "STEM Excellence Scholarship 2024",
  "description": "Full scholarship for engineering students...",
  "amount": 50000000,
  "deadline": "2024-12-31T23:59:59.000Z",
  "requirements": "GPA >= 3.5, STEM major",
  "benefits": "Full tuition + monthly allowance",
  "quantity": 10,
  "status": "PUBLISHED",
  "field": "STEM",
  "gpaRequirement": 3.5,
  "sponsorId": "660e8400-e29b-41d4-a716-446655440000",
  "sponsor": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "fullName": "FPT Corporation",
    "email": "sponsor@fpt.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**

| Code | Error     | Description                  |
| ---- | --------- | ---------------------------- |
| 404  | Not Found | Scholarship ID doesn't exist |

**Business Logic:**

- Xem chi tiết 1 scholarship
- Bao gồm thông tin sponsor
- Không cần đăng nhập

---

### 6. Create Scholarship

```http
POST /scholarships
Authorization: Bearer {token}
Content-Type: application/json
```

**Permission:** ADMIN, SPONSOR

**Request Body:**

```json
{
  "title": "AI Research Scholarship 2024",
  "description": "Supporting students in AI and Machine Learning research. This scholarship aims to foster innovation in artificial intelligence...",
  "amount": 30000000,
  "deadline": "2024-12-31T23:59:59.000Z",
  "requirements": "Computer Science major, GPA >= 3.5, Research proposal required",
  "benefits": "30M VND for research expenses, Mentorship program, Conference attendance",
  "quantity": 5,
  "field": "STEM",
  "gpaRequirement": 3.5
}
```

**Validation:**

- `title`: Required, min 10 characters
- `description`: Required, min 50 characters
- `amount`: Required, number > 0
- `deadline`: Required, ISO date, must be future date
- `requirements`: Required, string
- `benefits`: Required, string
- `quantity`: Required, number > 0
- `field`: Required, string
- `gpaRequirement`: Optional, number 0-4.0

**Success Response (201):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "title": "AI Research Scholarship 2024",
  "status": "DRAFT",
  "sponsorId": "660e8400-e29b-41d4-a716-446655440000",
  ...
}
```

**Error Responses:**

| Code | Error            | Description                  |
| ---- | ---------------- | ---------------------------- |
| 400  | Validation Error | Invalid fields               |
| 401  | Unauthorized     | Missing or invalid token     |
| 403  | Forbidden        | User is not ADMIN or SPONSOR |

```json
// 400 Example
{
  "statusCode": 400,
  "message": [
    "title must be at least 10 characters",
    "deadline must be a future date"
  ],
  "error": "Bad Request"
}
```

**Business Logic:**

- Tạo scholarship mới với status DRAFT
- SPONSOR chỉ tạo cho chính mình
- ADMIN có thể tạo cho bất kỳ sponsor nào
- Phải publish sau mới hiển thị cho students

---

### 7. Update Scholarship

```http
PATCH /scholarships/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Permission:** ADMIN, SPONSOR (own scholarships only)

**Path Parameters:**

- `id`: Scholarship UUID

**Request Body:** (partial update, chỉ gửi fields cần update)

```json
{
  "title": "Updated Title",
  "amount": 40000000,
  "deadline": "2025-01-31T23:59:59.000Z"
}
```

**Validation:** Same as Create

**Success Response (200):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "title": "Updated Title",
  "amount": 40000000,
  ...
}
```

**Error Responses:**

| Code | Error            | Description                                       |
| ---- | ---------------- | ------------------------------------------------- |
| 400  | Validation Error | Invalid fields                                    |
| 401  | Unauthorized     | Missing or invalid token                          |
| 403  | Forbidden        | Not owner or not ADMIN                            |
| 404  | Not Found        | Scholarship doesn't exist                         |
| 409  | Conflict         | Cannot update (has applications and is PUBLISHED) |

**Business Logic:**

- Update scholarship đã tạo
- SPONSOR chỉ update scholarship của mình
- ADMIN update được tất cả
- Không thể update nếu đã có applications và đang PUBLISHED
- Không thể đổi deadline về quá khứ

---

### 8. Publish Scholarship

```http
PATCH /scholarships/:id/publish
Authorization: Bearer {token}
```

**Permission:** ADMIN, SPONSOR (own scholarships only)

**Path Parameters:**

- `id`: Scholarship UUID

**Success Response (200):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "PUBLISHED",
  ...
}
```

**Error Responses:**

| Code | Error        | Description                             |
| ---- | ------------ | --------------------------------------- |
| 400  | Bad Request  | Missing required fields or invalid data |
| 401  | Unauthorized | Missing or invalid token                |
| 403  | Forbidden    | Not owner or not ADMIN                  |
| 404  | Not Found    | Scholarship doesn't exist               |

**Business Logic:**

- Chuyển scholarship từ DRAFT → PUBLISHED
- Sau khi publish, students có thể xem và apply
- Validate tất cả fields required phải đầy đủ
- Deadline phải là ngày tương lai

---

### 9. Submit Application

```http
POST /applications
Authorization: Bearer {token}
Content-Type: application/json
```

**Permission:** STUDENT only

**Request Body:**

```json
{
  "scholarshipId": "550e8400-e29b-41d4-a716-446655440000",
  "studentId": "880e8400-e29b-41d4-a716-446655440000",
  "reason": "I am passionate about AI research and have published 2 papers in international conferences. This scholarship will help me continue my research in deep learning and contribute to Vietnam's AI development.",
  "expectedGraduationDate": "2025-06-30",
  "currentGpa": 3.8,
  "major": "Computer Science",
  "achievement": "Winner of National Programming Contest 2023, Published 2 research papers"
}
```

**Validation:**

- `scholarshipId`: Required, valid UUID, must exist and be PUBLISHED
- `studentId`: Required, valid UUID, must match logged-in user
- `reason`: Required, min 100 characters
- `expectedGraduationDate`: Required, ISO date format
- `currentGpa`: Required, number 0-4.0
- `major`: Required, string
- `achievement`: Optional, string

**Success Response (201):**

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440000",
  "scholarshipId": "550e8400-e29b-41d4-a716-446655440000",
  "studentId": "880e8400-e29b-41d4-a716-446655440000",
  "status": "PENDING",
  "reason": "I am passionate about AI research...",
  "expectedGraduationDate": "2025-06-30T00:00:00.000Z",
  "currentGpa": 3.8,
  "major": "Computer Science",
  "achievement": "Winner of National Programming Contest 2023...",
  "documents": [],
  "submittedAt": "2024-11-03T10:30:00.000Z",
  "createdAt": "2024-11-03T10:30:00.000Z",
  "updatedAt": "2024-11-03T10:30:00.000Z"
}
```

**Error Responses:**

| Code | Error                | Description                                     |
| ---- | -------------------- | ----------------------------------------------- |
| 400  | Validation Error     | Invalid fields                                  |
| 401  | Unauthorized         | Not logged in or not STUDENT                    |
| 403  | Forbidden            | Not a student role                              |
| 404  | Not Found            | Scholarship doesn't exist                       |
| 409  | Conflict             | Already applied to this scholarship             |
| 422  | Unprocessable Entity | GPA doesn't meet requirement or deadline passed |

```json
// 409 Example
{
  "statusCode": 409,
  "message": "You have already applied to this scholarship",
  "error": "Conflict"
}

// 422 Example
{
  "statusCode": 422,
  "message": "Your GPA (3.2) does not meet the requirement (3.5)",
  "error": "Unprocessable Entity"
}
```

**Business Logic:**

- Student nộp đơn apply scholarship
- 1 student chỉ apply 1 lần cho 1 scholarship
- Scholarship phải đang PUBLISHED
- Deadline chưa quá hạn
- GPA phải đạt yêu cầu minimum
- Status ban đầu là PENDING (chờ duyệt)
- Application flow: PENDING → APPROVED/REJECTED/WITHDRAWN

---

### 10. Upload Documents

```http
POST /applications/:id/documents
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Permission:** STUDENT (own applications only)

**Path Parameters:**

- `id`: Application UUID

**Request Body:**

```
FormData with field name "files" (multiple files)
```

**File Validation:**

- Max files: 5 per request
- Max size: 10MB per file
- Allowed types: PDF, DOC, DOCX, JPG, PNG
- Field name: `files` (multiple)

**Success Response (200):**

```json
{
  "applicationId": "990e8400-e29b-41d4-a716-446655440000",
  "uploadedDocuments": [
    {
      "fileName": "transcript.pdf",
      "fileUrl": "https://xxxxx.supabase.co/storage/v1/object/public/scholarship-documents/990e8400/transcript.pdf",
      "fileSize": 2048576,
      "fileType": "application/pdf",
      "uploadedAt": "2024-11-03T10:35:00.000Z"
    },
    {
      "fileName": "recommendation-letter.pdf",
      "fileUrl": "https://xxxxx.supabase.co/storage/v1/object/public/scholarship-documents/990e8400/recommendation-letter.pdf",
      "fileSize": 1536789,
      "fileType": "application/pdf",
      "uploadedAt": "2024-11-03T10:35:00.000Z"
    }
  ],
  "totalDocuments": 2
}
```

**Error Responses:**

| Code | Error        | Description                       |
| ---- | ------------ | --------------------------------- |
| 400  | Bad Request  | Invalid file type, size, or count |
| 401  | Unauthorized | Not logged in                     |
| 403  | Forbidden    | Not owner of application          |
| 404  | Not Found    | Application doesn't exist         |

```json
// 400 Example
{
  "statusCode": 400,
  "message": "File size exceeds 10MB limit",
  "error": "Bad Request"
}
```

**Business Logic:**

- Upload tài liệu hỗ trợ cho application (bảng điểm, thư giới thiệu, chứng chỉ...)
- Chỉ upload được cho application của mình
- Application phải ở trạng thái PENDING hoặc APPROVED
- Files lưu trên Supabase Storage
- Có thể upload nhiều lần, files sẽ được append thêm
- Không có API xóa file (permanent storage)

---

**Các API còn lại (11-18) có format tương tự, xem Swagger để biết chi tiết:** `{BASE_URL}/api/docs`

---

## Error Handling

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Error message or array",
  "error": "Bad Request"
}
```

### HTTP Status Codes

| Code | Meaning              | When                    |
| ---- | -------------------- | ----------------------- |
| 200  | OK                   | Successful GET, PATCH   |
| 201  | Created              | Successful POST         |
| 400  | Bad Request          | Validation errors       |
| 401  | Unauthorized         | Missing/invalid token   |
| 403  | Forbidden            | No permission           |
| 404  | Not Found            | Resource doesn't exist  |
| 409  | Conflict             | Duplicate entry         |
| 422  | Unprocessable Entity | Business rule violation |
| 500  | Server Error         | Backend error           |

---

## Support

**Swagger Documentation:** `{BASE_URL}/api/docs`  
**Last Updated:** November 2024

---

## User Roles & Permissions

| Action              | STUDENT  | SPONSOR               | ADMIN    |
| ------------------- | -------- | --------------------- | -------- |
| View scholarships   | ✅       | ✅                    | ✅       |
| Create scholarship  | ❌       | ✅ (own)              | ✅ (any) |
| Submit application  | ✅       | ❌                    | ❌       |
| Approve application | ❌       | ✅ (own scholarships) | ✅ (all) |
| Upload documents    | ✅ (own) | ❌                    | ❌       |
| Manage users        | ❌       | ❌                    | ✅       |

---

## User Roles & Permissions

| Action              | STUDENT  | SPONSOR               | ADMIN    |
| ------------------- | -------- | --------------------- | -------- |
| View scholarships   | ✅       | ✅                    | ✅       |
| Create scholarship  | ❌       | ✅ (own)              | ✅ (any) |
| Submit application  | ✅       | ❌                    | ❌       |
| Approve application | ❌       | ✅ (own scholarships) | ✅ (all) |
| Upload documents    | ✅ (own) | ❌                    | ❌       |
| Manage users        | ❌       | ❌                    | ✅       |

---

## Error Handling

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Error message or array",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Code | Meaning      | When                                    |
| ---- | ------------ | --------------------------------------- |
| 200  | OK           | Successful GET, PATCH                   |
| 201  | Created      | Successful POST                         |
| 400  | Bad Request  | Validation errors, invalid input        |
| 401  | Unauthorized | Missing or invalid token                |
| 403  | Forbidden    | No permission for this action           |
| 404  | Not Found    | Resource doesn't exist                  |
| 409  | Conflict     | Duplicate entry (e.g., already applied) |
| 500  | Server Error | Backend error                           |

### Error Examples

**Validation Error (400):**

```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be at least 6 characters"
  ],
  "error": "Bad Request"
}
```

**Unauthorized (401):**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Forbidden (403):**

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this scholarship",
  "error": "Forbidden"
}
```

**Duplicate Application (409):**

```json
{
  "statusCode": 409,
  "message": "You have already applied to this scholarship",
  "error": "Conflict"
}
```

---

## User Permissions

| Action               | Student       | Sponsor                 | Admin    |
| -------------------- | ------------- | ----------------------- | -------- |
| View scholarships    | ✅            | ✅                      | ✅       |
| Create scholarship   | ❌            | ✅ (own)                | ✅ (any) |
| Update scholarship   | ❌            | ✅ (own)                | ✅ (any) |
| Submit application   | ✅ (own)      | ❌                      | ❌       |
| View application     | ✅ (own)      | ✅ (their scholarships) | ✅ (all) |
| Approve application  | ❌            | ✅ (their scholarships) | ✅ (all) |
| Withdraw application | ✅ (own)      | ❌                      | ❌       |
| Upload documents     | ✅ (own apps) | ❌                      | ❌       |
| Manage users         | ❌            | ❌                      | ✅       |

---

## TypeScript Types

```typescript
// User Types
export enum UserRole {
  STUDENT = 'STUDENT',
  SPONSOR = 'SPONSOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Scholarship Types
export enum ScholarshipStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  requirements: string;
  benefits: string;
  quantity: number;
  status: ScholarshipStatus;
  field: string;
  gpaRequirement?: number;
  sponsorId: string;
  createdAt: string;
  updatedAt: string;
}

// Application Types
export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface Application {
  id: string;
  scholarshipId: string;
  studentId: string;
  status: ApplicationStatus;
  reason: string;
  expectedGraduationDate: string;
  currentGpa: number;
  major: string;
  achievement?: string;
  documents: ApplicationDocument[];
  submittedAt: string;
  reviewedAt?: string;
}

export interface ApplicationDocument {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
```

---

## Support

For questions or issues:

- **Swagger Documentation:** `{BASE_URL}/api/docs`

---
