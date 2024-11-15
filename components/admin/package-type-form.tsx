"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PackageType } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const packageTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type PackageTypeFormData = z.infer<typeof packageTypeSchema>;

interface PackageTypeFormProps {
  packageTypeToEdit?: PackageType;
}

export function PackageTypeForm({ packageTypeToEdit }: PackageTypeFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PackageTypeFormData>({
    resolver: zodResolver(packageTypeSchema),
    defaultValues: packageTypeToEdit,
  });

  const onSubmit = async (data: PackageTypeFormData) => {
    try {
      const response = await fetch(
        packageTypeToEdit
          ? `/api/package-types/${packageTypeToEdit.id}`
          : "/api/package-types",
        {
          method: packageTypeToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to save package type");

      toast({
        title: packageTypeToEdit ? "Package Type Updated" : "Package Type Created",
        description: "The package type has been saved successfully.",
      });

      router.push("/admin/package-types");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the package type.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/package-types")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {packageTypeToEdit ? "Update Package Type" : "Create Package Type"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}