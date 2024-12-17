import { PackageSearch } from "@/components/packages/package-search";
import { getBaseMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PackageStatus } from "@prisma/client";

interface PackagePageProps {
  params: {
    search?: string[];
  };
  searchParams: {
    code?: string;
    typeSlug?: string;
    search?: string;
    page?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();

  return {
    title: "Pesquisa de pacotes de Viagem",
    description: "Encontre o destino perfeito para sua próxima aventura",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Pesquisa de pacotes de Viagem",
      description: "Encontre o destino perfeito para sua próxima aventura",
    },
  };
}

export default async function SearchPage({ params, searchParams }: PackagePageProps) {
  const page = Number(searchParams.page) || 1;
  const perPage = 8;

  // Build where clause for filtering
  const where = {
    status: PackageStatus.ACTIVE,
    ...(searchParams.typeSlug && {
      packageType: {
        slug: searchParams.typeSlug,
      },
    }),
    ...(searchParams.code && {
      code: { equals: searchParams.code },
    }),
    ...(searchParams.search && {
      OR: [
        { slug: { contains: searchParams.search } },
        { title: { contains: searchParams.search } },
        { description: { contains: searchParams.search } },
        { location: { contains: searchParams.search } },
      ],
    }),
  };

  const [packageTypes, packages, totalCount] = await Promise.all([
    prisma.packageType.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.travelPackage.findMany({
      where,
      include: {
        packageType: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.travelPackage.count({ where }),
  ]);

  return (
    <PackageSearch
      initialPackages={packages}
      packageTypes={packageTypes}
      searchParams={searchParams}
      totalCount={totalCount}
      currentPage={page}
      perPage={perPage}
    />
  );
}