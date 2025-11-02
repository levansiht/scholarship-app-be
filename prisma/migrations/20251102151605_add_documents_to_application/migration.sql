/*
  Warnings:

  - You are about to drop the `application_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `application_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `application_timeline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."application_documents" DROP CONSTRAINT "application_documents_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_documents" DROP CONSTRAINT "application_documents_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_reviews" DROP CONSTRAINT "application_reviews_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_reviews" DROP CONSTRAINT "application_reviews_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_timeline" DROP CONSTRAINT "application_timeline_applicationId_fkey";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "documents" TEXT[];

-- DropTable
DROP TABLE "public"."application_documents";

-- DropTable
DROP TABLE "public"."application_reviews";

-- DropTable
DROP TABLE "public"."application_timeline";
