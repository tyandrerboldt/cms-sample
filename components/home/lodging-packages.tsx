"use client";

import { PackageCard } from "@/components/packages/package-card";
import { Button } from "@/components/ui/button";
import { PackageType, TravelPackage } from "@prisma/client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export function LodgingPackages() {
  const [packages, setPackages] = useState<
    (TravelPackage & { packageType: PackageType })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/front/lodging-packages");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (packages.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold">
              Pousadas
            </motion.h2>
            <motion.div variants={itemVariants}>
              <Link href="/pacotes/pousadas">
                <Button variant="ghost">
                  Ver Todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[400px] rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.code} package={pkg} className="lg:max-h-[800px]" />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
