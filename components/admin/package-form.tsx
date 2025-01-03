"use client";

import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PackageImage, PackageType, TravelPackage } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RichTextEditor } from "./rich-text-editor";

const packageSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  location: z.string().min(1, "Localização é obrigatória"),
  maxGuests: z.string().min(1, "Máximo de hóspedes é obrigatório"),
  typeId: z.string().min(1, "Tipo de pacote é obrigatório"),
  numberOfDays: z.string().min(1, "Número de diárias é obrigatório"),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "UNAVAILABLE"]),
  highlight: z.enum(["NORMAL", "FEATURED", "MAIN"]),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  packageToEdit?: TravelPackage & { images?: PackageImage[] };
  packageTypes?: PackageType[];
}

export function PackageForm({
  packageToEdit,
  packageTypes = [],
}: PackageFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<
    { file?: File; url: string; isMain: boolean }[]
  >(
    packageToEdit?.images?.map((img) => ({
      url: img.url,
      isMain: img.isMain,
    })) || []
  );
  const [content, setContent] = useState(packageToEdit?.content || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: packageToEdit
      ? {
          ...packageToEdit,
          maxGuests: packageToEdit.maxGuests.toString(),
          numberOfDays: `${packageToEdit.numberOfDays}`,
          content: content,
          highlight: packageToEdit.highlight || "NORMAL",
        }
      : {
          status: "DRAFT",
          numberOfDays: "1",
          highlight: "NORMAL",
        },
  });

  const onSubmit = async (data: PackageFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Handle images
      images.forEach((image, index) => {
        if (image.file) {
          formData.append("images", image.file);
          formData.append(`imageIsMain${index}`, image.isMain.toString());
        } else {
          formData.append("existingImages", image.url);
          formData.append(
            `existingImageIsMain${image.url}`,
            image.isMain.toString()
          );
        }
      });

      // Add all other form data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await fetch(
        packageToEdit ? `/api/packages/${packageToEdit.id}` : "/api/packages",
        {
          method: packageToEdit ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Falha ao salvar o pacote");

      toast({
        title: packageToEdit ? "Pacote Atualizado" : "Pacote Criado",
        description: "O pacote de viagem foi salvo com sucesso.",
      });

      router.push("/admin/packages");
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o pacote de viagem.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full md:w-2/3">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código do Pacote</Label>
              <Input id="code" {...register("code")} />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={packageToEdit?.status || "DRAFT"}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Rascunho</SelectItem>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                  <SelectItem value="UNAVAILABLE">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" {...register("location")} />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageType">Tipo de Pacote</Label>
            <Select
              defaultValue={packageToEdit?.typeId}
              onValueChange={(value) => setValue("typeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo de pacote" />
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

          <div className="space-y-2">
            <Label>Destaque</Label>
            <RadioGroup
              defaultValue={packageToEdit?.highlight || "NORMAL"}
              onValueChange={(value) =>
                setValue("highlight", value as "NORMAL" | "FEATURED" | "MAIN")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NORMAL" id="normal" />
                <Label htmlFor="normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FEATURED" id="featured" />
                <Label htmlFor="featured">Destaque</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MAIN" id="main" />
                <Label htmlFor="main">Principal</Label>
              </div>
            </RadioGroup>
          </div>

          <ImageUpload
            existingImages={packageToEdit?.images}
            onImagesChange={setImages}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Curta</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <div className="min-h-[400px]">
              <RichTextEditor
                content={content}
                onChange={(newContent) => {
                  setContent(newContent);
                  setValue("content", newContent);
                }}
              />
            </div>
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfDays">Diárias</Label>
              <Input
                id="numberOfDays"
                type="number"
                min="1"
                {...register("numberOfDays")}
              />
              {errors.numberOfDays && (
                <p className="text-sm text-red-500">
                  {errors.numberOfDays.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">Máximo de Hóspedes</Label>
              <Input id="maxGuests" type="number" {...register("maxGuests")} />
              {errors.maxGuests && (
                <p className="text-sm text-red-500">
                  {errors.maxGuests.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/packages")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {packageToEdit ? "Atualizar Pacote" : "Criar Pacote"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
