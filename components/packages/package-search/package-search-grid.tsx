"use client";

import { PackageCard } from "@/components/packages/package-card";
import { PackageType, TravelPackage } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface PackageSearchGridProps {
  packages: (TravelPackage & {
    packageType: PackageType;
  })[];
  loading?: boolean;
  lastPackageRef?: (node: HTMLDivElement) => void;
  hasMore?: boolean;
}

export function PackageSearchGrid({
  packages,
  loading,
  lastPackageRef,
  hasMore,
}: PackageSearchGridProps) {
  if (packages.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          Nenhum pacote encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            variants={itemVariants}
            ref={index === packages.length - 1 ? lastPackageRef : undefined}
          >
            <PackageCard package={pkg} />
          </motion.div>
        ))}
      </motion.div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && packages.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Não há mais pacotes para carregar.
        </div>
      )}
    </>
  );
}