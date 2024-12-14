"use client";

import { PackageCard } from "@/components/packages/package-card";
import { Button } from "@/components/ui/button";
import { PackageType, TravelPackage } from "@prisma/client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface PackageListGridProps {
  packages: (TravelPackage & {
    packageType: PackageType;
  })[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

export function PackageListGrid({
  packages,
  totalCount,
  currentPage,
  perPage,
  onPageChange,
}: PackageListGridProps) {
  const totalPages = Math.ceil(totalCount / perPage);

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
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {packages.map((pkg) => (
          <motion.div key={pkg.id} variants={itemVariants}>
            <PackageCard package={pkg} className="lg:max-h-[800px]" />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}