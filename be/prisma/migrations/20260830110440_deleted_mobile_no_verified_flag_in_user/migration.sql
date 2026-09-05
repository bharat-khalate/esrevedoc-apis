/*
  Warnings:

  - You are about to drop the column `is_mobile_number_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_mobile_number_verified",
ADD COLUMN     "mobile_number_verified_at" TIMESTAMP(3);
