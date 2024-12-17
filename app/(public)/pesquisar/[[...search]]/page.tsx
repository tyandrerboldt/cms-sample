import { PackageSearch } from "@/components/packages/package-search";
import { getBaseMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface PackagePageProps {
  params: {
    search?: string[];
  };
  searchParams: {
    code?: string;
    typeSlug?: string;
    search?: string;
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

export default async function PackagePage({ params, searchParams }: PackagePageProps) {
  const [packageTypes, packages] = await Promise.all([
    prisma.packageType.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
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
            { title: { contains: searchParams.search } },
            { description: { contains: searchParams.search } },
            { location: { contains: searchParams.search } },
          ],
        }),
      },
      include: {
        packageType: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <PackageSearch
      initialPackages={packages}
      packageTypes={packageTypes}
      searchParams={searchParams}
    />
  );
}