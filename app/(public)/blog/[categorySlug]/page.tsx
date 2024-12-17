import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ArticleList } from "@/components/blog/article-list";
import { getBaseMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();
  const category = await prisma.articleCategory.findUnique({
    where: { slug: params.categorySlug },
  });

  if (!category) {
    return baseMetadata;
  }

  return {
    ...baseMetadata,
    title: category.name,
    description: category.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: category.name,
      description: category.description,
    },
  };
}

export async function generateStaticParams() {
  const categories = await prisma.articleCategory.findMany();
  return categories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, categories, articles] = await Promise.all([
    prisma.articleCategory.findUnique({
      where: { slug: params.categorySlug },
    }),
    prisma.articleCategory.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.article.findMany({
      where: {
        published: true,
        category: {
          slug: params.categorySlug,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        category: true,
      },
    }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <ArticleList
      initialArticles={articles}
      categories={categories}
      currentCategory={category}
    />
  );
}