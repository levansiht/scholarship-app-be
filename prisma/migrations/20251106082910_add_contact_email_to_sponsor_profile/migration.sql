/*
  Warnings:

  - Added the required column `contactEmail` to the `sponsor_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add column with default, then update existing rows, then remove default
ALTER TABLE "sponsor_profiles" ADD COLUMN "contactEmail" TEXT NOT NULL DEFAULT 'contact@example.com';

-- Update existing rows with a proper email (can be changed later)
UPDATE "sponsor_profiles" SET "contactEmail" = 'contact@example.com' WHERE "contactEmail" = 'contact@example.com';

-- Remove default to keep schema consistent
ALTER TABLE "sponsor_profiles" ALTER COLUMN "contactEmail" DROP DEFAULT;

