import { PackageTypeList } from "@/components/packages/package-type-list";
import { getBaseMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();
  
  return {
    title: "Pacotes de Viagem",
    description: "Explore nossa seleção de pacotes de viagem e encontre o destino perfeito para sua próxima aventura",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Pacotes de Viagem",
      description: "Explore nossa seleção de pacotes de viagem e encontre o destino perfeito para sua próxima aventura",
    },
  };
}

export default async function PackagesPage() {
  const packageTypes = await prisma.packageType.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { packages: true }
      }
    }
  });

  return <PackageTypeList packageTypes={packageTypes} />;
}