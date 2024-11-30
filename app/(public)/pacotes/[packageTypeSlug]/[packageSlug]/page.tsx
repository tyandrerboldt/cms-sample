import { PageTransition } from "@/components/page-transition";
import { PackageDetails } from "@/components/packages/package-details";
import { Metadata } from "next";
import { getPackageMetadata } from "@/lib/metadata";

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

export default function PackageDetailsPage({ params }: PackageDetailsPageProps) {
  return (
    <PageTransition>
      <PackageDetails packageSlug={params.packageSlug} />
    </PageTransition>
  );
}