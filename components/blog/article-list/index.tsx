"use client";

import { Article, ArticleCategory } from "@prisma/client";
import { ArticleListHeader } from "./article-list-header";
import { ArticleListGrid } from "./article-list-grid";
import { ArticleListFilter } from "./article-list-filter";
import { useCallback, useState } from "react";

interface ArticleListProps {
  initialArticles: (Article & {
    category: ArticleCategory;
  })[];
  categories: ArticleCategory[];
  currentCategory?: ArticleCategory;
}

export function ArticleList({
  initialArticles,
  categories,
  currentCategory,
}: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (currentCategory) params.set("categoryId", currentCategory.id);

      const response = await fetch(`/api/front/articles?${params.toString()}`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }, [currentCategory]);

  return (
    <div className="container mx-auto px-4 pt-12 py-4 md:py-8">
      <ArticleListHeader category={currentCategory} />
      <ArticleListFilter
        categories={categories}
        currentCategory={currentCategory}
        onSearch={handleSearch}
      />
      <ArticleListGrid articles={articles} loading={loading} />
    </div>
  );
}