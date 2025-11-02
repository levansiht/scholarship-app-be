# 🧪 Phase 7 API Testing Guide

## 📋 Prerequisites

1. ✅ Database seeded with initial data:

   ```bash
   npx prisma db seed
   ```

2. ✅ Server running:

   ```bash
   npm run start:dev
   ```

3. ✅ Open Swagger UI:
   ```
   http://localhost:3000/api
   ```

---

## 👥 Step 1: Get Admin User UUID

### GET /users

1. Click on "Users" section → GET /users
2. Click "Try it out"
3. Leave page=1, limit=10
4. Click "Execute"
5. **Copy the `id` field of the user with `role: "ADMIN"`**
   - Example: `"550e8400-e29b-41d4-a716-446655440000"`

📝 You'll need this UUID for creating scholarships!

---

## 🎓 Step 2: Create a Scholarship

### POST /scholarships

1. Click on "Scholarships" section → POST /scholarships
2. Click "Try it out"
3. Use this JSON (update `createdBy` with admin UUID from Step 1):

```json
{
  "createdBy": "YOUR_ADMIN_UUID_HERE",
  "title": "Full Tuition Scholarship 2025",
  "description": "Full tuition coverage for undergraduate students with excellent academic records",
  "amount": 50000000,
  "numberOfSlots": 10,
  "deadline": "2025-12-31T23:59:59Z",
  "startDate": "2025-11-01T00:00:00Z",
  "tags": ["undergraduate", "merit-based"]
}
```

4. Click "Execute"
5. ✅ **Expected**: Status 201, scholarship created
6. **Copy the scholarship `id`** from response for next steps

---

## 📝 Step 3: List Scholarships

### GET /scholarships

1. Click on "Scholarships" section → GET /scholarships
2. Click "Try it out"
3. Set page=1, limit=10
4. Click "Execute"
5. ✅ **Expected**: See your created scholarship in the list

---

## 🔍 Step 4: Get Scholarship by ID

### GET /scholarships/{id}

1. Click on "Scholarships" section → GET /scholarships/{id}
2. Click "Try it out"
3. Paste the scholarship ID from Step 2
4. Click "Execute"
5. ✅ **Expected**: Full scholarship details returned

---

## 🔎 Step 5: Search Scholarships

### GET /scholarships/search

1. Click on "Scholarships" section → GET /scholarships/search
2. Click "Try it out"
3. Try searching with keyword: `"undergraduate"`
4. Click "Execute"
5. ✅ **Expected**: List of matching scholarships

---

## ✏️ Step 6: Update Scholarship

### PATCH /scholarships/{id}

1. Click on "Scholarships" section → PATCH /scholarships/{id}
2. Click "Try it out"
3. Enter scholarship ID
4. Use this JSON:

```json
{
  "title": "Updated Full Tuition Scholarship 2025",
  "numberOfSlots": 15
}
```

5. Click "Execute"
6. ✅ **Expected**: Updated scholarship returned

---

## 📢 Step 7: Publish Scholarship

### PATCH /scholarships/{id}/publish

1. Click on "Scholarships" section → PATCH /scholarships/{id}/publish
2. Click "Try it out"
3. Enter scholarship ID
4. Click "Execute"
5. ✅ **Expected**: Scholarship status changed to "PUBLISHED"

---

## 📄 Step 8: Submit Application

### POST /applications

1. Get a student user ID from GET /users (role: "STUDENT")
2. Click on "Applications" section → POST /applications
3. Click "Try it out"
4. Use this JSON:

```json
{
  "scholarshipId": "YOUR_SCHOLARSHIP_ID_HERE",
  "documents": {
    "cv": "https://example.com/cv.pdf",
    "transcript": "https://example.com/transcript.pdf",
    "motivation": "I am passionate about..."
  }
}
```

5. Click "Execute"
6. ✅ **Expected**: Status 201, application created
7. **Copy the application `id`** for next steps

---

## 📋 Step 9: List Applications

### GET /applications

