import { prisma } from "@/lib/prisma";
import { PackageDetails } from "@/components/packages/package-details";
import { Metadata } from "next";
import { getPackageMetadata } from "@/lib/metadata";
import { generateTouristTripSchema } from "@/lib/schema";
import Script from "next/script";

interface PackageDetailsPageProps {
  params: {
    packageTypeSlug: string;
    packageSlug: string;
  };
}

export async function generateMetadata({
  params,
}: PackageDetailsPageProps): Promise<Metadata> {
  return getPackageMetadata(params.packageSlug);
}

export default async function PackageDetailsPage({ params }: PackageDetailsPageProps) {
  const [pkg, settings] = await Promise.all([
    prisma.travelPackage.findFirst({
      where: {
        slug: params.packageSlug,
        packageType: {
          slug: params.packageTypeSlug
        }
      },
      include: {
        packageType: true,
        images: true
      }
    }),
    prisma.siteSettings.findFirst()
  ]);

  const jsonLd = pkg && settings ? generateTouristTripSchema(pkg, settings) : null;

  return (
    <>
      {jsonLd && (
        <Script
          id="package-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PackageDetails packageSlug={params.packageSlug} />
    </>
  );
}