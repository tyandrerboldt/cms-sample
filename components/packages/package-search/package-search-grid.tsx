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
}

export function PackageSearchGrid({ packages, loading }: PackageSearchGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          Nenhum pacote encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {packages.map((pkg) => (
        <motion.div key={pkg.id} variants={itemVariants}>
          <PackageCard package={pkg} />
        </motion.div>
      ))}
    </motion.div>
  );
}