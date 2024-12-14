import PackageDetails from "@/components/packages/package-details";
import { getPackageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { generateTouristTripSchema } from "@/lib/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

interface PackageDetailsPageProps {
  params: {
    packageTypeSlug: string;
    packageSlug: string;
  };
}

// Gera os parâmetros estáticos para todas as páginas de pacotes ativos
export async function generateStaticParams() {
  const packages = await prisma.travelPackage.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      packageType: true,
    },
  });

  return packages.map((pkg) => ({
    packageTypeSlug: pkg.packageType.slug,
    packageSlug: pkg.slug,
  }));
}

// Adiciona metadados estáticos para melhorar o SEO
// export async function generateMetadata({
//   params,
// }: PackageDetailsPageProps): Promise<Metadata> {
//   return getPackageMetadata(params.packageSlug);
// }

// Declaração explícita que essa página é estática
export const dynamicParams = false;

export default async function PackageDetailsPage({
  params,
}: PackageDetailsPageProps) {
  // Busca dados necessários no momento da geração estática
  const [pkg, settings] = await prisma.$transaction([
    prisma.travelPackage.findFirst({
      where: {
        slug: params.packageSlug,
        packageType: {
          slug: params.packageTypeSlug,
        },
      },
      include: {
        packageType: true,
        images: true,
      },
    }),
    prisma.siteSettings.findFirst(),
  ]);

  if (!pkg) {
    // Trate o caso de pacotes inválidos para melhorar a experiência de SEO e evitar erros
    return notFound();
  }

  const jsonLd = pkg && settings ? generateTouristTripSchema(pkg) : null;

  return (
    <>
      {jsonLd && (
        <Script
          id="package-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PackageDetails pkg={pkg} settings={settings} />
    </>
  );
}
