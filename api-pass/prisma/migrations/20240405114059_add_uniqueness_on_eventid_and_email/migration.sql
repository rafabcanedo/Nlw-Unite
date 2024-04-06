/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "members_event_id_email_key" ON "members"("event_id", "email");
