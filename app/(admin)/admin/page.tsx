"use client";

import { DashboardStats } from "@/components/admin/dashboard-stats";
import ForceRevalidationButton from "@/components/admin/force-relavidation-button";
import { PackageTypeChart } from "@/components/admin/package-type-chart";
import { RecentArticles } from "@/components/admin/recent-articles";
import { RecentPackages } from "@/components/admin/recent-packages";
import { TrendingPackages } from "@/components/admin/trending-packages";
import { PageTransition } from "@/components/page-transition";
import {
  Article,
  ArticleCategory,
  PackageType,
  TravelPackage,
} from "@prisma/client";
import { useEffect, useState } from "react";

interface DashboardData {
  recentPackages: (TravelPackage & { packageType: PackageType })[];
  recentArticles: (Article & { category: ArticleCategory })[];
  trendingPackages: (TravelPackage & { packageType: PackageType })[];
  packageStats: (PackageType & {
    _count: {
      packages: number;
    };
  })[];
  stats: {
    totalPackages: number;
    totalArticles: number;
    totalContacts: number;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 w-full 3xl:w-2/3">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <DashboardStats stats={data.stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RecentPackages packages={data.recentPackages} />
          <RecentArticles articles={data.recentArticles} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TrendingPackages packages={data.trendingPackages} />
          <PackageTypeChart packageStats={data.packageStats} />
        </div>
      </div>
    </PageTransition>
  );
}
