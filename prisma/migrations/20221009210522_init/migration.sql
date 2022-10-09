-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Char" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "music" TEXT,
    "color" TEXT,
    "letters" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Char_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Char" ("authorId", "color", "createdAt", "description", "id", "image", "letters", "likes", "music", "name", "prefix") SELECT "authorId", "color", "createdAt", "description", "id", "image", "letters", "likes", "music", "name", "prefix" FROM "Char";
DROP TABLE "Char";
ALTER TABLE "new_Char" RENAME TO "Char";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
