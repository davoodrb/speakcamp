/*
  Warnings:

  - You are about to drop the `room_participants` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdBy]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "room_participants" DROP CONSTRAINT "room_participants_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_participants" DROP CONSTRAINT "room_participants_userId_fkey";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "maxUsers" INTEGER NOT NULL DEFAULT 6,
ALTER COLUMN "createdBy" DROP NOT NULL;

-- DropTable
DROP TABLE "room_participants";

-- CreateTable
CREATE TABLE "room_sessions" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "room_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_createdBy_key" ON "rooms"("createdBy");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_sessions" ADD CONSTRAINT "room_sessions_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_sessions" ADD CONSTRAINT "room_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
