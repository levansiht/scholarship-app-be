# 📊 Database Schema Documentation

## Overview

This database schema is designed following **SOLID principles** and **Clean Architecture** patterns for a Scholarship Management System.

## 🏗️ Architecture Principles

### 1. **Single Responsibility Principle (SRP)**

- Each table has a single, well-defined purpose
- Separation of concerns: User authentication vs User profile vs Student/Sponsor specific data

### 2. **Open/Closed Principle (OCP)**

- Extensible through JSON fields (`additionalInfo`, `otherCriteria`, `achievements`)
- New user roles can be added without modifying existing structure
- Polymorphic relationships through user roles

### 3. **Liskov Substitution Principle (LSP)**

- Base `User` model can be extended with role-specific profiles
- All users share common authentication regardless of role

### 4. **Interface Segregation Principle (ISP)**

- Separate tables for different concerns (Profile, StudentProfile, SponsorProfile)
- Clients only depend on what they need

### 5. **Dependency Inversion Principle (DIP)**

- Repository pattern implementation ready
- Domain entities independent of database implementation

---

## 📋 Entity Relationship Diagram

```
┌─────────────┐
│    User     │ (Core Entity)
└──────┬──────┘
       │
       ├──── Profile (1:1)
       ├──── StudentProfile (1:1, optional)
       ├──── SponsorProfile (1:1, optional)
       ├──── RefreshToken (1:N)
       ├──── EmailVerification (1:N)
       ├──── PasswordReset (1:N)
       ├──── Scholarship (1:N, as creator)
       ├──── Application (1:N)
       ├──── ApplicationReview (1:N)
       ├──── Notification (1:N)
       ├──── Message (1:N, sent & received)
       ├──── SavedScholarship (1:N)
       └──── AuditLog (1:N)

┌──────────────────┐
│   Scholarship    │ (Core Entity)
└────────┬─────────┘
         │
         ├──── ScholarshipCategory (1:N)
         ├──── ScholarshipRequirement (1:N)
         ├──── EligibilityCriteria (1:1)
         ├──── ScholarshipDocument (1:N)
         ├──── Application (1:N)
         └──── SavedScholarship (1:N)

┌──────────────────┐
│   Application    │ (Core Entity)
└────────┬─────────┘
         │
         ├──── ApplicationDocument (1:N)
         ├──── ApplicationReview (1:N)
         └──── ApplicationTimeline (1:N)
```

---

## 📑 Core Entities

### 1. User Management

#### `User` (users)

**Purpose:** Central authentication and user identity

| Field    | Type   | Description                                       |
| -------- | ------ | ------------------------------------------------- |
| id       | UUID   | Primary key                                       |
| email    | String | Unique email (login)                              |
| password | String | Hashed password                                   |
| role     | Enum   | STUDENT, SPONSOR, ADMIN, ADVISOR                  |
| status   | Enum   | ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION |

**Indexes:**

- `email` (unique, for login)
- `role` (for role-based queries)
- `status` (for filtering active users)

**Relations:**

- 1:1 with Profile (required)
- 1:1 with StudentProfile/SponsorProfile (role-specific, optional)

---

#### `Profile` (profiles)

**Purpose:** Common user information

| Field       | Type      | Description                            |
| ----------- | --------- | -------------------------------------- |
| firstName   | String    | First name                             |
| lastName    | String    | Last name                              |
| fullName    | String    | Computed full name (for search)        |
| phoneNumber | String?   | Contact number                         |
| avatar      | String?   | Avatar URL                             |
| dateOfBirth | DateTime? | Birth date                             |
| gender      | Enum      | MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY |
| address     | String?   | Address                                |
| city        | String?   | City                                   |
| country     | String    | Country (default: Vietnam)             |
| bio         | Text?     | User biography                         |

**Design Decision:**

- Separated from User for SRP
- Common fields for all user types
- Full-text search ready with `fullName`

---

#### `StudentProfile` (student_profiles)

**Purpose:** Student-specific academic information

| Field            | Type         | Description               |
| ---------------- | ------------ | ------------------------- |
| studentId        | String?      | University student ID     |
| university       | String       | University name           |
| major            | String       | Field of study            |
| yearOfStudy      | Int          | Current year (1-4)        |
| expectedGradYear | Int          | Expected graduation year  |
| gpa              | Decimal(3,2) | GPA (0.00-4.00)           |
| skills           | String[]     | List of skills            |
| interests        | String[]     | Areas of interest         |
| achievements     | JSON         | Flexible achievement data |

**Indexes:**

