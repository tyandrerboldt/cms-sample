"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TravelPackage } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

const packageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  price: z.string().min(1, "Price is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxGuests: z.string().min(1, "Max guests is required"),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPackageCreated: () => void;
  packageToEdit?: TravelPackage | null;
}

export function PackageDialog({
  open,
  onOpenChange,
  onPackageCreated,
  packageToEdit,
}: PackageDialogProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: packageToEdit
      ? {
          ...packageToEdit,
          price: packageToEdit.price.toString(),
          startDate: new Date(packageToEdit.startDate)
            .toISOString()
            .split("T")[0],
          endDate: new Date(packageToEdit.endDate).toISOString().split("T")[0],
          maxGuests: packageToEdit.maxGuests.toString(),
        }
      : undefined,
  });

  const onSubmit = async (data: PackageFormData) => {
    try {
      const response = await fetch(
        packageToEdit ? `/api/packages/${packageToEdit.id}` : "/api/packages",
        {
          method: packageToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            price: parseFloat(data.price),
            maxGuests: parseInt(data.maxGuests),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save package");

      toast({
        title: packageToEdit ? "Package Updated" : "Package Created",
        description: "The travel package has been saved successfully.",
      });

      reset();
      onPackageCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the travel package.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {packageToEdit ? "Edit Package" : "Create Package"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" {...register("imageUrl")} />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">Max Guests</Label>
              <Input
                id="maxGuests"
                type="number"
                {...register("maxGuests")}
              />
              {errors.maxGuests && (
                <p className="text-sm text-red-500">{errors.maxGuests.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {packageToEdit ? "Update Package" : "Create Package"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}