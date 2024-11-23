"use client";

import { PackageTypeList } from "@/components/admin/package-type-list";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PackageType } from "@prisma/client";

interface PackageTypeWithCount extends PackageType {
  _count: {
    packages: number;
  };
}

export default function AdminPackageTypes() {
  const [packageTypes, setPackageTypes] = useState<PackageTypeWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await fetch('/api/package-types');
        if (!response.ok) throw new Error('Failed to fetch package types');
        const data = await response.json();
        setPackageTypes(data);
      } catch (error) {
        console.error('Error fetching package types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageTypes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tipos de Pacotes</h1>
          <Link href="/admin/package-types/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Tipo
            </Button>
          </Link>
        </div>
        <PackageTypeList packageTypes={packageTypes} />
      </div>
    </PageTransition>
  );
}