- `university` (for filtering)
- `major` (for matching scholarships)

**Design Decision:**

- Separate table following ISP
- Only students have this profile
- Flexible `achievements` field for extensibility

---

#### `SponsorProfile` (sponsor_profiles)

**Purpose:** Organization/sponsor information

| Field            | Type      | Description                          |
| ---------------- | --------- | ------------------------------------ |
| organizationName | String    | Organization name                    |
| organizationType | String    | Company, NGO, Government, Individual |
| website          | String?   | Organization website                 |
| description      | Text      | Organization description             |
| logo             | String?   | Logo URL                             |
| taxId            | String?   | Tax ID / Business number             |
| verified         | Boolean   | Verification status                  |
| verifiedAt       | DateTime? | Verification timestamp               |

**Design Decision:**

- Trust mechanism through `verified` flag
- Admin can verify legitimate sponsors

---

### 2. Authentication & Security

#### `RefreshToken` (refresh_tokens)

**Purpose:** JWT refresh token management

| Field     | Type      | Description            |
| --------- | --------- | ---------------------- |
| token     | String    | Refresh token (unique) |
| expiresAt | DateTime  | Expiration time        |
| isRevoked | Boolean   | Revocation flag        |
| revokedAt | DateTime? | Revocation timestamp   |

**Security Features:**

- Token revocation support
- Automatic cleanup of expired tokens (via cron)

---

#### `EmailVerification` (email_verifications)

**Purpose:** Email verification workflow

| Field      | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| token      | String    | Verification token (unique) |
| expiresAt  | DateTime  | Token expiration            |
| verified   | Boolean   | Verification status         |
| verifiedAt | DateTime? | Verification timestamp      |

---

#### `PasswordReset` (password_resets)

**Purpose:** Password reset workflow

| Field     | Type      | Description               |
| --------- | --------- | ------------------------- |
| token     | String    | Reset token (unique)      |
| expiresAt | DateTime  | Token expiration          |
| used      | Boolean   | Usage flag (one-time use) |
| usedAt    | DateTime? | Usage timestamp           |

**Security:**

- One-time use tokens
- Expiration enforcement

---

### 3. Scholarship Management

#### `Scholarship` (scholarships)

**Purpose:** Scholarship opportunities

| Field          | Type          | Description                             |
| -------------- | ------------- | --------------------------------------- |
| createdBy      | UUID          | Creator user ID                         |
| title          | String        | Scholarship title                       |
| slug           | String        | URL-friendly slug (unique)              |
| description    | Text          | Full description                        |
| amount         | Decimal(12,2) | Scholarship amount                      |
| currency       | String        | Currency code (default: VND)            |
| numberOfSlots  | Int           | Total available slots                   |
| availableSlots | Int           | Remaining slots                         |
| deadline       | DateTime      | Application deadline                    |
| status         | Enum          | DRAFT, OPEN, CLOSED, SUSPENDED, EXPIRED |
| featured       | Boolean       | Featured flag                           |
| views          | Int           | View counter                            |
| tags           | String[]      | Categorization tags                     |
| publishedAt    | DateTime?     | Publication timestamp                   |

**Indexes:**

- `slug` (unique, for URLs)
- `status` (for filtering)
- `deadline` (for sorting)
- `featured` (for homepage)
- Full-text index on `title` and `description`

**Design Decision:**

- `slug` for SEO-friendly URLs
- `availableSlots` computed field (managed by application logic)
- Flexible tagging system

---

#### `ScholarshipCategory` (scholarship_categories)

**Purpose:** Multi-category support

| Field         | Type   | Description   |
| ------------- | ------ | ------------- |
| scholarshipId | UUID   | Foreign key   |
| name          | String | Category name |

**Design Decision:**

- M:N relationship (scholarship can have multiple categories)
- Normalized for efficient queries

---

#### `ScholarshipRequirement` (scholarship_requirements)

**Purpose:** Document/requirement specifications

| Field        | Type    | Description          |
| ------------ | ------- | -------------------- |
| title        | String  | Requirement title    |
| description  | Text    | Detailed description |
| isRequired   | Boolean | Mandatory flag       |
| displayOrder | Int     | Ordering for UI      |

**Design Decision:**

- Flexible requirements per scholarship
- Display order for consistent UI

---

#### `EligibilityCriteria` (eligibility_criteria)

**Purpose:** Automatic matching and filtering

