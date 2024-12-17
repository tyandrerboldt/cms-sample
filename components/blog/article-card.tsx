import { Article, ArticleCategory } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article & {
    category: ArticleCategory;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/blog/${article.category.slug}/${article.slug}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        <div className="relative aspect-video">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">{article.category.name}</Badge>
            <time className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(article.createdAt), "d 'de' MMMM 'de' yyyy")}
            </time>
          </div>
          <h3 className="text-xl font-semibold line-clamp-2">{article.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
}