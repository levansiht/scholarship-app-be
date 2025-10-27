-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'SPONSOR', 'ADMIN', 'ADVISOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "ScholarshipStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'SUSPENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'AWARDED', 'WITHDRAWN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('TRANSCRIPT', 'CERTIFICATE', 'RECOMMENDATION_LETTER', 'ESSAY', 'ID_CARD', 'PASSPORT', 'CV', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPLICATION_STATUS_CHANGE', 'NEW_SCHOLARSHIP', 'DEADLINE_REMINDER', 'MESSAGE_RECEIVED', 'DOCUMENT_REQUEST', 'SYSTEM_ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "avatar" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "address" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Vietnam',
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentId" TEXT,
    "university" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "yearOfStudy" INTEGER NOT NULL,
    "expectedGradYear" INTEGER NOT NULL,
    "gpa" DECIMAL(3,2) NOT NULL,
    "skills" TEXT[],
    "interests" TEXT[],
    "achievements" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "taxId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarships" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "numberOfSlots" INTEGER NOT NULL DEFAULT 1,
    "availableSlots" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" "ScholarshipStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "searchVector" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_categories" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scholarship_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_requirements" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarship_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eligibility_criteria" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "minGPA" DECIMAL(3,2),
    "maxGPA" DECIMAL(3,2),
    "allowedMajors" TEXT[],
    "allowedYears" INTEGER[],
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "nationality" TEXT[],
    "gender" "Gender",
    "otherCriteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eligibility_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_documents" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scholarship_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "coverLetter" TEXT,
    "additionalInfo" JSONB,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_reviews" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER,
    "comments" TEXT NOT NULL,
    "decision" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_timeline" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_scholarships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE INDEX "student_profiles_userId_idx" ON "student_profiles"("userId");

-- CreateIndex
CREATE INDEX "student_profiles_university_idx" ON "student_profiles"("university");

-- CreateIndex
CREATE INDEX "student_profiles_major_idx" ON "student_profiles"("major");

-- CreateIndex
CREATE UNIQUE INDEX "sponsor_profiles_userId_key" ON "sponsor_profiles"("userId");

-- CreateIndex
CREATE INDEX "sponsor_profiles_userId_idx" ON "sponsor_profiles"("userId");

-- CreateIndex
CREATE INDEX "sponsor_profiles_verified_idx" ON "sponsor_profiles"("verified");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_key" ON "email_verifications"("token");

-- CreateIndex
CREATE INDEX "email_verifications_userId_idx" ON "email_verifications"("userId");

-- CreateIndex
CREATE INDEX "email_verifications_token_idx" ON "email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_userId_idx" ON "password_resets"("userId");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE UNIQUE INDEX "scholarships_slug_key" ON "scholarships"("slug");

-- CreateIndex
CREATE INDEX "scholarships_createdBy_idx" ON "scholarships"("createdBy");

-- CreateIndex
CREATE INDEX "scholarships_status_idx" ON "scholarships"("status");

-- CreateIndex
CREATE INDEX "scholarships_deadline_idx" ON "scholarships"("deadline");

-- CreateIndex
CREATE INDEX "scholarships_slug_idx" ON "scholarships"("slug");

-- CreateIndex
CREATE INDEX "scholarships_featured_idx" ON "scholarships"("featured");

-- CreateIndex
CREATE INDEX "scholarship_categories_scholarshipId_idx" ON "scholarship_categories"("scholarshipId");

-- CreateIndex
CREATE INDEX "scholarship_categories_name_idx" ON "scholarship_categories"("name");

-- CreateIndex
CREATE INDEX "scholarship_requirements_scholarshipId_idx" ON "scholarship_requirements"("scholarshipId");

-- CreateIndex
CREATE UNIQUE INDEX "eligibility_criteria_scholarshipId_key" ON "eligibility_criteria"("scholarshipId");

-- CreateIndex
CREATE INDEX "eligibility_criteria_scholarshipId_idx" ON "eligibility_criteria"("scholarshipId");

-- CreateIndex
CREATE INDEX "scholarship_documents_scholarshipId_idx" ON "scholarship_documents"("scholarshipId");

-- CreateIndex
CREATE INDEX "applications_scholarshipId_idx" ON "applications"("scholarshipId");

-- CreateIndex
CREATE INDEX "applications_applicantId_idx" ON "applications"("applicantId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "applications_scholarshipId_applicantId_key" ON "applications"("scholarshipId", "applicantId");

-- CreateIndex
CREATE INDEX "application_documents_applicationId_idx" ON "application_documents"("applicationId");

-- CreateIndex
CREATE INDEX "application_documents_uploadedBy_idx" ON "application_documents"("uploadedBy");

-- CreateIndex
CREATE INDEX "application_documents_documentType_idx" ON "application_documents"("documentType");

-- CreateIndex
CREATE INDEX "application_reviews_applicationId_idx" ON "application_reviews"("applicationId");

-- CreateIndex
CREATE INDEX "application_reviews_reviewerId_idx" ON "application_reviews"("reviewerId");

-- CreateIndex
CREATE INDEX "application_timeline_applicationId_idx" ON "application_timeline"("applicationId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "messages_receiverId_idx" ON "messages"("receiverId");

-- CreateIndex
CREATE INDEX "messages_isRead_idx" ON "messages"("isRead");

-- CreateIndex
CREATE INDEX "saved_scholarships_userId_idx" ON "saved_scholarships"("userId");

-- CreateIndex
CREATE INDEX "saved_scholarships_scholarshipId_idx" ON "saved_scholarships"("scholarshipId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_scholarships_userId_scholarshipId_key" ON "saved_scholarships"("userId", "scholarshipId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_profiles" ADD CONSTRAINT "sponsor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarships" ADD CONSTRAINT "scholarships_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarship_categories" ADD CONSTRAINT "scholarship_categories_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarship_requirements" ADD CONSTRAINT "scholarship_requirements_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eligibility_criteria" ADD CONSTRAINT "eligibility_criteria_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarship_documents" ADD CONSTRAINT "scholarship_documents_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_reviews" ADD CONSTRAINT "application_reviews_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_reviews" ADD CONSTRAINT "application_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_timeline" ADD CONSTRAINT "application_timeline_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_scholarships" ADD CONSTRAINT "saved_scholarships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_scholarships" ADD CONSTRAINT "saved_scholarships_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "scholarships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