| Field         | Type     | Description                   |
| ------------- | -------- | ----------------------------- |
| minGPA        | Decimal? | Minimum GPA                   |
| maxGPA        | Decimal? | Maximum GPA                   |
| allowedMajors | String[] | Eligible majors (empty = all) |
| allowedYears  | Int[]    | Eligible years (empty = all)  |
| minAge        | Int?     | Minimum age                   |
| maxAge        | Int?     | Maximum age                   |
| nationality   | String[] | Eligible nationalities        |
| gender        | Enum?    | Gender requirement            |
| otherCriteria | JSON     | Flexible criteria             |

**Design Decision:**

- 1:1 relationship with Scholarship
- Supports automatic recommendation engine
- Empty arrays = no restriction
- `otherCriteria` for extensibility (OCP)

---

### 4. Application System

#### `Application` (applications)

**Purpose:** Student scholarship applications

| Field          | Type      | Description                                          |
| -------------- | --------- | ---------------------------------------------------- |
| scholarshipId  | UUID      | Foreign key                                          |
| applicantId    | UUID      | Student user ID                                      |
| status         | Enum      | DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED |
| coverLetter    | Text?     | Cover letter                                         |
| additionalInfo | JSON      | Custom form data                                     |
| submittedAt    | DateTime? | Submission timestamp                                 |
| reviewedAt     | DateTime? | Review timestamp                                     |
| decidedAt      | DateTime? | Decision timestamp                                   |

**Unique Constraint:**

- `(scholarshipId, applicantId)` - One application per scholarship per student

**Indexes:**

- `scholarshipId` (for sponsor queries)
- `applicantId` (for student queries)
- `status` (for filtering)

**Design Decision:**

- Status workflow enforced at application level
- Timeline tracking through separate table
- Flexible `additionalInfo` for custom questions

---

#### `ApplicationDocument` (application_documents)

**Purpose:** Document attachments

| Field         | Type    | Description                   |
| ------------- | ------- | ----------------------------- |
| applicationId | UUID    | Foreign key                   |
| uploadedBy    | UUID    | Uploader user ID              |
| documentType  | Enum    | TRANSCRIPT, CERTIFICATE, etc. |
| title         | String  | Document title                |
| fileUrl       | String  | S3 URL                        |
| fileName      | String  | Original filename             |
| fileSize      | Int     | Size in bytes                 |
| mimeType      | String  | File MIME type                |
| isVerified    | Boolean | Verification flag             |

**Design Decision:**

- Supports multiple documents per application
- Verification workflow for admin
- Metadata for file management

---

#### `ApplicationReview` (application_reviews)

**Purpose:** Review and feedback

| Field         | Type    | Description                        |
| ------------- | ------- | ---------------------------------- |
| applicationId | UUID    | Foreign key                        |
| reviewerId    | UUID    | Reviewer user ID                   |
| rating        | Int?    | 1-5 stars                          |
| comments      | Text    | Review comments                    |
| decision      | String? | APPROVED, REJECTED, NEED_MORE_INFO |

**Design Decision:**

- Multiple reviewers per application
- Supports collaborative review

---

#### `ApplicationTimeline` (application_timeline)

**Purpose:** Audit trail of status changes

| Field         | Type    | Description          |
| ------------- | ------- | -------------------- |
| applicationId | UUID    | Foreign key          |
| status        | String  | New status           |
| description   | String? | Change description   |
| createdBy     | UUID?   | User who made change |

**Design Decision:**

- Immutable audit log
- Transparency for applicants

---

### 5. Communication

#### `Notification` (notifications)

**Purpose:** In-app notifications

| Field   | Type      | Description          |
| ------- | --------- | -------------------- |
| userId  | UUID      | Recipient user ID    |
| type    | Enum      | Notification type    |
| title   | String    | Notification title   |
| message | Text      | Notification message |
| data    | JSON      | Additional data      |
| isRead  | Boolean   | Read status          |
| readAt  | DateTime? | Read timestamp       |

**Indexes:**

- `userId` + `isRead` (for unread count)
- `createdAt` (for sorting)

**Design Decision:**

- Type-based notifications for filtering
- Extensible data field

---

#### `Message` (messages)

**Purpose:** Direct messaging between users

| Field      | Type    | Description       |
| ---------- | ------- | ----------------- |
| senderId   | UUID    | Sender user ID    |
| receiverId | UUID    | Recipient user ID |
| subject    | String? | Message subject   |
| content    | Text    | Message content   |
| isRead     | Boolean | Read status       |

**Design Decision:**

- Simple 1:1 messaging
- Can be extended to conversation threads

---

### 6. Features

#### `SavedScholarship` (saved_scholarships)

**Purpose:** Bookmarking scholarships

