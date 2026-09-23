/*
  Warnings:

  - You are about to drop the column `maxUsers` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "maxUsers",
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 6;