1. Click on "Applications" section → GET /applications
2. Click "Try it out"
3. Optional: filter by status (e.g., "SUBMITTED")
4. Click "Execute"
5. ✅ **Expected**: List of applications

---

## 👤 Step 10: Get User's Applications

### GET /applications/user/{userId}

1. Click on "Applications" section → GET /applications/user/{userId}
2. Click "Try it out"
3. Enter student user ID
4. Click "Execute"
5. ✅ **Expected**: List of applications for that user

---

## ✅ Step 11: Approve Application

### PATCH /applications/{id}/approve

1. Click on "Applications" section → PATCH /applications/{id}/approve
2. Click "Try it out"
3. Enter application ID
4. Use this JSON:

```json
{
  "notes": "Excellent application with outstanding academic records"
}
```

5. Click "Execute"
6. ✅ **Expected**: Application status changed to "APPROVED"

---

## ❌ Step 12: Reject Application

### PATCH /applications/{id}/reject

1. Create another application first (repeat Step 8)
2. Click on "Applications" section → PATCH /applications/{id}/reject
3. Click "Try it out"
4. Enter application ID
5. Use this JSON:

```json
{
  "reason": "Does not meet minimum GPA requirement",
  "notes": "Applicant can reapply next semester"
}
```

6. Click "Execute"
7. ✅ **Expected**: Application status changed to "REJECTED"

---

## 🔙 Step 13: Withdraw Application

### PATCH /applications/{id}/withdraw

1. Create another application first (repeat Step 8)
2. Click on "Applications" section → PATCH /applications/{id}/withdraw
3. Click "Try it out"
4. Enter application ID
5. Click "Execute"
6. ✅ **Expected**: Application status changed to "WITHDRAWN"

---

## 🚫 Step 14: Close Scholarship

### PATCH /scholarships/{id}/close

1. Click on "Scholarships" section → PATCH /scholarships/{id}/close
2. Click "Try it out"
3. Enter scholarship ID
4. Click "Execute"
5. ✅ **Expected**: Scholarship status changed to "CLOSED"

---

## 🎉 Testing Complete!

If all steps work successfully, you've verified:

- ✅ User management (GET /users)
- ✅ Scholarship CRUD operations (Create, Read, Update)
- ✅ Scholarship lifecycle (Draft → Published → Closed)
- ✅ Scholarship search
- ✅ Application submission
- ✅ Application listing and filtering
- ✅ Application approval/rejection workflow
- ✅ Application withdrawal

---

## 🐛 Common Issues

### Issue 1: "Foreign key constraint violated on scholarships_createdBy_fkey"

**Solution**: Make sure to:

1. Run `npx prisma db seed` first
2. Get actual admin UUID from GET /users
3. Use that UUID in `createdBy` field

### Issue 2: "Deadline must be in the future"

**Solution**: Use dates in 2025 (after Oct 29, 2025):

- ✅ `"2025-12-31T23:59:59Z"`
- ❌ `"2024-12-31T23:59:59Z"`

### Issue 3: "Must be a valid UUID"

**Solution**: Use proper UUID v4 format:

- ✅ `"550e8400-e29b-41d4-a716-446655440000"`
- ❌ `"00000000-0000-0000-0000-000000000001"` (invalid version byte)
- ❌ `"user-id"` (not a UUID)

---

## 📝 Seeded Data

After running `npx prisma db seed`, you have:

**Users (6 total):**

- 1 Admin: `admin@scholarship.com` / `Password123!`
- 2 Sponsors: `vingroup@sponsor.com`, etc.
- 3 Students: `student1@gmail.com`, `student2@gmail.com`, `student3@gmail.com`

**Scholarships (3):**

- Pre-created scholarships (check with GET /scholarships)

**Applications (3):**

- Pre-created applications (check with GET /applications)

---

## 🚀 Next Phase

After testing completes successfully:

- [ ] Phase 8: Authentication & Authorization (JWT, Guards, @CurrentUser decorator)
- [ ] Phase 9: Error Handling & Validation Pipes
- [ ] Phase 10: Unit & E2E Tests
