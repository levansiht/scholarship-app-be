# System Logic & User Flows

## Table of Contents

- [1. System Overview](#1-system-overview)
- [2. User Roles & Capabilities](#2-user-roles--capabilities)
- [3. Student Flow](#3-student-flow)
- [4. Sponsor Flow](#4-sponsor-flow)
- [5. Admin Flow](#5-admin-flow)
- [6. Business Rules](#6-business-rules)

---

## 1. System Overview

Scholarship Management System là platform quản lý học bổng với 3 vai trò chính:

- **STUDENT**: Tìm kiếm và apply học bổng
- **SPONSOR**: Tạo và quản lý học bổng của mình
- **ADMIN**: Quản trị toàn bộ hệ thống

**Workflow chính:**

```
1. SPONSOR tạo scholarship (DRAFT) → Publish → PUBLISHED
2. STUDENT tìm scholarship → Apply → Submit documents
3. SPONSOR/ADMIN review application → APPROVE/REJECT
```

---

## 2. User Roles & Capabilities

| Feature             | STUDENT  | SPONSOR    | ADMIN    |
| ------------------- | -------- | ---------- | -------- |
| View scholarships   | ✅       | ✅         | ✅       |
| Search scholarships | ✅       | ✅         | ✅       |
| Create scholarship  | ❌       | ✅ (own)   | ✅ (any) |
| Update scholarship  | ❌       | ✅ (own)   | ✅ (any) |
| Delete scholarship  | ❌       | ✅ (own)   | ✅ (any) |
| Publish scholarship | ❌       | ✅ (own)   | ✅ (any) |
| Submit application  | ✅       | ❌         | ❌       |
| View applications   | ✅ (own) | ✅ (their) | ✅ (all) |
| Approve application | ❌       | ✅ (their) | ✅ (all) |
| Reject application  | ❌       | ✅ (their) | ✅ (all) |
| Upload documents    | ✅ (own) | ❌         | ❌       |
| Manage users        | ❌       | ❌         | ✅       |

---

## 3. Student Flow

### 3.1. Đăng ký tài khoản

**API:** `POST /auth/register`

```json
{
  "email": "student@example.com",
  "password": "securePass123",
  "fullName": "Nguyen Van A",
  "role": "STUDENT"
}
```

**Logic:**

- Email phải unique
- Password tự động hash bằng bcrypt
- Status mặc định: ACTIVE
- Không thể tự tạo role ADMIN

---

### 3.2. Đăng nhập

**API:** `POST /auth/login`

```json
{
  "email": "student@example.com",
  "password": "securePass123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "role": "STUDENT" }
}
```

**Logic:**

- Nhận JWT token (expires 24h)
- Lưu token để gửi kèm mọi request sau: `Authorization: Bearer {token}`

---

### 3.3. Xem danh sách học bổng

**API:** `GET /scholarships?page=1&limit=10`

**Logic:**

- Không cần đăng nhập
- Chỉ hiển thị scholarships có status = PUBLISHED
- Hỗ trợ phân trang
- Xem được: title, amount, deadline, requirements, GPA requirement

---

### 3.4. Tìm kiếm học bổng

**API:** `GET /scholarships/search?keyword=AI&field=STEM&minGpa=3.0`

**Query params:**

- `keyword`: Tìm trong title/description
- `field`: STEM, BUSINESS, ARTS...
- `minAmount`, `maxAmount`: Lọc theo số tiền
- `minGpa`: Lọc theo GPA tối thiểu

**Logic:**

- Không cần đăng nhập
- Kết hợp nhiều filter
- Chỉ search scholarships PUBLISHED

---

### 3.5. Xem chi tiết học bổng

**API:** `GET /scholarships/:id`

**Response:**

```json
{
  "id": "...",
  "title": "STEM Excellence Scholarship",
  "description": "...",
  "amount": 50000000,
  "deadline": "2024-12-31T23:59:59.000Z",
  "gpaRequirement": 3.5,
  "sponsor": {
    "id": "...",
    "fullName": "FPT Corporation",
    "email": "sponsor@fpt.com"
  }
}
```

**Logic:**

- Không cần đăng nhập
- Xem được thông tin sponsor
- Kiểm tra deadline còn hạn không

---

### 3.6. Nộp đơn apply

**API:** `POST /applications`

```json
{
  "scholarshipId": "550e8400-...",
  "studentId": "880e8400-...",
  "reason": "I am passionate about AI research... (min 100 chars)",
  "expectedGraduationDate": "2025-06-30",
  "currentGpa": 3.8,
  "major": "Computer Science",
  "achievement": "Winner of National Programming Contest 2023"
}
```

**Logic:**

- Phải đăng nhập với role STUDENT
- Scholarship phải PUBLISHED
- Deadline chưa quá hạn
- GPA phải >= gpaRequirement của scholarship
- 1 student chỉ apply 1 lần cho 1 scholarship
- Status ban đầu: PENDING
- `reason` tối thiểu 100 ký tự

**Business Rules:**

- Kiểm tra GPA đủ điều kiện
- Kiểm tra deadline
- Kiểm tra đã apply chưa (409 Conflict)

---

### 3.7. Upload tài liệu hỗ trợ

**API:** `POST /applications/:id/documents`

**Request:** FormData với field `files` (multiple)

**File rules:**

- Max 5 files per request
- Max 10MB per file
- Types: PDF, DOC, DOCX, JPG, PNG

**Logic:**

- Chỉ upload cho application của mình
- Application phải PENDING hoặc APPROVED
- Files lưu trên Supabase Storage
- Upload nhiều lần → append thêm
- Không có API xóa file

---

### 3.8. Xem applications của mình

**API:** `GET /applications/my-applications?page=1&limit=10`

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "scholarship": { "title": "...", "amount": 50000000 },
      "status": "PENDING",
      "submittedAt": "2024-11-03T10:30:00.000Z",
      "documents": [...]
    }
  ],
  "meta": { "page": 1, "total": 5, "totalPages": 1 }
}
```

**Logic:**

- Xem tất cả applications đã nộp
- Filter theo status: PENDING, APPROVED, REJECTED
- Xem được documents đã upload

---

### 3.9. Rút đơn application

**API:** `PATCH /applications/:id/withdraw`

**Logic:**

- Chỉ withdraw application của mình
- Chỉ withdraw được khi status = PENDING
- Sau khi withdraw: status → WITHDRAWN
- Không thể undo

---

### 🎯 Student Flow Summary

```
1. Register/Login → Nhận JWT token
2. Search scholarships → Tìm học bổng phù hợp
3. View details → Kiểm tra requirements, deadline, GPA
4. Submit application → Nộp đơn (check GPA, deadline)
5. Upload documents → Bảng điểm, thư giới thiệu, chứng chỉ...
6. View my applications → Theo dõi status
7. [Optional] Withdraw → Rút đơn nếu PENDING
```

---

## 4. Sponsor Flow

### 4.1. Đăng ký tài khoản Sponsor

**API:** `POST /auth/register`

```json
{
  "email": "sponsor@company.com",
  "password": "securePass123",
  "fullName": "FPT Corporation",
  "role": "SPONSOR"
}
```

**Logic:**

- Tương tự Student
- Chọn role = SPONSOR

---

### 4.2. Tạo học bổng mới

**API:** `POST /scholarships`

```json
{
  "title": "AI Research Scholarship 2024",
  "description": "Supporting students in AI research...",
  "amount": 30000000,
  "deadline": "2024-12-31T23:59:59.000Z",
  "requirements": "Computer Science major, GPA >= 3.5",
  "benefits": "30M VND for research expenses",
  "quantity": 5,
  "field": "STEM",
  "gpaRequirement": 3.5
}
```

**Response:**

```json
{
  "id": "770e8400-...",
  "title": "AI Research Scholarship 2024",
  "status": "DRAFT",
  "sponsorId": "660e8400-..."
}
```

**Logic:**

- Phải đăng nhập với role SPONSOR hoặc ADMIN
- Status ban đầu: DRAFT (chưa public)
- SPONSOR tự động là owner
- Chưa hiển thị cho students

**Validation:**

- title: min 10 chars
- description: min 50 chars
- amount: > 0
- deadline: phải là ngày tương lai
- quantity: > 0

---

### 4.3. Cập nhật học bổng

**API:** `PATCH /scholarships/:id`

```json
{
  "title": "Updated Title",
  "amount": 40000000,
  "deadline": "2025-01-31T23:59:59.000Z"
}
```

**Logic:**

- Chỉ update scholarship của mình
- Không thể update nếu:
  - Đã có applications VÀ đang PUBLISHED
  - Deadline về quá khứ
- Partial update (chỉ gửi fields cần đổi)

---

### 4.4. Publish học bổng

**API:** `PATCH /scholarships/:id/publish`

**Logic:**

- Chuyển DRAFT → PUBLISHED
- Validate tất cả fields required đầy đủ
- Deadline phải tương lai
- Sau khi publish, students có thể xem và apply

---

### 4.5. Xem applications cho học bổng của mình

**API:** `GET /scholarships/:scholarshipId/applications?page=1`

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "student": {
        "fullName": "Nguyen Van A",
        "email": "student@example.com"
      },
      "status": "PENDING",
      "currentGpa": 3.8,
      "major": "Computer Science",
      "reason": "...",
      "documents": [{ "fileName": "transcript.pdf", "fileUrl": "..." }],
      "submittedAt": "2024-11-03T10:30:00.000Z"
    }
  ],
  "meta": { "page": 1, "total": 10 }
}
```

**Logic:**

- Chỉ xem applications cho scholarship của mình
- Filter theo status: PENDING, APPROVED, REJECTED
- Xem được documents mà student upload

---

### 4.6. Review application: Approve

**API:** `PATCH /applications/:id/approve`

**Request:**

```json
{
  "reviewNote": "Congratulations! Your application meets all requirements."
}
```

**Logic:**

- Chỉ approve applications cho scholarship của mình
- Application phải đang PENDING
- Status: PENDING → APPROVED
- Set `reviewedAt` timestamp
- `reviewNote` optional

---

### 4.7. Review application: Reject

**API:** `PATCH /applications/:id/reject`

**Request:**

```json
{
  "reviewNote": "GPA does not meet the minimum requirement."
}
```

**Logic:**

- Chỉ reject applications cho scholarship của mình
- Application phải đang PENDING
- Status: PENDING → REJECTED
- `reviewNote` required (giải thích lý do)

---

### 4.8. Đóng học bổng (Close)

**API:** `PATCH /scholarships/:id/close`

**Logic:**

- Chuyển PUBLISHED → CLOSED
- Không còn nhận applications mới
- Applications hiện tại vẫn được review

---

### 4.9. Xóa học bổng

**API:** `DELETE /scholarships/:id`

**Logic:**

- Chỉ xóa scholarship của mình
- Không thể xóa nếu đã có applications
- Soft delete (có thể restore)

---

### 🎯 Sponsor Flow Summary

```
1. Register/Login → Role SPONSOR
2. Create scholarship → Status: DRAFT
3. Edit scholarship → Update thông tin
4. Publish scholarship → Public cho students
5. Receive applications → Students apply
6. Review applications → Approve/Reject
7. Close scholarship → Hết hạn hoặc đủ số lượng
```

---

## 5. Admin Flow

Admin có **FULL PERMISSIONS** - quản lý toàn bộ hệ thống.

### 5.1. Quản lý Users

#### List all users

**API:** `GET /users?page=1&role=STUDENT&status=ACTIVE`

**Query params:**

- `role`: Filter by STUDENT, SPONSOR, ADMIN
- `status`: Filter by ACTIVE, INACTIVE, BANNED

**Logic:**

- Xem tất cả users trong hệ thống
- Phân trang

---

#### View user details

**API:** `GET /users/:id`

**Logic:**

- Xem chi tiết bất kỳ user nào
- Bao gồm applications (nếu STUDENT) hoặc scholarships (nếu SPONSOR)

---

#### Update user

**API:** `PATCH /users/:id`

```json
{
  "fullName": "Updated Name",
  "status": "BANNED"
}
```

**Logic:**

- Cập nhật thông tin bất kỳ user
- Có thể đổi status: ACTIVE → INACTIVE/BANNED
- Ban user → user không login được

---

#### Delete user

**API:** `DELETE /users/:id`

**Logic:**

- Xóa bất kỳ user (trừ chính mình)
- Cascade delete: Xóa cả scholarships và applications liên quan

---

### 5.2. Quản lý Scholarships

Admin có thể làm **TẤT CẢ** những gì Sponsor làm được, nhưng cho **MỌI** scholarships:

- `GET /scholarships` - Xem tất cả (including DRAFT)
- `POST /scholarships` - Tạo cho bất kỳ sponsor
- `PATCH /scholarships/:id` - Update bất kỳ scholarship
- `PATCH /scholarships/:id/publish` - Publish bất kỳ
- `PATCH /scholarships/:id/close` - Close bất kỳ
- `DELETE /scholarships/:id` - Delete bất kỳ (kể cả có applications)

**Logic:**

- Không bị giới hạn ownership
- Có thể tạo scholarship cho sponsor khác
- Có quyền xóa kể cả scholarship có applications

---

### 5.3. Quản lý Applications

Admin có thể review **TẤT CẢ** applications:

- `GET /applications` - Xem tất cả applications
- `GET /applications/:id` - Chi tiết bất kỳ application
- `PATCH /applications/:id/approve` - Approve bất kỳ
- `PATCH /applications/:id/reject` - Reject bất kỳ

**Logic:**

- Không bị giới hạn theo scholarship ownership
- Override được quyết định của sponsor

---

### 5.4. Statistics & Reports

**API:** `GET /admin/statistics`

**Response:**

```json
{
  "totalUsers": 100,
  "totalStudents": 80,
  "totalSponsors": 15,
  "totalScholarships": 25,
  "publishedScholarships": 20,
  "totalApplications": 150,
  "pendingApplications": 30,
  "approvedApplications": 80,
  "rejectedApplications": 40
}
```

**Logic:**

- Dashboard overview
- Real-time statistics

---

### 🎯 Admin Flow Summary

```
1. Login → Role ADMIN
2. Manage users → View, update, ban, delete
3. Manage scholarships → Full control (all sponsors)
4. Manage applications → Review all applications
5. View statistics → System overview
6. System monitoring → Logs, errors, performance
```

---

## 6. Business Rules

### 6.1. Scholarship Lifecycle

```
DRAFT → (publish) → PUBLISHED → (close) → CLOSED
  ↓                      ↓
(delete)              (applications)
```

**Rules:**

- DRAFT: Chỉ owner/admin xem được
- PUBLISHED: Public, students có thể apply
- CLOSED: Không nhận applications mới
- Không thể publish nếu thiếu required fields
- Không thể delete nếu có applications (chỉ admin)

---

### 6.2. Application Lifecycle

```
PENDING → (approve) → APPROVED
   ↓
   → (reject) → REJECTED
   ↓
   → (withdraw) → WITHDRAWN
```

**Rules:**

- PENDING: Chờ review
- APPROVED: Đạt học bổng
- REJECTED: Không đạt (phải có `reviewNote`)
- WITHDRAWN: Student tự rút
- Chỉ PENDING mới có thể approve/reject/withdraw

---

### 6.3. Validation Rules

**Email:**

- Unique trong hệ thống
- Valid email format

**Password:**

- Min 6 characters
- Hash bằng bcrypt (10 rounds)

**GPA:**

- 0.0 - 4.0
- Application.currentGpa >= Scholarship.gpaRequirement

**Deadline:**

- Phải là future date
- Check khi submit application

**File Upload:**

- Max 5 files per request
- Max 10MB per file
- Types: PDF, DOC, DOCX, JPG, PNG

---

### 6.4. Authorization Rules

**Ownership:**

- SPONSOR chỉ manage scholarships của mình
- STUDENT chỉ manage applications của mình
- ADMIN manage tất cả

**Role Guards:**

- Auth endpoints: Public
- Scholarships list/search/details: Public
- Create scholarship: SPONSOR, ADMIN
- Submit application: STUDENT
- Approve/Reject: SPONSOR (own), ADMIN (all)
- User management: ADMIN only

---

### 6.5. Data Integrity

**Cascade Rules:**

- Delete User → Delete Scholarships + Applications
- Delete Scholarship → Delete Applications (chỉ admin)
- Ban User → Không login được

**Unique Constraints:**

- User.email: Unique
- Application(studentId, scholarshipId): Unique (1 student 1 scholarship)

---

## API Quick Reference

### Public APIs (No Auth)

```
GET    /scholarships              - List scholarships
GET    /scholarships/search       - Search scholarships
GET    /scholarships/:id          - Get scholarship details
POST   /auth/register             - Register
POST   /auth/login                - Login
GET    /health                    - Health check
```

### Student APIs

```
POST   /applications              - Submit application
POST   /applications/:id/documents - Upload documents
GET    /applications/my-applications - My applications
PATCH  /applications/:id/withdraw - Withdraw application
GET    /users/profile             - My profile
PATCH  /users/profile             - Update my profile
```

### Sponsor APIs

```
POST   /scholarships              - Create scholarship
PATCH  /scholarships/:id          - Update scholarship
PATCH  /scholarships/:id/publish  - Publish scholarship
PATCH  /scholarships/:id/close    - Close scholarship
DELETE /scholarships/:id          - Delete scholarship
GET    /scholarships/:id/applications - Applications for my scholarship
PATCH  /applications/:id/approve  - Approve application
PATCH  /applications/:id/reject   - Reject application
```

### Admin APIs

```
GET    /users                     - List all users
GET    /users/:id                 - Get user details
PATCH  /users/:id                 - Update any user
DELETE /users/:id                 - Delete any user
GET    /applications              - All applications
PATCH  /applications/:id/approve  - Approve any application
PATCH  /applications/:id/reject   - Reject any application
GET    /admin/statistics          - System statistics
```

---

## Complete User Journey Examples

### Example 1: Student Apply & Get Approved

```
1. Student registers → POST /auth/register { role: "STUDENT" }
2. Student logs in → POST /auth/login → Receives JWT token
3. Student searches → GET /scholarships/search?field=STEM&minGpa=3.0
4. Student views details → GET /scholarships/550e8400-...
5. Student applies → POST /applications { scholarshipId, currentGpa: 3.8, ... }
6. Student uploads docs → POST /applications/990e8400-.../documents (FormData)
7. Sponsor reviews → PATCH /applications/990e8400-.../approve
8. Student checks status → GET /applications/my-applications → status: APPROVED ✅
```

---

### Example 2: Sponsor Creates & Manages Scholarship

```
1. Sponsor registers → POST /auth/register { role: "SPONSOR" }
2. Sponsor creates → POST /scholarships { title, amount, ... } → status: DRAFT
3. Sponsor edits → PATCH /scholarships/770e8400-... { amount: 40000000 }
4. Sponsor publishes → PATCH /scholarships/770e8400-.../publish → status: PUBLISHED
5. Students apply → (multiple applications received)
6. Sponsor reviews → GET /scholarships/770e8400-.../applications
7. Sponsor approves → PATCH /applications/abc123.../approve { reviewNote }
8. Sponsor rejects → PATCH /applications/def456.../reject { reviewNote }
9. Sponsor closes → PATCH /scholarships/770e8400-.../close → status: CLOSED
```

---

### Example 3: Admin Manages System

```
1. Admin logs in → POST /auth/login { email: "admin@...", password }
2. Admin views users → GET /users?status=ACTIVE
3. Admin bans user → PATCH /users/user123 { status: "BANNED" }
4. Admin views all scholarships → GET /scholarships (including DRAFT)
5. Admin publishes pending scholarship → PATCH /scholarships/xyz789/publish
6. Admin views all applications → GET /applications
7. Admin overrides rejection → PATCH /applications/app123/approve
8. Admin views stats → GET /admin/statistics
```

---

## Error Handling Examples

### 1. Student Apply with Low GPA

```
POST /applications
{
  "scholarshipId": "...",
  "currentGpa": 3.2  // Scholarship requires 3.5
}

→ 422 Unprocessable Entity
{
  "statusCode": 422,
  "message": "Your GPA (3.2) does not meet the requirement (3.5)",
  "error": "Unprocessable Entity"
}
```

---

### 2. Student Apply Twice

```
POST /applications (second time)

→ 409 Conflict
{
  "statusCode": 409,
  "message": "You have already applied to this scholarship",
  "error": "Conflict"
}
```

---

### 3. Sponsor Update Other's Scholarship

```
PATCH /scholarships/other-sponsor-scholarship

→ 403 Forbidden
{
  "statusCode": 403,
  "message": "You do not have permission to access this scholarship",
  "error": "Forbidden"
}
```

---

### 4. Apply After Deadline

```
POST /applications (deadline passed)

→ 422 Unprocessable Entity
{
  "statusCode": 422,
  "message": "Application deadline has passed",
  "error": "Unprocessable Entity"
}
```

---

## Summary

### Student: Tìm và Apply Học Bổng

- Tìm kiếm → Xem chi tiết → Apply → Upload documents → Theo dõi status

### Sponsor: Tạo và Quản Lý Học Bổng

- Tạo (DRAFT) → Edit → Publish → Nhận applications → Review (Approve/Reject)

### Admin: Quản Trị Hệ Thống

- Full control users, scholarships, applications → Statistics & monitoring

**Swagger Documentation:** `http://localhost:3000/api/docs`

**API Reference:** `docs/API_GUIDE_FOR_FRONTEND.md`
