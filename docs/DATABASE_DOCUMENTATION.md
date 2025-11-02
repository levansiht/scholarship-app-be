# 🗄️ Database Documentation

## Overview

This document describes the PostgreSQL database schema for the Scholarship Management System. The database is managed using **Prisma ORM** with TypeScript.

**Database:** PostgreSQL 15+  
**ORM:** Prisma v5+  
**Migrations:** Located in `prisma/migrations/`

---

## 📊 Database Schema

### Tables

1. **User** - System users (students, sponsors, admins)
2. **Scholarship** - Scholarship programs
3. **Application** - Student applications to scholarships

---

## 👤 User Table

Stores all system users with role-based access control.

| Column      | Type         | Constraints                             | Description                |
| ----------- | ------------ | --------------------------------------- | -------------------------- |
| `id`        | UUID         | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique user identifier     |
| `email`     | VARCHAR(255) | UNIQUE, NOT NULL                        | User's email (login)       |
| `password`  | VARCHAR(255) | NOT NULL                                | Bcrypt hashed password     |
| `role`      | ENUM         | NOT NULL, DEFAULT 'STUDENT'             | STUDENT, SPONSOR, or ADMIN |
| `status`    | ENUM         | NOT NULL, DEFAULT 'ACTIVE'              | ACTIVE or SUSPENDED        |
| `createdAt` | TIMESTAMP    | NOT NULL, DEFAULT now()                 | Account creation time      |
| `updatedAt` | TIMESTAMP    | NOT NULL                                | Last update time           |

### Indexes

- `idx_user_email` on `email` (unique constraint index)
- `idx_user_role` on `role` (for role filtering)

### Relationships

- `User.scholarships` → One-to-Many → `Scholarship.createdBy`
- `User.applications` → One-to-Many → `Application.applicantId`

### Enum: UserRole

```sql
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'SPONSOR', 'ADMIN');
```

### Enum: UserStatus

```sql
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
```

### Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- Email is case-insensitive (enforced at application level)
- Default role is STUDENT for new registrations
- SUSPENDED users cannot log in

---

## 🎓 Scholarship Table

Stores scholarship programs created by sponsors or admins.

| Column           | Type          | Constraints                             | Description                      |
| ---------------- | ------------- | --------------------------------------- | -------------------------------- |
| `id`             | UUID          | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique scholarship identifier    |
| `createdBy`      | UUID          | FOREIGN KEY → User(id), NOT NULL        | Creator's user ID                |
| `title`          | VARCHAR(255)  | NOT NULL                                | Scholarship title (10-200 chars) |
| `slug`           | VARCHAR(255)  | UNIQUE, NOT NULL                        | URL-friendly identifier          |
| `description`    | TEXT          | NOT NULL                                | Full description (50-5000 chars) |
| `amount`         | DECIMAL(15,2) | NOT NULL, CHECK > 0                     | Scholarship amount               |
| `currency`       | VARCHAR(10)   | NOT NULL, DEFAULT 'VND'                 | Currency code                    |
| `numberOfSlots`  | INTEGER       | NOT NULL, DEFAULT 1, CHECK >= 1         | Total slots available            |
| `availableSlots` | INTEGER       | NOT NULL                                | Remaining slots                  |
| `deadline`       | TIMESTAMP     | NULL                                    | Application deadline             |
| `startDate`      | TIMESTAMP     | NULL                                    | Scholarship start date           |
| `endDate`        | TIMESTAMP     | NULL                                    | Scholarship end date             |
| `status`         | ENUM          | NOT NULL, DEFAULT 'DRAFT'               | DRAFT, OPEN, or CLOSED           |
| `tags`           | TEXT[]        | NULL                                    | Search tags (max 10)             |
| `thumbnailUrl`   | VARCHAR(500)  | NULL                                    | Image URL                        |
| `publishedAt`    | TIMESTAMP     | NULL                                    | Publication timestamp            |
| `createdAt`      | TIMESTAMP     | NOT NULL, DEFAULT now()                 | Creation timestamp               |
| `updatedAt`      | TIMESTAMP     | NOT NULL                                | Last update timestamp            |

### Indexes

- `idx_scholarship_createdBy` on `createdBy` (foreign key)
- `idx_scholarship_slug` on `slug` (unique constraint index)
- `idx_scholarship_status` on `status` (for filtering)
- `idx_scholarship_deadline` on `deadline` (for sorting/filtering)

### Relationships

- `Scholarship.createdBy` → Many-to-One → `User.id`
- `Scholarship.applications` → One-to-Many → `Application.scholarshipId`

### Enum: ScholarshipStatus

```sql
CREATE TYPE "ScholarshipStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');
```

### Business Rules

1. **Slug Generation**: Auto-generated from title (lowercase, hyphenated)
2. **Slots Management**:
   - `availableSlots` starts equal to `numberOfSlots`
   - Decreases by 1 when application is APPROVED
   - Cannot reduce `numberOfSlots` below current application count
