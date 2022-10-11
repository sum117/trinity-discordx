/*
  Warnings:

  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "locale" TEXT DEFAULT 'en';

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Server";
PRAGMA foreign_keys=on;
