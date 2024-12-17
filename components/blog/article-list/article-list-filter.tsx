"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArticleCategory } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface ArticleListFilterProps {
  categories: ArticleCategory[];
  currentCategory?: ArticleCategory;
  onSearch: (search: string) => void;
}

export function ArticleListFilter({
  categories,
  currentCategory,
  onSearch,
}: ArticleListFilterProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="bg-background rounded-lg shadow-md p-6 space-y-6 border mb-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar artigos..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categorias</Label>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={cn(
                "px-3 py-1 rounded-full border transition-colors hover:bg-primary hover:text-primary-foreground",
                !currentCategory && "bg-primary text-primary-foreground"
              )}
            >
              Todas
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/${category.slug}`}
                className={cn(
                  "px-3 py-1 rounded-full border transition-colors hover:bg-primary hover:text-primary-foreground",
                  currentCategory?.id === category.id &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}