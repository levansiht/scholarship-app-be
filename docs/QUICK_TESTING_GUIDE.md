# 🎯 Quick Testing Cheat Sheet

## 🚀 Quick Start (3 commands)

```bash
# 1. Seed database (creates users + sample data)
npx prisma db seed

# 2. Start server
npm run start:dev

# 3. Open Swagger
# http://localhost:3000/api
```

---

## 📝 Test Flow (Copy-Paste Ready)

### 1️⃣ Get Admin UUID

**Endpoint**: GET /users  
**Result**: Copy the `id` of admin user

### 2️⃣ Create Scholarship

**Endpoint**: POST /scholarships

```json
{
  "createdBy": "PASTE_ADMIN_UUID_HERE",
  "title": "Full Tuition 2025",
  "description": "Full tuition for students",
  "amount": 50000000,
  "numberOfSlots": 10,
  "deadline": "2025-12-31T23:59:59Z",
  "startDate": "2025-11-01T00:00:00Z"
}
```

**Result**: Copy the scholarship `id`

### 3️⃣ Publish Scholarship

**Endpoint**: PATCH /scholarships/{id}/publish  
**Param**: scholarship ID from step 2

### 4️⃣ Submit Application

**Endpoint**: POST /applications

```json
{
  "scholarshipId": "PASTE_SCHOLARSHIP_ID_HERE",
  "documents": {
    "cv": "https://example.com/cv.pdf"
  }
}
```

**Result**: Copy the application `id`

### 5️⃣ Approve Application

**Endpoint**: PATCH /applications/{id}/approve  
**Param**: application ID from step 4

```json
{
  "notes": "Great application!"
}
```

---

## ✅ Expected Results

All endpoints should return:

- ✅ Status **201** (POST - Created)
- ✅ Status **200** (GET/PATCH - Success)
- ✅ JSON response with data

---

## 🔗 Seeded Login Credentials

| Role    | Email                 | Password     |
| ------- | --------------------- | ------------ |
| Admin   | admin@scholarship.com | Password123! |
| Sponsor | vingroup@sponsor.com  | Password123! |
| Student | student1@gmail.com    | Password123! |

---

## 🐛 Quick Fixes

**Problem**: Foreign key error  
**Solution**: Use admin UUID from GET /users

**Problem**: Deadline must be in future  
**Solution**: Use 2025 dates (after Oct 29, 2025)

**Problem**: Invalid UUID  
**Solution**: Get real UUID from GET /users, don't make up UUIDs

---

## 📊 All 21 Endpoints

### Users (7)

- POST /users - Create user
- GET /users/:id - Get by ID
- GET /users - List all
- PATCH /users/:id - Update
- PATCH /users/:id/password - Change password
- PATCH /users/:id/suspend - Suspend
- PATCH /users/:id/activate - Activate

### Scholarships (7)

- POST /scholarships - Create
- GET /scholarships/:id - Get by ID
- GET /scholarships - List
- GET /scholarships/search - Search
- PATCH /scholarships/:id - Update
- PATCH /scholarships/:id/publish - Publish
- PATCH /scholarships/:id/close - Close

### Applications (7)

- POST /applications - Submit
- GET /applications/:id - Get by ID
- GET /applications - List all
- GET /applications/user/:userId - User's apps
- PATCH /applications/:id/approve - Approve
- PATCH /applications/:id/reject - Reject
- PATCH /applications/:id/withdraw - Withdraw

---

**Full Guide**: `docs/API_TESTING_GUIDE.md`
