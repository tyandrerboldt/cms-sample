"use client";

import { PackageType } from "@prisma/client";
import { motion } from "framer-motion";
import { PackageTypeCard } from "@/components/packages/package-type-card";

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

interface PackageTypeGridProps {
  packageTypes: (PackageType & {
    _count: {
      packages: number;
    };
  })[];
}

export function PackageTypeGrid({ packageTypes }: PackageTypeGridProps) {
  if (packageTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          Nenhum tipo de pacote disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {packageTypes.map((type) => (
        <motion.div key={type.id} variants={itemVariants}>
          <PackageTypeCard packageType={type} />
        </motion.div>
      ))}
    </motion.div>
  );
}