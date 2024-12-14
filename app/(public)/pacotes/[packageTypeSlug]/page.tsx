import { PackageList } from "@/components/packages/package-list";
import { getPackageTypeMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { PackageStatus } from "@prisma/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PackageTypePageProps {
  params: {
    packageTypeSlug: string;
  };
  searchParams: {
    page?: string;
    search?: string;
  };
}

export async function generateMetadata({
  params,
}: PackageTypePageProps): Promise<Metadata> {
  return getPackageTypeMetadata(params.packageTypeSlug);
}

export default async function PackageTypePage({
  params,
  searchParams,
}: PackageTypePageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const perPage = 8;

  // Get package type
  const packageType = await prisma.packageType.findFirst({
    where: { slug: params.packageTypeSlug },
  });

  if (!packageType) {
    return notFound();
  }

  // Build where clause
  const where = {
    status: PackageStatus.ACTIVE,
    packageType: {
      slug: params.packageTypeSlug,
    },
    ...(search && {
      OR: [
        { code: { equals: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ],
    }),
  };

  // Get packages with pagination
  const [packages, totalCount] = await Promise.all([
    prisma.travelPackage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        packageType: true,
      },
    }),
    prisma.travelPackage.count({ where }),
  ]);

  return (
    <PackageList
      packageType={packageType}
      initialPackages={packages}
      totalCount={totalCount}
      currentPage={page}
      perPage={perPage}
    />
  );
}