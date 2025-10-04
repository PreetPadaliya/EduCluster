/*
  Warnings:

  - You are about to drop the column `employeeId` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `isRecurring` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dayOfWeek` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('REGULAR_CLASS', 'EXAM', 'LAB', 'SEMINAR', 'MEETING', 'SPECIAL_EVENT', 'ASSIGNMENT_DUE', 'HOLIDAY');

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_facultyId_fkey";

-- DropIndex
DROP INDEX "faculty_employeeId_key";

-- AlterTable
ALTER TABLE "faculty" DROP COLUMN "employeeId",
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "qualification" TEXT,
ADD COLUMN     "specialization" TEXT;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "date",
DROP COLUMN "isActive",
DROP COLUMN "isRecurring",
DROP COLUMN "roomNumber",
DROP COLUMN "subject",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "ScheduleType" NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "facultyId" DROP NOT NULL,
DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
