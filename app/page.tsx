"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { TravelPackage, PackageType } from "@prisma/client";
import { HeroCarousel } from "@/components/hero-carousel";
import { PackageCard } from "@/components/packages/package-card";

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<
    (TravelPackage & { packageType: PackageType })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/front/featured-packages");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        setFeaturedPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

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

  return (
    <>
      <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
      <main className="min-h-screen pt-16 bg-background">
        <PageTransition>
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* Pacotes em Destaque */}
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
                    className="text-3xl font-bold"
                  >
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
                ) : featuredPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredPackages.map((pkg, index) => (
                      <PackageCard package={pkg} key={index} />
                    ))}
                  </div>
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
        </PageTransition>
      </main>
    </>
  );
}
