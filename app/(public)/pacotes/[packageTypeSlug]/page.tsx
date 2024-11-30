import { PageTransition } from "@/components/page-transition";
import { PackageList } from "@/components/packages/package-list";
import { Metadata } from "next";
import { getPackageTypeMetadata } from "@/lib/metadata";

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

export default function PackageTypePage({ params }: PackageTypePageProps) {
  return (
    <PageTransition>
      <PackageList packageTypeSlug={params.packageTypeSlug} />
    </PageTransition>
  );
}