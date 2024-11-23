/*
  Warnings:

  - You are about to drop the column `bathrooms` on the `TravelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `dormitories` on the `TravelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `TravelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `TravelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `TravelPackage` table. All the data in the column will be lost.
  - You are about to drop the column `suites` on the `TravelPackage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TravelPackage" DROP COLUMN "bathrooms",
DROP COLUMN "dormitories",
DROP COLUMN "endDate",
DROP COLUMN "price",
DROP COLUMN "startDate",
DROP COLUMN "suites",
ADD COLUMN     "content" TEXT NOT NULL DEFAULT '';
