/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_verifierId_fkey";

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profilePic" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EMERGENCY_RESPONDER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_phone_key" ON "Staff"("phone");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
