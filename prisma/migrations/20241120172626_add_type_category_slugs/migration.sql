/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ArticleCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `PackageType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ArticleCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `PackageType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleCategory" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PackageType" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON "ArticleCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageType_slug_key" ON "PackageType"("slug");