3. **Status Flow**: DRAFT → OPEN (via publish) → CLOSED (manually or when availableSlots = 0)
4. **Date Validation**:
   - `deadline` must be before `startDate`
   - `endDate` must be after `startDate` (if provided)
5. **Ownership**: SPONSOR can only modify scholarships they created

### Notes

- `publishedAt` is set when status changes from DRAFT to OPEN
- `tags` stored as PostgreSQL TEXT array
- `currency` defaults to 'VND' (Vietnamese Dong)
- Amount stored with 2 decimal precision

---

## 📝 Application Table

Stores student applications to scholarships.

| Column           | Type      | Constraints                             | Description                            |
| ---------------- | --------- | --------------------------------------- | -------------------------------------- |
| `id`             | UUID      | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique application identifier          |
| `scholarshipId`  | UUID      | FOREIGN KEY → Scholarship(id), NOT NULL | Target scholarship                     |
| `applicantId`    | UUID      | FOREIGN KEY → User(id), NOT NULL        | Applicant's user ID                    |
| `status`         | ENUM      | NOT NULL, DEFAULT 'DRAFT'               | Application status                     |
| `coverLetter`    | TEXT      | NULL                                    | Applicant's cover letter               |
| `documents`      | TEXT[]    | NULL                                    | Array of document URLs                 |
| `additionalInfo` | JSONB     | NULL                                    | Flexible additional data               |
| `submittedAt`    | TIMESTAMP | NULL                                    | Submission timestamp                   |
| `decidedAt`      | TIMESTAMP | NULL                                    | Decision timestamp (approved/rejected) |
| `createdAt`      | TIMESTAMP | NOT NULL, DEFAULT now()                 | Creation timestamp                     |
| `updatedAt`      | TIMESTAMP | NOT NULL                                | Last update timestamp                  |

### Indexes

- `idx_application_scholarshipId` on `scholarshipId` (foreign key)
- `idx_application_applicantId` on `applicantId` (foreign key)
- `idx_application_status` on `status` (for filtering)
- `idx_application_composite` on `(scholarshipId, applicantId)` (unique constraint)

### Relationships

- `Application.scholarshipId` → Many-to-One → `Scholarship.id`
- `Application.applicantId` → Many-to-One → `User.id`

### Enum: ApplicationStatus

```sql
CREATE TYPE "ApplicationStatus" AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN'
);
```

### Unique Constraint

```sql
UNIQUE (scholarshipId, applicantId)
```

One student can only apply once to each scholarship.

### Business Rules

1. **Duplicate Prevention**: Composite unique index on `(scholarshipId, applicantId)`
2. **Deadline Check**: Cannot submit after scholarship deadline
3. **Status Flow**:
   - DRAFT → SUBMITTED (student submits)
   - SUBMITTED → UNDER_REVIEW (sponsor reviews)
   - UNDER_REVIEW → APPROVED/REJECTED (sponsor decides)
   - SUBMITTED/UNDER_REVIEW → WITHDRAWN (student withdraws)
4. **Approval Effect**: When APPROVED, scholarship's `availableSlots` decreases by 1
5. **Auto-Close**: Scholarship auto-closes when `availableSlots` reaches 0
6. **Authorization**: SPONSOR can only approve/reject applications for their scholarships

### Notes

- `documents` stores array of URLs (Google Drive, etc.)
- `additionalInfo` uses JSONB for flexible schema
- `submittedAt` set when status changes to SUBMITTED
- `decidedAt` set when status changes to APPROVED or REJECTED

---

## 🔗 Entity Relationships

```
User (1) ──────┐
               │
               │ createdBy
               │
               ├──> Scholarship (N)
               │         │
               │         │ scholarshipId
               │         │
               │         └──> Application (N)
               │                    │
               │                    │ applicantId
               │                    │
               └────────────────────┘
```

### Relationship Details

**User → Scholarship (One-to-Many)**

- A user (SPONSOR/ADMIN) can create multiple scholarships
- Foreign Key: `Scholarship.createdBy → User.id`
- On Delete: No action (preserve scholarship history)

**User → Application (One-to-Many)**

- A user (STUDENT) can create multiple applications
- Foreign Key: `Application.applicantId → User.id`
- On Delete: No action (preserve application history)

**Scholarship → Application (One-to-Many)**

- A scholarship can have multiple applications
- Foreign Key: `Application.scholarshipId → Scholarship.id`
- On Delete: No action (preserve application history)

---

## 🔐 Database Security

### Row-Level Security (Application Level)

- **User Isolation**: Students can only see their own applications
- **Scholarship Ownership**: Sponsors can only modify their own scholarships
- **Application Ownership**: Sponsors can only approve applications for their scholarships

### Password Security

- Passwords hashed using bcrypt with 10 salt rounds
- Never stored in plain text
- Cannot be retrieved, only reset

### Indexes for Performance

- All foreign keys have indexes
- Unique constraints on email, slug
- Composite index on (scholarshipId, applicantId) for duplicate prevention

---

## 📦 Seed Data

