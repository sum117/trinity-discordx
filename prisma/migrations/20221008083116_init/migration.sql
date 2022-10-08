-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GifInteraction" (
    "hugCount" INTEGER NOT NULL DEFAULT 0,
    "kissCount" INTEGER NOT NULL DEFAULT 0,
    "slapCount" INTEGER NOT NULL DEFAULT 0,
    "punchCount" INTEGER NOT NULL DEFAULT 0,
    "biteCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "GifInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GifInteraction" ("biteCount", "hugCount", "kissCount", "punchCount", "slapCount", "userId") SELECT "biteCount", "hugCount", "kissCount", "punchCount", "slapCount", "userId" FROM "GifInteraction";
DROP TABLE "GifInteraction";
ALTER TABLE "new_GifInteraction" RENAME TO "GifInteraction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
