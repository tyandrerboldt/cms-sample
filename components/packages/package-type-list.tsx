"use client";

import { PackageTypeGrid } from "./package-type-grid";
import { PackageType } from "@prisma/client";

interface PackageTypeListProps {
  packageTypes: (PackageType & {
    _count: {
      packages: number;
    };
  })[];
}

export function PackageTypeList({ packageTypes }: PackageTypeListProps) {
  return (
    <div className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <div className="mb-8">
      <h1 className="text-4xl font-bold">Pacotes de Viagem</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Escolha o tipo de pacote que você procura
      </p>
    </div>
      <PackageTypeGrid packageTypes={packageTypes} />
    </div>
  );
}