Located in `prisma/seed.ts`, includes:

### Users (6 total)

| Email                 | Password     | Role    | Status |
| --------------------- | ------------ | ------- | ------ |
| admin@scholarship.com | Password123! | ADMIN   | ACTIVE |
| vingroup@sponsor.com  | Password123! | SPONSOR | ACTIVE |
| viettel@sponsor.com   | Password123! | SPONSOR | ACTIVE |
| student1@gmail.com    | Password123! | STUDENT | ACTIVE |
| student2@gmail.com    | Password123! | STUDENT | ACTIVE |
| student3@gmail.com    | Password123! | STUDENT | ACTIVE |

### Scholarships (3 total)

1. **Vingroup Innovation Scholarship** - 50M VND, 10 slots (8 available), OPEN
2. **Viettel Technology Scholarship** - 30M VND, 15 slots (14 available), OPEN
3. **Women in Tech Scholarship** - 40M VND, 20 slots (20 available), DRAFT

### Applications (3 total)

- Student 1 → Vingroup (SUBMITTED)
- Student 2 → Vingroup (UNDER_REVIEW)
- Student 3 → Viettel (DRAFT)

**Run seed:**

```bash
npm run seed
# or
npx prisma db seed
```

---

## 🛠️ Database Commands

### Development

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (drops all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Run seed
npm run seed
```

### Production

```bash
# Apply migrations (no prompt)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

## 🔄 Migration History

### 20251022080239_init_schema

- Initial schema creation
- Created User, Scholarship, Application tables
- Added all enums (UserRole, UserStatus, ScholarshipStatus, ApplicationStatus)
- Added indexes and constraints

### 20251028085316_simplify_schema_remove_notifications_audit_tokens

- Removed Notification table
- Removed AuditLog table
- Removed RefreshToken table
- Simplified to 3 core tables only

---

## 📊 Database Statistics

**Storage Requirements (estimated):**

- User: ~500 bytes per row
- Scholarship: ~2 KB per row (with description)
- Application: ~1 KB per row

**Expected Volumes:**

- Users: 1,000 - 10,000
- Scholarships: 100 - 1,000
- Applications: 10,000 - 100,000

**Query Performance:**

- All foreign keys indexed
- Email/slug lookups: O(log n) via B-tree
- Role-based filtering: O(log n) via index
- Composite unique check: O(log n) via index

---

## 🧪 Testing Database

**Connection String (dev):**

```
postgresql://postgres:postgres@localhost:5432/scholarship_db
```

**Docker Compose:**

```bash
docker-compose up -d
```

**Check Connection:**

```bash
npm run test:db
# or
ts-node test-db-connection.ts
```

---

## 📝 Schema Visualization (Prisma Format)

```prisma
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  password     String
  role         UserRole      @default(STUDENT)
  status       UserStatus    @default(ACTIVE)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  scholarships Scholarship[]
  applications Application[]

  @@index([email])
  @@index([role])
}

model Scholarship {
  id              String             @id @default(uuid())
  createdBy       String
  creator         User               @relation(fields: [createdBy], references: [id])
  title           String
  slug            String             @unique
  description     String
  amount          Decimal
  currency        String             @default("VND")
  numberOfSlots   Int                @default(1)
  availableSlots  Int
  deadline        DateTime?
  startDate       DateTime?
  endDate         DateTime?
  status          ScholarshipStatus  @default(DRAFT)
  tags            String[]
  thumbnailUrl    String?
  publishedAt     DateTime?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  applications    Application[]

  @@index([createdBy])
  @@index([slug])
  @@index([status])
  @@index([deadline])
}

model Application {
  id             String            @id @default(uuid())
  scholarshipId  String
  scholarship    Scholarship       @relation(fields: [scholarshipId], references: [id])
  applicantId    String
  applicant      User              @relation(fields: [applicantId], references: [id])
  status         ApplicationStatus @default(DRAFT)
  coverLetter    String?
  documents      String[]
  additionalInfo Json?
  submittedAt    DateTime?
  decidedAt      DateTime?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@unique([scholarshipId, applicantId])
  @@index([scholarshipId])
  @@index([applicantId])
  @@index([status])
}
```

---

## 🔍 Common Queries

### Find scholarships with available slots

```sql
SELECT * FROM "Scholarship"
WHERE "status" = 'OPEN'
  AND "availableSlots" > 0
  AND "deadline" > NOW()
ORDER BY "deadline" ASC;
```

### Find user's applications

```sql
SELECT a.*, s."title", s."amount"
FROM "Application" a
JOIN "Scholarship" s ON a."scholarshipId" = s."id"
WHERE a."applicantId" = $1
ORDER BY a."createdAt" DESC;
```

### Count applications by status

```sql
SELECT "status", COUNT(*) as count
FROM "Application"
WHERE "scholarshipId" = $1
GROUP BY "status";
```

---

## 📞 Support

- Prisma Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- API Documentation: `API_DOCUMENTATION.md`

---

**Last Updated:** November 2, 2025
