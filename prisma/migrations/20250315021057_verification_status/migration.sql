/*
  Warnings:

  - You are about to drop the column `verification` on the `Report` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "verification",
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- DropEnum
DROP TYPE "ReportVerification";
