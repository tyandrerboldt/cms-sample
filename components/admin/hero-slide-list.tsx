"use client";

import { HeroSlide } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface HeroSlideListProps {
  slides: HeroSlide[];
}

export function HeroSlideList({ slides }: HeroSlideListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete slide");

      toast({
        title: "Slide Deletado",
        description: "O slide foi deletado com sucesso.",
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao deletar o slide.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mídia</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.map((slide) => (
            <TableRow key={slide.id}>
              <TableCell>
                {slide.imageUrl ? (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : slide.videoUrl ? (
                  <Video className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="font-medium">{slide.title}</TableCell>
              <TableCell>
                {slide.linkUrl && (
                  <Link
                    href={slide.linkUrl}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    {slide.linkText || "Ver link"}
                  </Link>
                )}
              </TableCell>
              <TableCell>{slide.order}</TableCell>
              <TableCell>
                <Badge variant={slide.isActive ? "default" : "secondary"}>
                  {slide.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(slide.createdAt), "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Link href={`/admin/hero-slides/${slide.id}`}>
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
                        <AlertDialogTitle>Deletar Slide</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar este slide? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(slide.id)}>
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