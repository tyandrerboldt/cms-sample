"use client";

import { PackageType, TravelPackage } from "@prisma/client";
import { PackageFilter } from "../package-filter";
import { PackageSearchHeader } from "./package-search-header";
import { PackageSearchGrid } from "./package-search-grid";
import { useCallback, useState } from "react";

interface PackageSearchProps {
  initialPackages: (TravelPackage & {
    packageType: PackageType;
  })[];
  packageTypes: PackageType[];
  searchParams: {
    code?: string;
    typeSlug?: string;
    search?: string;
  };
}

export function PackageSearch({
  initialPackages,
  packageTypes,
  searchParams,
}: PackageSearchProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/front/packages?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch packages");
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <section className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <PackageSearchHeader searchParams={searchParams} />
      <PackageFilter
        packageTypes={packageTypes}
        search={searchParams.search}
        onSearch={handleSearch}
      />
      <PackageSearchGrid packages={packages} loading={loading} />
    </section>
  );
}