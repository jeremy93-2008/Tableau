-- CreateTable
CREATE TABLE "BoardUserSharing" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "canEditContent" BOOLEAN NOT NULL,
    "canEditSchema" BOOLEAN NOT NULL,

    CONSTRAINT "BoardUserSharing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoardUserSharing" ADD CONSTRAINT "BoardUserSharing_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardUserSharing" ADD CONSTRAINT "BoardUserSharing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
