import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fetch all active packages
  const packages = await prisma.travelPackage.findMany({
    where: { status: "ACTIVE" },
    include: { packageType: true },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all published articles
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all package types
  const packageTypes = await prisma.packageType.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all article categories
  const articleCategories = await prisma.articleCategory.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pacotes`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quem-somos`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Package type routes
  const packageTypeRoutes = packageTypes.map((type) => ({
    url: `${baseUrl}/pacotes/${type.slug}`,
    lastModified: type.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Package routes
  const packageRoutes = packages.map((pkg) => ({
    url: `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
    lastModified: pkg.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Article category routes
  const articleCategoryRoutes = articleCategories.map((category) => ({
    url: `${baseUrl}/blog/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Article routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.category.slug}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...packageTypeRoutes,
    ...packageRoutes,
    ...articleCategoryRoutes,
    ...articleRoutes,
  ];
}