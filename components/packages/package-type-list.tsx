"use client";

import { PackageTypeCard } from "@/components/packages/package-type-card";
import { PackageType } from "@prisma/client";
import { useEffect, useState } from "react";

interface PackageTypeWithCount extends PackageType {
  _count: {
    packages: number;
  };
}

export function PackageTypeList() {
  const [packageTypes, setPackageTypes] = useState<PackageTypeWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await fetch("/api/package-types");
        if (!response.ok) throw new Error("Failed to fetch package types");
        const data = await response.json();
        setPackageTypes(data);
      } catch (error) {
        console.error("Error fetching package types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageTypes();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-12 py-4 md:py-8">
        <div className="h-[60px] bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-[160px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (packageTypes.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-12 py-4 md:py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum tipo de pacote disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Pacotes de Viagem</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Escolha o tipo de pacote que você procura
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packageTypes.map((type) => (
          <PackageTypeCard key={type.id} packageType={type} />
        ))}
      </div>
    </div>
  );
}