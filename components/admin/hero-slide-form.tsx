"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HeroSlide } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const slideSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
  linkText: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().min(0),
});

type SlideFormData = z.infer<typeof slideSchema>;

interface HeroSlideFormProps {
  slideToEdit?: HeroSlide;
}

export function HeroSlideForm({ slideToEdit }: HeroSlideFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    slideToEdit?.imageUrl || null
  );
  const [mediaType, setMediaType] = useState<"image" | "video">(
    // slideToEdit?.videoUrl ? "video" : "image"
    "image"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SlideFormData>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      ...slideToEdit,
      videoUrl: slideToEdit?.videoUrl ?? "",
      isActive: slideToEdit?.isActive ?? true,
      order: slideToEdit?.order ?? 0,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview && !slideToEdit?.imageUrl) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const onSubmit = async (data: SlideFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Handle image
      if (mediaType === "image") {
        if (imageFile) {
          formData.append("image", imageFile);
        } else if (imagePreview && slideToEdit?.imageUrl) {
          formData.append("existingImage", slideToEdit.imageUrl);
        } else {
          formData.append("removeImage", "true");
        }
      }

      // Add all other form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(
        slideToEdit ? `/api/hero-slides/${slideToEdit.id}` : "/api/hero-slides",
        {
          method: slideToEdit ? "PUT" : "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Falha ao salvar o slide");

      toast({
        title: slideToEdit ? "Slide Atualizado" : "Slide Criado",
        description: "O slide foi salvo com sucesso.",
      });

      router.push("/admin/hero-slides");
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o slide.",
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
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input id="subtitle" {...register("subtitle")} />
            </div>
          </div>

          <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as "image" | "video")}>
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="image">Imagem</TabsTrigger>
            </TabsList>
          {/* <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as "image" | "video")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image">Imagem</TabsTrigger>
              <TabsTrigger value="video">Vídeo</TabsTrigger>
            </TabsList> */}
            <TabsContent value="image" className="space-y-4">
              <Label>Imagem do Slide</Label>
              <AnimatePresence mode="wait">
                {imagePreview ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full h-[300px] border rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <motion.button
                      type="button"
                      onClick={removeImage}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">
                          Carregar Imagem
                        </span>
                      </div>
                    </Label>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="video" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL do Vídeo (YouTube ou Vimeo)</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://..."
                  {...register("videoUrl")}
                />
                {errors.videoUrl && (
                  <p className="text-sm text-red-500">{errors.videoUrl.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL do Link</Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://..."
                {...register("linkUrl")}
              />
              {errors.linkUrl && (
                <p className="text-sm text-red-500">{errors.linkUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkText">Texto do Link</Label>
              <Input id="linkText" {...register("linkText")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                min="0"
                {...register("order", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={watch("isActive")}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <Label>{watch("isActive") ? "Ativo" : "Inativo"}</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/hero-slides")}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {slideToEdit ? "Atualizar Slide" : "Criar Slide"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}