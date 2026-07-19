-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'TODO',
    "scope" TEXT NOT NULL DEFAULT 'DAY',
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Task" ("createdAt", "date", "description", "id", "status", "title", "updatedAt") SELECT "createdAt", "date", "description", "id", "status", "title", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE INDEX "Task_date_idx" ON "Task"("date");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_scope_date_idx" ON "Task"("scope", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
