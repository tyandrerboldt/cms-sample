"use client";

import { TravelPackage, PackageType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PackageCard } from "@/components/packages/package-card";
import { PackageCardVertical } from "@/components/packages/package-card-vertical";
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

export function FeaturedPackages() {
  const [packages, setPackages] = useState<
    (TravelPackage & { packageType: PackageType })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/front/featured-packages");
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

  const mainPackage = packages.find((pkg) => pkg.highlight === "MAIN");
  const featuredPackages = packages.filter(
    (pkg) => pkg.highlight === "FEATURED"
  );

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold flex items-center gap-2"
            >
              <Sparkles className="h-8 w-8" />
              Pacotes em Destaque
            </motion.h2>
            <motion.div variants={itemVariants}>
              <Link href="/pacotes">
                <Button variant="ghost">
                  Ver Todos
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
          ) : packages.length > 0 ? (
            mainPackage ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <PackageCard
                  key={mainPackage.code}
                  package={mainPackage}
                  isMain={true}
                  className="h-full lg:max-h-full"
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {featuredPackages.slice(0, 4).map((pkg, index) => (
                    <PackageCardVertical
                      key={pkg.code}
                      package={pkg}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPackages.slice(0, 3).map((pkg, index) => (
                  <PackageCard
                    key={pkg.code}
                    package={pkg}
                    className="h-full"
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Nenhum pacote disponível no momento.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
