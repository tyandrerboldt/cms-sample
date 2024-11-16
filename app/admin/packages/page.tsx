import { prisma } from "@/lib/prisma";
import { PackageList } from "@/components/admin/package-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminPackages() {
  const packages = await prisma.travelPackage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pacotes</h1>
        <Link href="/admin/packages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pacote
          </Button>
        </Link>
      </div>
      <PackageList packages={packages} />
    </div>
  );
}