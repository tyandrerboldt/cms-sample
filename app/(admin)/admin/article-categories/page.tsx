"use client";

import { ArticleCategoryList } from "@/components/admin/article-category-list";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleCategory } from "@prisma/client";

interface CategoryWithCount extends ArticleCategory {
  _count: {
    articles: number;
  };
}

export default function AdminArticleCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/article-categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Categorias de Artigos</h1>
          <Link href="/admin/article-categories/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </Link>
        </div>
        <ArticleCategoryList categories={categories} />
      </div>
    </PageTransition>
  );
}