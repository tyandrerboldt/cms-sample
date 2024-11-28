-- CreateEnum
CREATE TYPE "PackageHighlight" AS ENUM ('NORMAL', 'FEATURED', 'MAIN');

-- AlterTable
ALTER TABLE "TravelPackage" ADD COLUMN     "highlight" "PackageHighlight" NOT NULL DEFAULT 'NORMAL';
