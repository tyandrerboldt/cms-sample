import { PackageList } from "@/components/admin/package-list";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  page?: string;
  perPage?: string;
  search?: string;
  status?: string;
  typeId?: string;
  highlighted?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AdminPackages({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 5;
  const search = searchParams.search;
  const status = searchParams.status;
  const typeId = searchParams.typeId;
  const highlighted = searchParams.highlighted === "true";
  const sortBy = searchParams.sortBy || "createdAt";
  const sortOrder = searchParams.sortOrder || "desc";

  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  const where: any = user?.role === "ADMIN" ? {} : { userId: user?.id };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status != "ALL") {
    where.status = status;
  }

  if (typeId && typeId != "ALL") {
    where.typeId = typeId;
  }

  if (highlighted) {
    where.OR = [{ highlight: "FEATURED" }, { highlight: "MAIN" }];
  }

  const total = await prisma.travelPackage.count({ where });

  const [packages, packageTypes] = await Promise.all([
    prisma.travelPackage.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
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
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pacotes de Viagem</h1>
          <div className="flex gap-4">
            <Link href="/admin/packages/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Pacote
              </Button>
            </Link>
          </div>
        </div>
        <PackageList
          packages={packages}
          packageTypes={packageTypes}
          currentPage={page}
          totalPages={Math.ceil(total / perPage)}
          totalItems={total}
          perPage={perPage}
        />
      </div>
    </PageTransition>
  );
}
