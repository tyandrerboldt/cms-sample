import { PackageListClient } from "@/components/packages/package-list-client";
import { getPackageTypeMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { PackageStatus } from "@prisma/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PackageTypePageProps {
  params: {
    packageTypeSlug: string;
  };
}

export async function generateStaticParams() {
  const packageTypes = await prisma.packageType.findMany({});

  return packageTypes.map((pkgType) => ({
    packageTypeSlug: pkgType.slug,
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
  const packageType = await prisma.packageType.findFirst({
    where: { slug: params.packageTypeSlug },
  });

  if (!packageType) {
    return notFound();
  }

  const recentPackages = await prisma.travelPackage.findMany({
    where: {
      status: PackageStatus.ACTIVE,
      packageType: {
        slug: params.packageTypeSlug,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <>
      <PackageListClient packageTypeSlug={params.packageTypeSlug} />

      {recentPackages && recentPackages.length > 0 && <section className="container mx-auto px-4 py-8 border-t mt-8">
        <h2 className="text-lg font-medium text-muted-foreground mb-4">
          Mais Recentes
        </h2>
        <article className="grid md:grid-cols-3 gap-4">
          {recentPackages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/pacotes/${params.packageTypeSlug}/${pkg.slug}`}
              className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{pkg.code}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-sm truncate">
                    {pkg.location}
                  </span>
                </div>
                <h3 className="font-medium mb-1 truncate">{pkg.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {pkg.description}
                </p>
              </div>
            </Link>
          ))}
        </article>
      </section>}
    </>
  );
}
