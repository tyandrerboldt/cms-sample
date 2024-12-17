"use client";

import { Article, ArticleCategory } from "@prisma/client";
import { motion } from "framer-motion";
import { ArticleCard } from "@/components/blog/article-card";
import { Loader2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ArticleListGridProps {
  articles: (Article & {
    category: ArticleCategory;
  })[];
  loading?: boolean;
}

export function ArticleListGrid({ articles, loading }: ArticleListGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          Nenhum artigo encontrado.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={itemVariants}>
          <ArticleCard article={article} />
        </motion.div>
      ))}
    </motion.div>
  );
}