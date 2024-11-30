import { PageTransition } from "@/components/page-transition";
import { PackageTypeList } from "@/components/packages/package-type-list";
import { Metadata } from "next";
import { getBaseMetadata } from "@/lib/metadata";

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

export default function PackagesPage() {
  return (
    <PageTransition>
      <PackageTypeList />
    </PageTransition>
  );
}