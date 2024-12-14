"use client";

import { PackageType, TravelPackage } from "@prisma/client";
import { PackageListHeader } from "./package-list-header";
import { PackageListGrid } from "./package-list-grid";
import { PackageListSearch } from "./package-list-search";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

interface PackageListProps {
  packageType: PackageType;
  initialPackages: (TravelPackage & {
    packageType: PackageType;
  })[];
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export function PackageList({
  packageType,
  initialPackages,
  totalCount,
  currentPage,
  perPage,
}: PackageListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <section className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <PackageListHeader packageType={packageType} />
      <PackageListSearch
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
        debouncedSearch={debouncedSearch}
      />
      <PackageListGrid
        packages={initialPackages}
        totalCount={totalCount}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={handlePageChange}
      />
    </section>
  );
}