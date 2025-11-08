# System Logic & User Flows

## Table of Contents

- [1. System Overview](#1-system-overview)
- [2. User Roles & Capabilities](#2-user-roles--capabilities)
- [3. Student Flow](#3-student-flow)
- [4. Sponsor Flow](#4-sponsor-flow)
- [5. Admin Flow](#5-admin-flow)
- [6. Business Rules](#6-business-rules)

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

| Feature                      | STUDENT  | SPONSOR    | ADMIN    |
| ---------------------------- | -------- | ---------- | -------- |
| View scholarships            | ✅       | ✅         | ✅       |
| Search scholarships          | ✅       | ✅         | ✅       |
| Save scholarships (favorite) | ✅       | ❌         | ❌       |
| View categories              | ✅       | ✅         | ✅       |
| Create scholarship           | ❌       | ✅ (own)   | ✅ (any) |
| Update scholarship           | ❌       | ✅ (own)   | ✅ (any) |
| Delete scholarship           | ❌       | ✅ (own)   | ✅ (any) |
| Publish scholarship          | ❌       | ✅ (own)   | ✅ (any) |
| Close scholarship            | ❌       | ✅ (own)   | ✅ (any) |
| Add/Remove categories        | ❌       | ✅ (own)   | ✅ (any) |
| Upload scholarship docs      | ❌       | ✅ (own)   | ✅ (any) |
| Add/Edit requirements        | ❌       | ✅ (own)   | ✅ (any) |
| Set eligibility criteria     | ❌       | ✅ (own)   | ✅ (any) |
| Submit application           | ✅       | ❌         | ❌       |
| View applications            | ✅ (own) | ✅ (their) | ✅ (all) |
| Approve application          | ❌       | ✅ (their) | ✅ (all) |
| Reject application           | ❌       | ✅ (their) | ✅ (all) |
| Upload application docs      | ✅ (own) | ❌         | ❌       |
| Manage user profile          | ✅ (own) | ✅ (own)   | ✅ (own) |
| Create student profile       | ✅       | ❌         | ❌       |
| Create sponsor profile       | ❌       | ✅         | ❌       |
| Verify sponsor profile       | ❌       | ❌         | ✅       |
| Manage users                 | ❌       | ❌         | ✅       |

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

### 3.9. Lưu học bổng yêu thích (Save/Favorite)

**API:** `POST /scholarships/:id/save`

**Logic:**

- Student lưu scholarship vào danh sách yêu thích
- 1 scholarship chỉ lưu được 1 lần
- Dùng để xem lại sau

**API xem danh sách đã lưu:** `GET /scholarships/saved?page=1&limit=10`

**API bỏ lưu:** `DELETE /scholarships/:id/save`

**API kiểm tra đã lưu chưa:** `GET /scholarships/:id/is-saved`

---

### 3.10. Tạo Student Profile

**API:** `POST /students/profile`

```json
{
  "university": "Ho Chi Minh City University of Technology",
  "major": "Computer Science",
  "yearOfStudy": 3,
  "gpa": 3.75,
  "expectedGraduation": "2025-06-30",
  "skills": ["Java", "Python", "React", "Machine Learning"],
  "interests": ["AI Research", "Web Development"],
  "achievements": {
    "awards": ["First Prize in National Programming Contest 2023"],
    "publications": ["Paper on Deep Learning"],
    "certifications": ["AWS Certified Developer"]
  }
}
```

**Logic:**

- 1 student chỉ có 1 profile
- GPA range: 0.00-4.00
- yearOfStudy: 1-6
- Dùng để sponsor review khi xét duyệt

**API xem profile:** `GET /students/me/profile`

**API cập nhật:** `PATCH /students/me/profile`

**API xem public profile:** `GET /students/:userId/profile`

---

### 3.11. Quản lý Profile & Avatar

**API xem profile:** `GET /users/me/profile`

**API cập nhật profile:** `PATCH /users/me/profile`

```json
{
  "fullName": "Nguyen Van B",
  "phone": "+84987654321",
  "address": "456 Le Loi, Q1, TPHCM"
}
```

**API cập nhật avatar:** `PATCH /users/me/profile/avatar`

**File rules:**

- Max 5MB
- Types: JPG, PNG, JPEG
- Lưu trên Supabase Storage

---

### 3.12. Rút đơn application

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
2. Create student profile → Academic info (GPA, major, skills)
3. Update profile & avatar → Basic info + photo
4. Search scholarships → Tìm học bổng phù hợp
5. Save scholarships → Bookmark để xem lại
6. View details → Kiểm tra requirements, eligibility, deadline
7. Submit application → Nộp đơn (auto check eligibility)
8. Upload documents → Bảng điểm, thư giới thiệu, chứng chỉ
9. View my applications → Theo dõi status
10. [Optional] Withdraw → Rút đơn nếu PENDING
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

### 4.2. Tạo Sponsor Profile

**API:** `POST /sponsors/profile`

```json
{
  "organizationName": "FPT Corporation",
  "organizationType": "COMPANY",
  "website": "https://fpt.com.vn",
  "description": "Leading technology corporation in Vietnam",
  "foundedYear": 1988,
  "contactEmail": "scholarships@fpt.com.vn",
  "contactPhone": "+842839300300"
}
```

**Logic:**

- 1 sponsor chỉ có 1 profile
- organizationType: COMPANY, NGO, GOVERNMENT, INDIVIDUAL
- Mặc định isVerified = false
- Admin phải verify sau

**API xem profile:** `GET /sponsors/me/profile`

**API cập nhật:** `PATCH /sponsors/me/profile`

**API xem public profile:** `GET /sponsors/:userId/profile`

---

### 4.3. Tạo học bổng mới

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

### 4.4. Thêm Categories cho học bổng

**API:** `GET /scholarships/categories`

**Logic:**

- Xem tất cả categories có sẵn
- Public API

**API thêm category:** `POST /scholarships/:id/categories`

```json
{
  "categoryId": "cat-001"
}
```

**Logic:**

- 1 scholarship có thể có nhiều categories
- Giúp students filter dễ hơn

**API xóa category:** `DELETE /scholarships/:id/categories/:categoryId`

---

### 4.5. Upload tài liệu cho học bổng

**API:** `POST /scholarships/:scholarshipId/documents`

**Request:** FormData với fields:

- `file`: File (single)
- `title`: string
- `description`: string (optional)

**File rules:**

- Max 10MB per file
- Types: PDF, DOC, DOCX, JPG, PNG

**Logic:**

- Upload hướng dẫn, mẫu đơn, v.v.
- Students có thể download khi xem scholarship

**API list documents:** `GET /scholarships/:scholarshipId/documents`

**API get document:** `GET /scholarships/:scholarshipId/documents/:documentId`

**API download:** `GET /scholarships/:scholarshipId/documents/:documentId/download`

**API delete:** `DELETE /scholarships/:scholarshipId/documents/:documentId`

---

### 4.6. Thêm Requirements cho học bổng

**API:** `POST /scholarships/:scholarshipId/requirements`

```json
{
  "title": "Academic Transcript",
  "description": "Official transcript from your university",
  "isRequired": true,
  "displayOrder": 1
}
```

**Logic:**

- Liệt kê các yêu cầu/giấy tờ cần nộp
- displayOrder để sắp xếp thứ tự
- isRequired: bắt buộc hoặc tùy chọn

**API get requirements:** `GET /scholarships/:scholarshipId/requirements`

**API update:** `PATCH /scholarships/:scholarshipId/requirements/:requirementId`

**API delete:** `DELETE /scholarships/:scholarshipId/requirements/:requirementId`

---

### 4.7. Thiết lập Eligibility Criteria

**API:** `POST /scholarships/:scholarshipId/eligibility`

```json
{
  "minGpa": 3.5,
  "maxGpa": 4.0,
  "minAge": 18,
  "maxAge": 25,
  "allowedMajors": ["Computer Science", "Software Engineering"],
  "allowedYearsOfStudy": [2, 3, 4],
  "nationality": "Vietnamese",
  "otherRequirements": {
    "hasResearchExperience": true,
    "minPublications": 1
  }
}
```

**Logic:**

- Thiết lập tiêu chí đủ điều kiện chi tiết
- Tự động validate khi student apply
- 1 scholarship chỉ có 1 bộ criteria

**API get criteria:** `GET /scholarships/:scholarshipId/eligibility`

**API update:** `PATCH /scholarships/:scholarshipId/eligibility`

---

### 4.8. Cập nhật học bổng

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

### 4.9. Publish học bổng

**API:** `PATCH /scholarships/:id/publish`

**Logic:**

- Chuyển DRAFT → PUBLISHED
- Validate tất cả fields required đầy đủ
- Deadline phải tương lai
- Sau khi publish, students có thể xem và apply

---

### 4.10. Xem applications cho học bổng của mình

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

### 4.11. Review application: Approve

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

### 4.12. Review application: Reject

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

### 4.13. Đóng học bổng (Close)

**API:** `PATCH /scholarships/:id/close`

**Logic:**

- Chuyển PUBLISHED → CLOSED
- Không còn nhận applications mới
- Applications hiện tại vẫn được review

---

### 4.14. Xóa học bổng

**API:** `DELETE /scholarships/:id`

**Logic:**

- Chỉ xóa scholarship của mình
- Không thể xóa nếu đã có applications
- Soft delete (có thể restore)

---

### 🎯 Sponsor Flow Summary

```
1. Register/Login → Role SPONSOR
2. Create sponsor profile → Organization info + verification
3. Create scholarship → Status: DRAFT
4. Add categories → Tag scholarship với categories
5. Upload documents → Hướng dẫn, mẫu đơn
6. Add requirements → Danh sách giấy tờ cần nộp
7. Set eligibility criteria → Tiêu chí đủ điều kiện
8. Edit scholarship → Update thông tin
9. Publish scholarship → Public cho students
10. Receive applications → Students apply (auto check eligibility)
11. Review applications → Approve/Reject
12. Close scholarship → Hết hạn hoặc đủ số lượng
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
- `search`: Search by name or email

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
  "phone": "+84987654321",
  "status": "INACTIVE"
}
```

**Logic:**

- Cập nhật thông tin bất kỳ user
- Có thể đổi status: ACTIVE → INACTIVE/BANNED
- Ban user → user không login được

---

#### Change user password

**API:** `PATCH /users/:id/password`

```json
{
  "newPassword": "newSecurePass123"
}
```

**Logic:**

- Admin reset password cho user
- User sẽ phải đăng nhập lại

---

#### Suspend user

**API:** `PATCH /users/:id/suspend`

**Logic:**

- Tạm khóa tài khoản
- Status → INACTIVE
- User không thể đăng nhập

---

#### Activate user

**API:** `PATCH /users/:id/activate`

**Logic:**

- Kích hoạt lại tài khoản
- Status → ACTIVE
- User có thể đăng nhập trở lại

---

#### Verify sponsor profile

**API:** `PATCH /sponsors/:userId/verify`

**Logic:**

- Admin xác thực sponsor là tổ chức thật
- isVerified → true
- Hiển thị badge "Verified" trên UI

---

### 5.2. Quản lý Scholarships

Admin có thể làm **TẤT CẢ** những gì Sponsor làm được, nhưng cho **MỌI** scholarships:

- `GET /scholarships` - Xem tất cả (including DRAFT)
- `GET /scholarships/categories` - Quản lý categories
- `POST /scholarships` - Tạo cho bất kỳ sponsor
- `PATCH /scholarships/:id` - Update bất kỳ scholarship
- `POST /scholarships/:id/categories` - Add categories
- `DELETE /scholarships/:id/categories/:categoryId` - Remove categories
- `POST /scholarships/:scholarshipId/documents` - Upload documents
- `DELETE /scholarships/:scholarshipId/documents/:docId` - Delete documents
- `POST /scholarships/:scholarshipId/requirements` - Add requirements
- `PATCH /scholarships/:scholarshipId/requirements/:reqId` - Update requirements
- `DELETE /scholarships/:scholarshipId/requirements/:reqId` - Delete requirements
- `POST /scholarships/:scholarshipId/eligibility` - Set eligibility criteria
- `PATCH /scholarships/:scholarshipId/eligibility` - Update criteria
- `PATCH /scholarships/:id/publish` - Publish bất kỳ
- `PATCH /scholarships/:id/close` - Close bất kỳ
- `DELETE /scholarships/:id` - Delete bất kỳ (kể cả có applications)

**Logic:**

- Không bị giới hạn ownership
- Có thể tạo scholarship cho sponsor khác
- Có quyền xóa kể cả scholarship có applications
- Quản lý toàn bộ categories, documents, requirements, criteria

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
2. Manage users → View, update, suspend, activate, change password
3. Verify sponsors → Review and verify sponsor profiles
4. Manage scholarships → Full control (all sponsors)
   - Categories, Documents, Requirements, Eligibility Criteria
5. Manage applications → Review all applications
6. View statistics → System overview
7. System monitoring → Logs, errors, performance
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
- Validated against eligibility criteria if exists

**Deadline:**

- Phải là future date
- Check khi submit application

**File Upload:**

- **Application documents:** Max 5 files per request, Max 10MB per file
- **Scholarship documents:** Max 10MB per file
- **Avatar:** Max 5MB, JPG/PNG/JPEG only
- Types (documents): PDF, DOC, DOCX, JPG, PNG

**Student Profile:**

- GPA: 0.00-4.00
- yearOfStudy: 1-6
- skills, interests: arrays
- achievements: JSON object

**Sponsor Profile:**

- organizationType: COMPANY, NGO, GOVERNMENT, INDIVIDUAL
- website: valid URL format
- description: min 50 characters
- contactEmail: valid email

**Eligibility Criteria:**

- minGpa/maxGpa: 0.0-4.0, maxGpa >= minGpa
- minAge/maxAge: positive integers, maxAge >= minAge
- allowedMajors: array of strings
- allowedYearsOfStudy: array of integers 1-6
- otherRequirements: JSON object

---

### 6.4. Authorization Rules

**Ownership:**

- SPONSOR chỉ manage scholarships của mình (categories, documents, requirements, criteria)
- STUDENT chỉ manage applications của mình và có thể save scholarships
- ADMIN manage tất cả

**Role Guards:**

- Auth endpoints: Public
- Scholarships list/search/details: Public
- Categories list: Public
- Documents list/download: Public
- Requirements list: Public
- Eligibility criteria view: Public
- Student/Sponsor profile view: Public
- Create scholarship: SPONSOR, ADMIN
- Submit application: STUDENT
- Approve/Reject: SPONSOR (own), ADMIN (all)
- Save scholarship: STUDENT only
- Create student profile: STUDENT only
- Create sponsor profile: SPONSOR only
- Verify sponsor: ADMIN only
- User management: ADMIN only

---

### 6.5. Data Integrity

**Cascade Rules:**

- Delete User → Delete Student/Sponsor Profile, Scholarships + Applications
- Delete Scholarship → Delete Categories, Documents, Requirements, Criteria, Applications (chỉ admin)
- Suspend User → Không login được, scholarships vẫn hiển thị

**Unique Constraints:**

- User.email: Unique
- Application(studentId, scholarshipId): Unique (1 student 1 scholarship)
- StudentProfile.userId: Unique (1 student 1 profile)
- SponsorProfile.userId: Unique (1 sponsor 1 profile)
- EligibilityCriteria.scholarshipId: Unique (1 scholarship 1 criteria)

**JSON Fields:**

- StudentProfile.achievements: JSON (awards, publications, certifications)
- EligibilityCriteria.otherRequirements: JSON (custom requirements)

---

## API Quick Reference

### Public APIs (No Auth)

```
GET    /scholarships              - List scholarships
GET    /scholarships/search       - Search scholarships
GET    /scholarships/:id          - Get scholarship details
GET    /scholarships/categories   - List all categories
GET    /scholarships/:id/documents - List documents
GET    /scholarships/:id/documents/:docId - Get document
GET    /scholarships/:id/documents/:docId/download - Download document
GET    /scholarships/:id/requirements - List requirements
GET    /scholarships/:id/eligibility - Get eligibility criteria
GET    /sponsors/:userId/profile  - View sponsor profile (public)
GET    /students/:userId/profile  - View student profile (public)
POST   /auth/register             - Register
POST   /auth/login                - Login
GET    /health                    - Health check
```

### Student APIs

```
POST   /students/profile          - Create student profile
GET    /students/me/profile       - Get my student profile
PATCH  /students/me/profile       - Update my student profile
POST   /scholarships/:id/save     - Save scholarship (favorite)
DELETE /scholarships/:id/save     - Unsave scholarship
GET    /scholarships/saved        - Get saved scholarships
GET    /scholarships/:id/is-saved - Check if saved
POST   /applications              - Submit application
POST   /applications/:id/documents - Upload application documents
GET    /applications              - My applications
PATCH  /applications/:id/withdraw - Withdraw application
GET    /users/me/profile          - Get my profile
PATCH  /users/me/profile          - Update my profile
PATCH  /users/me/profile/avatar   - Update avatar
```

### Sponsor APIs

```
POST   /sponsors/profile          - Create sponsor profile
GET    /sponsors/me/profile       - Get my sponsor profile
PATCH  /sponsors/me/profile       - Update my sponsor profile
POST   /scholarships              - Create scholarship
PATCH  /scholarships/:id          - Update scholarship
PATCH  /scholarships/:id/publish  - Publish scholarship
PATCH  /scholarships/:id/close    - Close scholarship
DELETE /scholarships/:id          - Delete scholarship
POST   /scholarships/:id/categories - Add category
DELETE /scholarships/:id/categories/:catId - Remove category
POST   /scholarships/:id/documents - Upload document
DELETE /scholarships/:id/documents/:docId - Delete document
POST   /scholarships/:id/requirements - Add requirement
PATCH  /scholarships/:id/requirements/:reqId - Update requirement
DELETE /scholarships/:id/requirements/:reqId - Delete requirement
POST   /scholarships/:id/eligibility - Set eligibility criteria
PATCH  /scholarships/:id/eligibility - Update eligibility criteria
GET    /applications              - Applications for my scholarships
PATCH  /applications/:id/approve  - Approve application
PATCH  /applications/:id/reject   - Reject application
```

### Admin APIs

```
GET    /users                     - List all users
GET    /users/:id                 - Get user details
PATCH  /users/:id                 - Update any user
PATCH  /users/:id/password        - Change user password
PATCH  /users/:id/suspend         - Suspend user
PATCH  /users/:id/activate        - Activate user
PATCH  /sponsors/:userId/verify   - Verify sponsor profile
GET    /applications              - All applications
PATCH  /applications/:id/approve  - Approve any application
PATCH  /applications/:id/reject   - Reject any application
GET    /admin/statistics          - System statistics
+ All Sponsor APIs (for any scholarship)
```

---

## Complete User Journey Examples

### Example 1: Student Apply & Get Approved

```
1. Student registers → POST /auth/register { role: "STUDENT" }
2. Student logs in → POST /auth/login → Receives JWT token
3. Student creates profile → POST /students/profile { university, major, gpa, skills, ... }
4. Student updates avatar → PATCH /users/me/profile/avatar (FormData)
5. Student searches → GET /scholarships/search?field=STEM&minGpa=3.0
6. Student saves scholarship → POST /scholarships/550e8400-.../save
7. Student views details → GET /scholarships/550e8400-...
8. Student checks eligibility → GET /scholarships/550e8400-.../eligibility
9. Student applies → POST /applications { scholarshipId, currentGpa: 3.8, ... }
   → System auto-validates against eligibility criteria
10. Student uploads docs → POST /applications/990e8400-.../documents (FormData)
11. Sponsor reviews → PATCH /applications/990e8400-.../approve
12. Student checks status → GET /applications → status: APPROVED ✅
```

---

### Example 2: Sponsor Creates & Manages Scholarship

```
1. Sponsor registers → POST /auth/register { role: "SPONSOR" }
2. Sponsor creates profile → POST /sponsors/profile { organizationName, ... }
3. Admin verifies sponsor → PATCH /sponsors/660e8400-.../verify
4. Sponsor creates scholarship → POST /scholarships { title, amount, ... } → status: DRAFT
5. Sponsor adds categories → POST /scholarships/770e8400-.../categories { categoryId }
6. Sponsor uploads documents → POST /scholarships/770e8400-.../documents (FormData)
7. Sponsor adds requirements → POST /scholarships/770e8400-.../requirements { title, description, ... }
8. Sponsor sets eligibility → POST /scholarships/770e8400-.../eligibility { minGpa, allowedMajors, ... }
9. Sponsor edits scholarship → PATCH /scholarships/770e8400-... { amount: 40000000 }
10. Sponsor publishes → PATCH /scholarships/770e8400-.../publish → status: PUBLISHED
11. Students apply → (multiple applications received with auto eligibility check)
12. Sponsor reviews → GET /applications?scholarshipId=770e8400-...
13. Sponsor approves → PATCH /applications/abc123.../approve { comment }
14. Sponsor rejects → PATCH /applications/def456.../reject { reason }
15. Sponsor closes → PATCH /scholarships/770e8400-.../close → status: CLOSED
```

---

### Example 3: Admin Manages System

```
1. Admin logs in → POST /auth/login { email: "admin@...", password }
2. Admin views users → GET /users?status=ACTIVE
3. Admin suspends user → PATCH /users/user123/suspend
4. Admin verifies sponsor → PATCH /sponsors/sponsor123/verify
5. Admin views all scholarships → GET /scholarships (including DRAFT)
6. Admin publishes pending scholarship → PATCH /scholarships/xyz789/publish
7. Admin adds categories to scholarship → POST /scholarships/xyz789/categories
8. Admin views all applications → GET /applications
9. Admin overrides rejection → PATCH /applications/app123/approve
10. Admin views stats → GET /admin/statistics
11. Admin changes user password → PATCH /users/user123/password
12. Admin activates suspended user → PATCH /users/user123/activate
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

- Tạo profile (GPA, skills, achievements) → Tìm kiếm → Save yêu thích → Xem chi tiết + eligibility → Apply (auto-validate) → Upload documents → Theo dõi status

### Sponsor: Tạo và Quản Lý Học Bổng

- Tạo profile (organization info) → Verified by Admin → Tạo scholarship (DRAFT) → Add categories, documents, requirements, eligibility criteria → Edit → Publish → Nhận applications → Review (Approve/Reject) → Close

### Admin: Quản Trị Hệ Thống

- Full control users (suspend/activate, change password) → Verify sponsors → Manage scholarships (categories, documents, requirements, criteria) → Review all applications → Statistics & monitoring

**Total Features:**

- 13 Modules
- 54 API Endpoints
- 12 Domain Entities
- 3 User Roles (Student, Sponsor, Admin)
- Complete scholarship lifecycle management
- Automated eligibility validation
- File upload (documents & avatars)
- Detailed profiles for students and sponsors

**Swagger Documentation:** `http://localhost:3000/api/docs`

**API Reference:** `docs/API_GUIDE_FOR_FRONTEND.md`
