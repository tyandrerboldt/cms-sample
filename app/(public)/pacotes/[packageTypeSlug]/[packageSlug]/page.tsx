import { PackageDetails } from "@/components/packages/package-details";
import { getPackageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: PackageDetailsPageProps): Promise<Metadata> {
  return getPackageMetadata(params.packageSlug);
}

export default async function PackageDetailsPage({
  params,
}: PackageDetailsPageProps) {
  // const [pkg, settings] = await Promise.all([
  //   prisma.travelPackage.findFirst({
  //     where: {
  //       slug: params.packageSlug,
  //       packageType: {
  //         slug: params.packageTypeSlug
  //       }
  //     },
  //     include: {
  //       packageType: true,
  //       images: true
  //     }
  //   }),
  //   prisma.siteSettings.findFirst()
  // ]);

  // const jsonLd = pkg && settings ? generateTouristTripSchema(pkg, settings) : null;

  return (
    <>
      {/* {jsonLd && (
        <Script
          id="package-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )} */}
      <PackageDetails packageSlug={params.packageSlug} />
    </>
  );
}
