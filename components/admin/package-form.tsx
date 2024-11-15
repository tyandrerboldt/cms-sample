"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PackageImage, TravelPackage, PackageType } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const packageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  maxGuests: z.string().min(1, "Max guests is required"),
  typeId: z.string().min(1, "Package type is required"),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  packageToEdit?: TravelPackage & { images?: PackageImage[] };
  packageTypes?: PackageType[];
}

export function PackageForm({ packageToEdit, packageTypes = [] }: PackageFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [images, setImages] = useState<{ file?: File; url: string; isMain: boolean }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      const formData = new FormData();
      images.forEach((image, index) => {
        if (image.file) {
          formData.append(`images`, image.file);
          formData.append(`imageIsMain${index}`, image.isMain.toString());
        } else {
          formData.append(`existingImages`, image.url);
          formData.append(`existingImageIsMain${image.url}`, image.isMain.toString());
        }
      });

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        packageToEdit ? `/api/packages/${packageToEdit.id}` : "/api/packages",
        {
          method: packageToEdit ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to save package");

      toast({
        title: packageToEdit ? "Package Updated" : "Package Created",
        description: "The travel package has been saved successfully.",
      });

      router.push("/admin/packages");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the travel package.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageType">Package Type</Label>
            <Select
              defaultValue={packageToEdit?.typeId}
              onValueChange={(value) => setValue("typeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a package type" />
              </SelectTrigger>
              <SelectContent>
                {packageTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.typeId && (
              <p className="text-sm text-red-500">{errors.typeId.message}</p>
            )}
          </div>

          <ImageUpload
            existingImages={packageToEdit?.images}
            onImagesChange={setImages}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/packages")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {packageToEdit ? "Update Package" : "Create Package"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}