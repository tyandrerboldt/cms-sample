/*
  Warnings:

  - You are about to drop the column `smtpFrom` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpHost` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPass` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpPort` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtpUser` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "smtpFrom",
DROP COLUMN "smtpHost",
DROP COLUMN "smtpPass",
DROP COLUMN "smtpPort",
DROP COLUMN "smtpUser";
