"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PackageCard } from "@/components/packages/package-card";
import { PackageType, TravelPackage } from "@prisma/client";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface PackageWithType extends TravelPackage {
  packageType: PackageType;
}

interface PackageTypeResponse {
  packageType: PackageType;
  packages: PackageWithType[];
  page: number;
  perPage: number;
}

interface PackageListProps {
  packageTypeSlug: string;
}

export function PackageList({ packageTypeSlug }: PackageListProps) {
  const [packageType, setPackageType] = useState<PackageType | null>(null);
  const [packages, setPackages] = useState<PackageWithType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

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

      const params = new URLSearchParams();
      params.set("page", pageNum.toString());
      params.set("perPage", "8");
      if (debouncedSearch) params.set("search", debouncedSearch);

      const response = await fetch(
        `/api/front/package-types/${packageTypeSlug}?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data: PackageTypeResponse = await response.json();

      if (isInitial) {
        setPackages(data.packages);
        setPackageType(data.packageType);
      } else {
        setPackages((prev) => [...prev, ...data.packages]);
      }

      setHasMore(data.packages.length === 8);
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
  }, [packageTypeSlug, debouncedSearch]);

  useEffect(() => {
    if (page > 1) {
      fetchPackages(page);
    }
  }, [page]);

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 py-4 md:py-8">
        <div className="h-[100px] bg-muted animate-pulse rounded-lg mb-8" />
        <div className="h-[60px] bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!packageType) return null;

  return (
    <div className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{packageType.name}</h1>
      </div>

      <div className="bg-background rounded-lg shadow-md p-6 space-y-6 border mb-8">
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              className="pl-9"
              placeholder="Busque por nome, rio, UF do estado, código, etc..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            ref={index === packages.length - 1 ? lastPackageRef : undefined}
          >
            <PackageCard key={pkg.code} package={pkg} className="lg:max-h-[800px]" />
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
  );
}