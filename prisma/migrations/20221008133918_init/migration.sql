-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Post" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "channelId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "charId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_charId_fkey" FOREIGN KEY ("charId") REFERENCES "Char" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Char" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT,
    "letters" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Char_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharTitle" (
    "name" TEXT NOT NULL,
    "iconURL" TEXT NOT NULL,
    "charId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "CharTitle_charId_fkey" FOREIGN KEY ("charId") REFERENCES "Char" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GifInteraction" (
    "hugCount" INTEGER NOT NULL DEFAULT 0,
    "kissCount" INTEGER NOT NULL DEFAULT 0,
    "slapCount" INTEGER NOT NULL DEFAULT 0,
    "punchCount" INTEGER NOT NULL DEFAULT 0,
    "biteCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "GifInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_messageId_key" ON "Post"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "CharTitle_charId_key" ON "CharTitle"("charId");
