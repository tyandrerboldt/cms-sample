import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/page-transition";

export default async function ArticlePage({
  params,
}: {
  params: { categorySlug: string; articleSlug: string };
}) {
  const article = await prisma.article.findFirst({
    where: {
      slug: params.articleSlug,
      category: {
        slug: params.categorySlug,
      },
    },
    include: { category: true },
  });

  if (!article) {
    notFound();
  }

  return (
    <PageTransition>
      <article className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge>{article.category.name}</Badge>
              <time className="text-muted-foreground">
                {format(new Date(article.createdAt), "d 'de' MMMM 'de' yyyy")}
              </time>
            </div>

            <h1 className="text-4xl font-bold">{article.title}</h1>
            <p className="text-xl text-muted-foreground">{article.excerpt}</p>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </article>
    </PageTransition>
  );
}