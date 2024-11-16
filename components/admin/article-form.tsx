"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Article, ArticleCategory } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const articleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  excerpt: z.string().min(1, "Resumo é obrigatório"),
  imageUrl: z.string().url("Deve ser uma URL válida"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  published: z.boolean().default(false),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  articleToEdit?: Article;
  categories: ArticleCategory[];
}

export function ArticleForm({ articleToEdit, categories }: ArticleFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(articleToEdit?.published ?? false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      ...articleToEdit,
      published: isPublished,
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const response = await fetch(
        articleToEdit
          ? `/api/articles/${articleToEdit.id}`
          : "/api/articles",
        {
          method: articleToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Falha ao salvar o artigo");

      toast({
        title: articleToEdit ? "Artigo Atualizado" : "Artigo Criado",
        description: "O artigo foi salvo com sucesso.",
      });

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o artigo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full md:w-1/2">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                defaultValue={articleToEdit?.categoryId}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem Destacada</Label>
            <Input id="imageUrl" {...register("imageUrl")} />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              rows={3}
              placeholder="Escreva um breve resumo do artigo..."
            />
            {errors.excerpt && (
              <p className="text-sm text-red-500">{errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              {...register("content")}
              rows={15}
              className="font-mono"
              placeholder="Escreva o conteúdo do seu artigo aqui..."
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={(checked) => {
                setIsPublished(checked);
                setValue("published", checked);
              }}
            />
            <Label htmlFor="published">Publicar artigo</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/articles")}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {articleToEdit ? "Atualizar" : "Criar Artigo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}