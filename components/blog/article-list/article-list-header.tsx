import { ArticleCategory } from "@prisma/client";

interface ArticleListHeaderProps {
  category?: ArticleCategory;
}

export function ArticleListHeader({ category }: ArticleListHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">
        {category ? category.name : "Blog"}
      </h1>
      <p className="text-lg text-muted-foreground mt-2">
        {category
          ? category.description
          : "Confira nossos artigos sobre pesca esportiva, dicas de pescaria, destinos e muito mais."}
      </p>
    </div>
  );
}