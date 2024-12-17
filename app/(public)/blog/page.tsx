import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ArticleList } from "@/components/blog/article-list";
import { getBaseMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();
  
  return {
    ...baseMetadata,
    title: "Blog",
    description: "Confira nossos artigos sobre pesca esportiva, dicas de pescaria, destinos e muito mais.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Blog",
      description: "Confira nossos artigos sobre pesca esportiva, dicas de pescaria, destinos e muito mais.",
    },
  };
}

export default async function BlogPage() {
  // Get all categories for filter
  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: "asc" },
  });

  // Get recent articles for initial display
  const recentArticles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      category: true,
    },
  });

  return <ArticleList initialArticles={recentArticles} categories={categories} />;
}