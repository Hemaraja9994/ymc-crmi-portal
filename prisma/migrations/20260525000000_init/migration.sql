-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('Casual', 'Medical', 'Emergency', 'Bereavement', 'Academic');

-- CreateEnum
CREATE TYPE "LeaveCategory" AS ENUM ('Retroactive', 'Advance');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LeaveSubmitted', 'LeaveDecisionChanged', 'PostingOverrideCreated');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('Sent', 'Skipped', 'Failed');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "slNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "batchYear" INTEGER NOT NULL DEFAULT 2021,
    "batchSlug" TEXT NOT NULL DEFAULT '2021-cbme',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "type" "LeaveType" NOT NULL,
    "category" "LeaveCategory" NOT NULL DEFAULT 'Advance',
    "from" DATE NOT NULL,
    "to" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'Pending',
    "doc" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "decidedBy" TEXT,
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostingOverride" (
    "id" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "weekIdx" INTEGER NOT NULL,
    "previousDeptCode" TEXT,
    "previousDeptName" TEXT,
    "newDeptCode" TEXT NOT NULL,
    "newDeptName" TEXT,
    "reason" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PostingOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actor" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyEmailLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "regNo" TEXT NOT NULL,
    "weekIdx" INTEGER NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'Sent',
    "messageId" TEXT,
    "error" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeeklyEmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_regNo_key" ON "Student"("regNo");

-- CreateIndex
CREATE UNIQUE INDEX "Student_campusId_key" ON "Student"("campusId");

-- CreateIndex
CREATE INDEX "Student_batchYear_idx" ON "Student"("batchYear");

-- CreateIndex
CREATE INDEX "Student_batchSlug_idx" ON "Student"("batchSlug");

-- CreateIndex
CREATE INDEX "LeaveRequest_regNo_idx" ON "LeaveRequest"("regNo");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");

-- CreateIndex
CREATE INDEX "LeaveRequest_from_to_idx" ON "LeaveRequest"("from", "to");

-- CreateIndex
CREATE INDEX "PostingOverride_regNo_weekIdx_idx" ON "PostingOverride"("regNo", "weekIdx");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "WeeklyEmailLog_weekIdx_idx" ON "WeeklyEmailLog"("weekIdx");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyEmailLog_regNo_weekIdx_key" ON "WeeklyEmailLog"("regNo", "weekIdx");

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyEmailLog" ADD CONSTRAINT "WeeklyEmailLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
