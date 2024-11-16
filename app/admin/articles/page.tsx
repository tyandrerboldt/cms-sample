import { ArticleList } from "@/components/admin/article-list";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminArticles() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Artigos</h1>
          <Link href="/admin/articles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Artigo
            </Button>
          </Link>
        </div>
        <ArticleList articles={articles} />
      </div>
    </PageTransition>
  );
}
