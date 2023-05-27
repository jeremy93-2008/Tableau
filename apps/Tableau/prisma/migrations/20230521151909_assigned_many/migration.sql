/*
  Warnings:

  - You are about to drop the column `assignedUserId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedUserId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignedUserId";

-- CreateTable
CREATE TABLE "TaskAssignedUser" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isHolder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaskAssignedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignedUser_taskId_userId_key" ON "TaskAssignedUser"("taskId", "userId");

-- AddForeignKey
ALTER TABLE "TaskAssignedUser" ADD CONSTRAINT "TaskAssignedUser_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignedUser" ADD CONSTRAINT "TaskAssignedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
