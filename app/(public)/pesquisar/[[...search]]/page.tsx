import { PackageFilter } from "@/components/packages/package-filter";
import { getBaseMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface PackagePageProps {
  params: {
    search: string;
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

export default async function PackagePage({params}: PackagePageProps) {
  const packageTypes = await prisma.packageType.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { packages: true },
      },
    },
  });

  return (
    <section className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <PackageFilter packageTypes={packageTypes} search={params?.search || ""} />
    </section>
  );
}
