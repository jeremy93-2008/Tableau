/*
  Warnings:

  - You are about to drop the column `message` on the `History` table. All the data in the column will be lost.
  - Added the required column `messageCode` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "message",
ADD COLUMN     "messageCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HistoryParam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "HistoryParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HistoryToHistoryParam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryToHistoryParam_AB_unique" ON "_HistoryToHistoryParam"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryToHistoryParam_B_index" ON "_HistoryToHistoryParam"("B");

-- AddForeignKey
ALTER TABLE "_HistoryToHistoryParam" ADD CONSTRAINT "_HistoryToHistoryParam_A_fkey" FOREIGN KEY ("A") REFERENCES "History"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryToHistoryParam" ADD CONSTRAINT "_HistoryToHistoryParam_B_fkey" FOREIGN KEY ("B") REFERENCES "HistoryParam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
