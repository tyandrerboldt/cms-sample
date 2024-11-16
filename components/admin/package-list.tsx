"use client";

import { TravelPackage } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface PackageListProps {
  packages: TravelPackage[];
}

export function PackageList({ packages }: PackageListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao deletar o pacote");

      toast({
        title: "Pacote Deletado",
        description: "O pacote de viagem foi deletado com sucesso.",
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao deletar o pacote.",
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
            <TableHead>Localização</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Datas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell>{pkg.title}</TableCell>
              <TableCell>{pkg.location}</TableCell>
              <TableCell>R${pkg.price.toString()}</TableCell>
              <TableCell>
                {format(new Date(pkg.startDate), "d 'de' MMM 'de' yyyy")} -{" "}
                {format(new Date(pkg.endDate), "d 'de' MMM 'de' yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Link href={`/admin/packages/${pkg.id}`}>
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
                        <AlertDialogTitle>Deletar Pacote</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza de que deseja deletar este pacote? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(pkg.id)}>
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