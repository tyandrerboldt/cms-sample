"use client";

import { Article, ArticleCategory } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ArticleListProps {
  articles: (Article & {
    category: ArticleCategory;
  })[];
}

export function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao deletar o artigo");

      toast({
        title: "Artigo Deletado",
        description: "O artigo foi deletado com sucesso.",
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao deletar o artigo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.title}</TableCell>
              <TableCell>{article.category.name}</TableCell>
              <TableCell>
                <Badge variant={article.published ? "default" : "secondary"}>
                  {article.published ? "Publicado" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(article.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Link href={`/blog/${article.slug}`} target="_blank">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/articles/${article.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Artigo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza de que deseja deletar este artigo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(article.id)}>
                          Deletar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}