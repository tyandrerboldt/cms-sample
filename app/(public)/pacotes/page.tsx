"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PackageCard } from "@/components/packages/package-card";
import { PackageFilter } from "@/components/packages/package-filter";
import { PageTransition } from "@/components/page-transition";
import { PackageType, TravelPackage } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PackageWithType extends TravelPackage {
  packageType: PackageType;
}

interface PackageResponse {
  packages: PackageWithType[];
  packageTypes: PackageType[];
  total: number;
  page: number;
  perPage: number;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageWithType[]>([]);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchParams = useSearchParams();
  const observer = useRef<IntersectionObserver>();
  const lastPackageRef = useCallback(
    (node: HTMLDivElement) => {
      if (initialLoading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [initialLoading, loadingMore, hasMore]
  );

  const fetchPackages = async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNum.toString());
      params.set("perPage", "4");

      const response = await fetch(`/api/front/packages?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch packages");
      const data: PackageResponse = await response.json();

      if (isInitial) {
        setPackages(data.packages);
        setPackageTypes(data.packageTypes);
      } else {
        setPackages((prev) => [...prev, ...data.packages]);
      }

      setHasMore(data.packages.length === 4);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    setPage(1);
    setPackages([]);
    setHasMore(true);
    fetchPackages(1, true);
  }, [searchParams]);

  useEffect(() => {
    if (page > 1) {
      fetchPackages(page);
    }
  }, [page]);

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-4xl font-bold mb-8">Pacotes de Viagem</h1>
        <div className="h-[200px] bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-4 md:py-8">
        <h1 className="text-4xl font-bold mb-8">Pacotes de Viagem</h1>

        <PackageFilter packageTypes={packageTypes} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              ref={index === packages.length - 1 ? lastPackageRef : undefined}
            >
              <PackageCard package={pkg} />
            </div>
          ))}
        </div>

        {loadingMore && (
          <div className="flex justify-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {packages.length === 0 && !loadingMore && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Nenhum pacote encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}