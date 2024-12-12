import { PackageList } from "@/components/packages/package-list";
import { getPackageTypeMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { generatePackageListSchema } from "@/lib/schema";
import { Metadata } from "next";
import Script from "next/script";

interface PackageTypePageProps {
  params: {
    packageTypeSlug: string;
  };
}

// Gera os parâmetros estáticos para todas as páginas de tipos de pacotes
export async function generateStaticParams() {
  const packageTypes = await prisma.packageType.findMany();

  return packageTypes.map((type) => ({
    packageTypeSlug: type.slug,
  }));
}

export async function generateMetadata({
  params,
}: PackageTypePageProps): Promise<Metadata> {
  return getPackageTypeMetadata(params.packageTypeSlug);
}

export default async function PackageTypePage({
  params,
}: PackageTypePageProps) {
  const [packageType, packages] = await Promise.all([
    prisma.packageType.findFirst({
      where: { slug: params.packageTypeSlug }
    }),
    prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        packageType: {
          slug: params.packageTypeSlug
        }
      },
      include: {
        packageType: true
      },
      take: 10
    })
  ]);

  const jsonLd = generatePackageListSchema(packages, packageType || undefined);

  return (
    <>
      <Script
        id="package-list-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PackageList packageTypeSlug={params.packageTypeSlug} />
    </>
  );
}
