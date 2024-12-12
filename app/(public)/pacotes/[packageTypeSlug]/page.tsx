import { PackageList } from "@/components/packages/package-list";
import { PageTransition } from "@/components/page-transition";
import { getPackageTypeMetadata } from "@/lib/metadata";
import { Metadata } from "next";

interface PackageTypePageProps {
  params: {
    packageTypeSlug: string;
  };
}

export async function generateMetadata({
  params,
}: PackageTypePageProps): Promise<Metadata> {
  return getPackageTypeMetadata(params.packageTypeSlug);
}

export default async function PackageTypePage({
  params,
}: PackageTypePageProps) {
  // const [packageType, packages] = await Promise.all([
  //   prisma.packageType.findFirst({
  //     where: { slug: params.packageTypeSlug }
  //   }),
  //   prisma.travelPackage.findMany({
  //     where: {
  //       status: "ACTIVE",
  //       packageType: {
  //         slug: params.packageTypeSlug
  //       }
  //     },
  //     include: {
  //       packageType: true
  //     },
  //     take: 10
  //   })
  // ]);

  // const jsonLd = generatePackageListSchema(packages, packageType || undefined);

  return (
    <PageTransition>
      {/* <Script
        id="package-list-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      /> */}
      <PackageList packageTypeSlug={params.packageTypeSlug} />
    </PageTransition>
  );
}