| Field         | Type    | Description    |
| ------------- | ------- | -------------- |
| userId        | UUID    | User ID        |
| scholarshipId | UUID    | Scholarship ID |
| note          | String? | Personal note  |

**Unique Constraint:**

- `(userId, scholarshipId)` - One bookmark per scholarship per user

---

#### `AuditLog` (audit_logs)

**Purpose:** System audit trail

| Field     | Type    | Description                   |
| --------- | ------- | ----------------------------- |
| userId    | UUID?   | Actor user ID                 |
| action    | String  | CREATE, UPDATE, DELETE, LOGIN |
| entity    | String  | Entity type                   |
| entityId  | UUID?   | Entity ID                     |
| changes   | JSON    | Change details                |
| ipAddress | String? | IP address                    |
| userAgent | String? | Browser info                  |

**Indexes:**

- `userId` (for user activity)
- `action` (for filtering)
- `entity` (for entity-specific logs)
- `createdAt` (for time-based queries)

**Design Decision:**

- Comprehensive audit trail
- Security and compliance ready
- Flexible changes field

---

## 🔄 Common Patterns

### Timestamps

All tables have:

- `createdAt` - Auto-set on creation
- `updatedAt` - Auto-updated on modification

### Soft Delete

Not implemented by default, but can be added:

```prisma
deletedAt DateTime?
```

### UUID Primary Keys

- Better for distributed systems
- No sequential ID leaks
- Postgres UUID support

---

## 🚀 Migration Strategy

### Initial Migration

```bash
# Generate Prisma Client
npm run prisma:generate

# Create initial migration
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### Adding New Fields (OCP)

```bash
# Add field to schema.prisma
# Create migration
npx prisma migrate dev --name add_new_field
```

---

## 🔍 Indexing Strategy

### Performance Indexes

1. **Foreign Keys** - Auto-indexed by Prisma
2. **Unique Constraints** - Email, slug, tokens
3. **Query Filters** - Status, role, dates
4. **Full-Text Search** - Title, description
5. **Composite Indexes** - For common query patterns

### Example Queries Optimized

```sql
-- Find open scholarships with deadline
WHERE status = 'OPEN' AND deadline > NOW()
-- Indexed: status, deadline

-- Find student applications
WHERE applicantId = 'uuid' AND status IN (...)
-- Indexed: applicantId, status

-- Search scholarships
WHERE title ILIKE '%tech%' OR description ILIKE '%tech%'
-- Full-text indexed: title, description
```

---

## 🔒 Security Considerations

1. **Password Storage**
   - Bcrypt hashing (10 rounds)
   - Never store plain text

2. **Token Management**
   - Unique tokens
   - Expiration enforcement
   - Revocation support

3. **Data Privacy**
   - Sensitive fields (SSN, etc.) can be encrypted
   - GDPR compliance ready

4. **Audit Trail**
   - All critical actions logged
   - IP and user agent tracking

---

## 📈 Scalability

### Future Enhancements

1. **Partitioning**
   - Partition `audit_logs` by date
   - Partition `notifications` by userId

2. **Caching**
   - Redis for frequently accessed data
   - Scholarship listings
   - User sessions

3. **Read Replicas**
   - Separate read/write databases
   - Load distribution

4. **Full-Text Search**
   - Elasticsearch integration
   - Advanced search capabilities

---

## 🧪 Data Integrity

### Constraints

1. **Unique Constraints**
   - Email (users)
   - Slug (scholarships)
   - (scholarshipId, applicantId) (applications)

2. **Foreign Key Constraints**
   - Cascade deletes where appropriate
   - Set null for audit logs

3. **Check Constraints**
   - GPA range (0-4)
   - Rating range (1-5)
   - Positive amounts

---

## 📚 Best Practices

1. **Always use transactions** for multi-table operations
2. **Validate data** at application layer (DTOs)
3. **Use repository pattern** for database access
4. **Implement soft deletes** for critical data
5. **Regular backups** automated
6. **Monitor query performance** with pgBadger
7. **Use prepared statements** (Prisma does this automatically)

---

## 🎯 Next Steps

1. ✅ Schema design complete
2. ⏳ Generate Prisma Client
3. ⏳ Run migrations
4. ⏳ Seed demo data
5. ⏳ Implement Repository layer
6. ⏳ Create DTOs and Validators
7. ⏳ Implement Use Cases

---

**Schema Version:** 1.0.0  
**Last Updated:** October 22, 2024  
**Database:** PostgreSQL 16  
**ORM:** Prisma 6.17.1
