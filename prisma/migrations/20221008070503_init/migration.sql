-- CreateTable
CREATE TABLE "GifInteraction" (
    "hugCount" INTEGER NOT NULL,
    "kissCount" INTEGER NOT NULL,
    "slapCount" INTEGER NOT NULL,
    "punchCount" INTEGER NOT NULL,
    "biteCount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "GifInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
