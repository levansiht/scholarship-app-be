# 📚 API Documentation for Frontend

**Base URL:** `http://localhost:3000`  
**Swagger UI:** `http://localhost:3000/api/docs`

---

## 🔐 Authentication

All endpoints (except `/auth/*`) require JWT Bearer token in header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Scholarship Endpoints](#scholarship-endpoints)
- [Application Endpoints](#application-endpoints)
- [Role Permissions](#role-permissions)
- [Error Codes](#error-codes)

---

## 🔓 Authentication Endpoints

### 1. Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "Password123!",
  "role": "STUDENT" // STUDENT | SPONSOR | ADMIN
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "email": "student@example.com",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Validation Rules:**

- Email must be valid format
- Password: min 8 chars, must have uppercase, lowercase, number
- Role: STUDENT, SPONSOR, or ADMIN

---

### 2. Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "student@example.com",
  "password": "Password123!"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "role": "STUDENT",
    "status": "ACTIVE"
  }
}
```

**Token Expiry:** 1 hour

---

## 👤 User Endpoints

### 3. Get User by ID

```http
GET /users/:id
🔒 Auth Required | All Roles
```

**Response (200):**

```json
{
  "id": "uuid",
  "email": "student@example.com",
  "role": "STUDENT",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. List Users (Admin Only)

```http
GET /users?page=1&limit=10
🔒 Auth Required | ADMIN Only
```

**Query Parameters:**

- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10

**Response (200):**

```json
{
  "users": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

### 5. Update User (Admin Only)

```http
PATCH /users/:id
🔒 Auth Required | ADMIN Only
```

**Request Body:**

```json
{
  "role": "SPONSOR", // Optional
  "status": "SUSPENDED" // Optional
}
```

---

### 6. Change Password

```http
PATCH /users/:id/password
🔒 Auth Required | All Roles
```

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

### 7. Suspend User (Admin Only)

```http
PATCH /users/:id/suspend
🔒 Auth Required | ADMIN Only
```

**Request Body:**

```json
{
  "reason": "Violation of terms" // Optional
}
```

---

### 8. Activate User (Admin Only)

```http
PATCH /users/:id/activate
🔒 Auth Required | ADMIN Only
```

---

## 🎓 Scholarship Endpoints

### 9. Create Scholarship

```http
POST /scholarships
🔒 Auth Required | ADMIN or SPONSOR
```

**Request Body:**

```json
{
  "title": "Tech Innovation Scholarship 2024",
  "description": "Supporting students in technology...",
  "amount": 50000000,
  "numberOfSlots": 10,
  "deadline": "2024-12-31T00:00:00.000Z",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z", // Optional
  "tags": ["Technology", "Innovation"], // Optional, max 10 tags
  "thumbnailUrl": "https://example.com/image.jpg" // Optional
}
```

**Validation Rules:**

- Title: 10-200 characters
- Description: 50-5000 characters
- Amount: Must be positive number
- Slots: Minimum 1
- Deadline: Must be future date
- StartDate: Must be future date
- EndDate: Must be after startDate (if provided)
- Deadline: Must be before startDate
- Tags: Max 10 tags, each max 50 characters

**Response (201):**

```json
{
  "id": "uuid",
  "createdBy": "sponsor-uuid",
  "title": "Tech Innovation Scholarship 2024",
  "slug": "tech-innovation-scholarship-2024",
  "amount": 50000000,
  "currency": "VND",
  "numberOfSlots": 10,
  "availableSlots": 10,
  "status": "DRAFT",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 10. Update Scholarship

```http
PATCH /scholarships/:id
🔒 Auth Required | ADMIN or SPONSOR (own only)
```

**Request Body:** (all optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "deadline": "2025-01-31T00:00:00.000Z",
  "numberOfSlots": 15,
  "status": "OPEN" // DRAFT | OPEN | CLOSED
}
```

**Business Rules:**

- SPONSOR can only update scholarships they created
- Cannot reduce numberOfSlots below current applications count
- Deadline must be future date

**Response (200):** Updated scholarship object

**Errors:**

- `403`: Not the scholarship owner (SPONSOR)
- `400`: Cannot reduce slots below applications count

---

### 11. Publish Scholarship

```http
PATCH /scholarships/:id/publish
🔒 Auth Required | ADMIN or SPONSOR (own only)
```

**Response (200):**

```json
{
  "id": "uuid",
  "status": "OPEN",
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

**Business Rules:**

- SPONSOR can only publish their own scholarships
- Status changes from DRAFT → OPEN

---

### 12. Close Scholarship

```http
PATCH /scholarships/:id/close
🔒 Auth Required | ADMIN or SPONSOR (own only)
```

**Response (200):**

```json
{
  "id": "uuid",
  "status": "CLOSED"
}
```

**Business Rules:**

- SPONSOR can only close their own scholarships
- Status changes to CLOSED

---

### 13. Get Scholarship by ID

```http
GET /scholarships/:id
🔒 Auth Required | All Roles
```

**Response (200):**

```json
{
  "id": "uuid",
  "createdBy": "sponsor-uuid",
  "title": "Tech Innovation Scholarship 2024",
  "slug": "tech-innovation-scholarship-2024",
  "description": "Full description...",
  "amount": 50000000,
  "currency": "VND",
  "numberOfSlots": 10,
  "availableSlots": 8,
  "deadline": "2024-12-31T00:00:00.000Z",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z",
  "status": "OPEN",
  "tags": ["Technology", "Innovation"],
  "thumbnailUrl": "https://...",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 14. List Scholarships

```http
GET /scholarships?page=1&limit=10
🔒 Auth Required | All Roles
```

**Query Parameters:**

- `page` (optional): Default 1
- `limit` (optional): Default 10

**Response (200):**

```json
{
  "items": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 15. Search Scholarships

```http
GET /scholarships/search?keyword=tech&status=OPEN
🔒 Auth Required | All Roles
```

**Query Parameters:**

- `keyword` (optional): Search in title/description
- `minAmount` (optional): Minimum amount
- `maxAmount` (optional): Maximum amount
- `status` (optional): DRAFT | OPEN | CLOSED

**Response (200):**

```json
[
  {
    "id": "uuid",
    "title": "Tech Scholarship",
    "amount": 50000000,
    "status": "OPEN"
  }
]
```

---

## 📝 Application Endpoints

### 16. Submit Application

```http
POST /applications
🔒 Auth Required | STUDENT or ADMIN
```

**Request Body:**

```json
{
  "scholarshipId": "scholarship-uuid",
  "documents": [
    "https://drive.google.com/file1",
    "https://drive.google.com/file2"
  ] // Optional, array of URLs
}
```

**Validation Rules:**

- Cannot submit duplicate application (1 student = 1 application per scholarship)
- Cannot submit after deadline
- Cannot submit to CLOSED scholarship
- Cannot submit when slots = 0

**Response (201):**

```json
{
  "id": "uuid",
  "scholarshipId": "scholarship-uuid",
  "applicantId": "student-uuid",
  "status": "SUBMITTED",
  "submittedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**

- `409`: Duplicate application
- `400`: Deadline passed / Scholarship closed / No slots available

---

### 17. Get Application by ID

```http
GET /applications/:id
🔒 Auth Required | All Roles
```

**Response (200):**

```json
{
  "id": "uuid",
  "scholarshipId": "scholarship-uuid",
  "applicantId": "student-uuid",
  "status": "SUBMITTED",
  "coverLetter": "...",
  "additionalInfo": {...},
  "submittedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 18. List Applications

```http
GET /applications?page=1&limit=10&status=SUBMITTED
🔒 Auth Required | All Roles
```

**Query Parameters:**

- `page` (optional): Default 1
- `limit` (optional): Default 10
- `status` (optional): Filter by status
- `scholarshipId` (optional): Filter by scholarship

**Response (200):**

```json
{
  "items": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

### 19. Approve Application

```http
PATCH /applications/:id/approve
🔒 Auth Required | ADMIN or SPONSOR (own scholarships only)
```

**Business Rules:**

- SPONSOR can only approve applications for scholarships they created
- Status changes: SUBMITTED/UNDER_REVIEW → APPROVED
- Automatically decreases availableSlots by 1
- Automatically closes scholarship when availableSlots = 0

**Response (200):**

```json
{
  "id": "uuid",
  "status": "APPROVED",
  "decidedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**

- `403`: Not the scholarship owner (SPONSOR)
- `400`: Application not in correct status

---

### 20. Reject Application

```http
PATCH /applications/:id/reject
🔒 Auth Required | ADMIN or SPONSOR (own scholarships only)
```

**Business Rules:**

- SPONSOR can only reject applications for scholarships they created
- Status changes: SUBMITTED/UNDER_REVIEW → REJECTED

**Response (200):**

```json
{
  "id": "uuid",
  "status": "REJECTED",
  "decidedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 21. Withdraw Application

```http
PATCH /applications/:id/withdraw
🔒 Auth Required | STUDENT (own only) or ADMIN
```

**Business Rules:**

- STUDENT can only withdraw their own applications
- Cannot withdraw if status is APPROVED or REJECTED
- Status changes to WITHDRAWN

**Response (200):**

```json
{
  "id": "uuid",
  "status": "WITHDRAWN"
}
```

---

## 🔑 Role Permissions

| Endpoint                         | Public | STUDENT       | SPONSOR               | ADMIN |
| -------------------------------- | ------ | ------------- | --------------------- | ----- |
| POST /auth/register              | ✅     | ✅            | ✅                    | ✅    |
| POST /auth/login                 | ✅     | ✅            | ✅                    | ✅    |
| GET /users/:id                   | ❌     | ✅            | ✅                    | ✅    |
| GET /users                       | ❌     | ❌            | ❌                    | ✅    |
| PATCH /users/:id                 | ❌     | ❌            | ❌                    | ✅    |
| PATCH /users/:id/password        | ❌     | ✅            | ✅                    | ✅    |
| POST /scholarships               | ❌     | ❌            | ✅ (creates own)      | ✅    |
| PATCH /scholarships/:id          | ❌     | ❌            | ✅ (own only)         | ✅    |
| PATCH /scholarships/:id/publish  | ❌     | ❌            | ✅ (own only)         | ✅    |
| PATCH /scholarships/:id/close    | ❌     | ❌            | ✅ (own only)         | ✅    |
| GET /scholarships                | ❌     | ✅            | ✅                    | ✅    |
| GET /scholarships/:id            | ❌     | ✅            | ✅                    | ✅    |
| GET /scholarships/search         | ❌     | ✅            | ✅                    | ✅    |
| POST /applications               | ❌     | ✅            | ❌                    | ✅    |
| PATCH /applications/:id/approve  | ❌     | ❌            | ✅ (own scholarships) | ✅    |
| PATCH /applications/:id/reject   | ❌     | ❌            | ✅ (own scholarships) | ✅    |
| PATCH /applications/:id/withdraw | ❌     | ✅ (own only) | ❌                    | ✅    |

---

## ❌ Error Codes

### HTTP Status Codes

| Code | Meaning      | When                                             |
| ---- | ------------ | ------------------------------------------------ |
| 200  | OK           | Request successful                               |
| 201  | Created      | Resource created successfully                    |
| 400  | Bad Request  | Validation failed or business rule violated      |
| 401  | Unauthorized | No token or invalid token                        |
| 403  | Forbidden    | Valid token but insufficient permissions         |
| 404  | Not Found    | Resource doesn't exist                           |
| 409  | Conflict     | Duplicate resource (e.g., duplicate application) |
| 500  | Server Error | Something went wrong on server                   |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Error Messages

**Authentication Errors (401):**

- `"Unauthorized"` - No token provided
- `"Invalid token"` - Token is malformed or expired

**Authorization Errors (403):**

- `"Forbidden - Admin role required"`
- `"Forbidden - Admin or Sponsor role required"`
- `"You can only update scholarships created by you"`
- `"You can only approve applications for scholarships you created"`

**Validation Errors (400):**

- `"Deadline must be in the future"`
- `"End date must be after start date"`
- `"Deadline must be before start date"`
- `"Cannot reduce slots to X because there are already Y applications"`
- `"Application deadline has passed for this scholarship"`
- `"Scholarship is not open for applications"`
- `"No available slots"`

**Conflict Errors (409):**

- `"You have already applied to this scholarship"`

**Not Found Errors (404):**

- `"Scholarship with ID {id} not found"`
- `"Application with ID {id} not found"`
- `"User with ID {id} not found"`

---

## 🔄 Application Status Flow

```
DRAFT
  ↓ (student submits)
SUBMITTED
  ↓ (sponsor/admin reviews)
UNDER_REVIEW
  ↓
  ├─→ APPROVED (final state)
  └─→ REJECTED (final state)

WITHDRAWN (student can withdraw before APPROVED/REJECTED)
```

---

## 🎓 Scholarship Status Flow

```
DRAFT (created, not published)
  ↓ (sponsor/admin publishes)
OPEN (accepting applications)
  ↓ (sponsor/admin closes OR slots = 0)
CLOSED (no longer accepting)
```

---

## 💡 Tips for Frontend Integration

### 1. Token Management

```javascript
// Store token after login
localStorage.setItem('accessToken', response.accessToken);

// Add to all API requests
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
};
```

### 2. Handle Token Expiry

```javascript
// Check for 401 response
if (error.response?.status === 401) {
  // Clear token and redirect to login
  localStorage.removeItem('accessToken');
  router.push('/login');
}
```

### 3. Role-Based UI

```javascript
// Show/hide features based on user role
const userRole = user.role; // STUDENT | SPONSOR | ADMIN

if (userRole === 'SPONSOR') {
  // Show "Create Scholarship" button
}

if (userRole === 'STUDENT') {
  // Show "Apply" button
}
```

### 4. Date Handling

```javascript
// All dates are ISO 8601 strings
const deadline = new Date(scholarship.deadline);

// Format for display
const formatted = deadline.toLocaleDateString('vi-VN');
```

### 5. Pagination

```javascript
// Calculate total pages
const totalPages = Math.ceil(response.meta.total / response.meta.limit);

// Next page URL
const nextPage = `/scholarships?page=${currentPage + 1}&limit=10`;
```

---

## 📞 Support

- Swagger UI: `http://localhost:3000/api/docs` (Interactive API testing)
- Database Schema: See `DATABASE_DOCUMENTATION.md`

---

**Last Updated:** November 2, 2025
