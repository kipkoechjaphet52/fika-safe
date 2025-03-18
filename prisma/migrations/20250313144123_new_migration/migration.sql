/*
  Warnings:

  - You are about to drop the column `status` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "status",
ALTER COLUMN "mediaUrl" DROP NOT NULL;

-- DropEnum
DROP TYPE "ReportStatus";
