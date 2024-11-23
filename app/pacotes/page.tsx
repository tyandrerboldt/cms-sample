import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/packages/package-card";
import { PackageFilter } from "@/components/packages/package-filter";
import { PageTransition } from "@/components/page-transition";
import { PackageType } from "@prisma/client";

interface SearchParams {
  page?: string;
  perPage?: string;
  code?: string;
  typeId?: string;
  title?: string;
  description?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
  maxGuests?: string;
  dormitories?: string;
  suites?: string;
  bathrooms?: string;
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 12;

  // Build where clause based on filters
  const where: any = {
    status: "ACTIVE",
  };

  if (searchParams.code) {
    where.code = { contains: searchParams.code, mode: "insensitive" };
  }

  if (searchParams.typeId) {
    where.typeId = searchParams.typeId;
  }

  if (searchParams.title) {
    where.title = { contains: searchParams.title, mode: "insensitive" };
  }

  if (searchParams.description) {
    where.description = { contains: searchParams.description, mode: "insensitive" };
  }


  if (searchParams.maxGuests) {
    where.maxGuests = { gte: parseInt(searchParams.maxGuests) };
  }

  if (searchParams.suites) {
    where.suites = { gte: parseInt(searchParams.suites) };
  }

  if (searchParams.bathrooms) {
    where.bathrooms = { gte: parseInt(searchParams.bathrooms) };
  }

  // Get total count for pagination
  const total = await prisma.travelPackage.count({ where });

  // Get packages with pagination
  const [packages, packageTypes] = await Promise.all([
    prisma.travelPackage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        packageType: true,
      },
    }),
    prisma.packageType.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8">Pacotes de Viagem</h1>

        <PackageFilter packageTypes={packageTypes} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum pacote encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}