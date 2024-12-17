"use client";

import { PackageType, TravelPackage } from "@prisma/client";
import { PackageFilter } from "../package-filter";
import { PackageSearchHeader } from "./package-search-header";
import { PackageSearchGrid } from "./package-search-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PackageSearchProps {
  initialPackages: (TravelPackage & {
    packageType: PackageType;
  })[];
  packageTypes: PackageType[];
  searchParams: {
    code?: string;
    typeSlug?: string;
    search?: string;
    page?: string;
  };
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export function PackageSearch({
  initialPackages,
  packageTypes,
  searchParams,
  totalCount,
  currentPage,
  perPage,
}: PackageSearchProps) {
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPackages.length === perPage);
  const observer = useRef<IntersectionObserver>();

  const lastPackageRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPackages = useCallback(async (params: URLSearchParams, isNewSearch: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/front/packages/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch packages");
      const data = await response.json();

      setPackages((prev) => isNewSearch ? data.packages : [...prev, ...data.packages]);
      setHasMore(data.packages.length === perPage);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const handleSearch = useCallback((params: URLSearchParams) => {
    setPage(1);
    router.push(`/pesquisar?${params.toString()}`);
    fetchPackages(params, true);
  }, [router, fetchPackages]);

  useEffect(() => {
    if (page > 1) {
      const params = new URLSearchParams(searchParams as any);
      params.set("page", page.toString());
      fetchPackages(params);
    }
  }, [page, searchParams, fetchPackages]);

  return (
    <section className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <PackageSearchHeader searchParams={searchParams} />
      <PackageFilter
        packageTypes={packageTypes}
        search={searchParams.search}
        onSearch={handleSearch}
      />
      <PackageSearchGrid
        packages={packages}
        loading={loading}
        lastPackageRef={lastPackageRef}
        hasMore={hasMore}
      />
    </section>
  );
}