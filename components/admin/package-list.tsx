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
      if (!response.ok) throw new Error("Failed to delete package");

      toast({
        title: "Package Deleted",
        description: "The travel package has been deleted successfully.",
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the package.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell>{pkg.title}</TableCell>
              <TableCell>{pkg.location}</TableCell>
              <TableCell>${pkg.price.toString()}</TableCell>
              <TableCell>
                {format(new Date(pkg.startDate), "MMM d, yyyy")} -{" "}
                {format(new Date(pkg.endDate), "MMM d, yyyy")}
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
                        <AlertDialogTitle>Delete Package</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this package? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(pkg.id)}>
                          Delete
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