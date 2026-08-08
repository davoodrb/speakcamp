/*
  Warnings:

  - A unique constraint covering the columns `[createdBy,deletedAt]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rooms_createdBy_key";

-- CreateIndex
CREATE UNIQUE INDEX "rooms_createdBy_deletedAt_key" ON "rooms"("createdBy", "deletedAt");
