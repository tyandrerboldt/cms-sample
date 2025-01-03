"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SiteSettings } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "./rich-text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const settingsSchema = z.object({
  name: z.string().min(1, "Nome do site é obrigatório"),
  description: z.string().min(1, "Descrição do site é obrigatória"),
  logo: z.string().nullable().optional(),
  status: z.boolean(),
  allowRegistration: z.boolean(),
  aboutText: z.string().nullable().optional(),
  ctaText: z.string().nullable().optional(),
  whatsappNumber: z.string().nullable().optional(),
  smtpHost: z.string().nullable().optional(),
  smtpPort: z.number().nullable().optional(),
  smtpUser: z.string().nullable().optional(),
  smtpPass: z.string().nullable().optional(),
  smtpFrom: z.string().email().nullable().optional(),
  facebookUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional(),
  youtubeUrl: z.string().url().nullable().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings?: SiteSettings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isActive, setIsActive] = useState(settings?.status ?? true);
  const [allowRegistration, setAllowRegistration] = useState(
    settings?.allowRegistration ?? true
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    settings?.logo || null
  );
  const [aboutText, setAboutText] = useState(settings?.aboutText || "");
  const [ctaText, setCtaText] = useState(settings?.ctaText || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...settings,
      status: isActive,
      allowRegistration: allowRegistration,
      aboutText: aboutText,
      ctaText: ctaText,
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (logoPreview && !settings?.logo) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoPreview && !settings?.logo) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setValue("logo", null);
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const formData = new FormData();

      if (logoFile) {
        formData.append("logo", logoFile);
      } else if (logoPreview && settings?.logo) {
        formData.append("existingLogo", settings.logo);
      } else {
        formData.append("removeLogo", "true");
      }

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "logo") {
          formData.append(key, value.toString());
        }
      });

      // Add rich text fields
      formData.append("aboutText", aboutText);
      formData.append("ctaText", ctaText);

      const response = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Falha ao salvar as configurações");

      toast({
        title: "Configurações Atualizadas",
        description: "As configurações do site foram salvas com sucesso.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full md:w-2/3">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* General Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Configurações Gerais</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Site</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status do Site</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => {
                      setIsActive(checked);
                      setValue("status", checked);
                    }}
                  />
                  <Label>{isActive ? "Ativo" : "Manutenção"}</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cadastro de Usuários</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={allowRegistration}
                  onCheckedChange={(checked) => {
                    setAllowRegistration(checked);
                    setValue("allowRegistration", checked);
                  }}
                />
                <Label>{allowRegistration ? "Permitido" : "Bloqueado"}</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Site</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Logo</Label>
              <AnimatePresence mode="wait">
                {logoPreview ? (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-32 h-32 border rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                    <motion.button
                      type="button"
                      onClick={removeLogo}
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
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="logo"
                      className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">
                          Carregar Logo
                        </span>
                      </div>
                    </Label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Separator />

          {/* Content Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Conteúdo</h2>

            <Tabs defaultValue="about" className="space-y-4">
              <TabsList>
                <TabsTrigger value="about">Quem Somos</TabsTrigger>
                <TabsTrigger value="cta">Texto CTA</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div className="min-h-[400px]">
                  <RichTextEditor
                    content={aboutText}
                    onChange={(content) => {
                      setAboutText(content);
                      setValue("aboutText", content);
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="cta" className="space-y-4">
                <div className="min-h-[400px]">
                  <RichTextEditor
                    content={ctaText}
                    onChange={(content) => {
                      setCtaText(content);
                      setValue("ctaText", content);
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Contact Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Contato</h2>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
              <Input
                id="whatsappNumber"
                placeholder="+5511999999999"
                {...register("whatsappNumber")}
              />
              <p className="text-sm text-muted-foreground">
                Digite o número completo com código do país e DDD
              </p>
            </div>
          </div>

          <Separator />

          {/* Email Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Configurações de Email</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" {...register("smtpHost")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  type="number"
                  id="smtpPort"
                  {...register("smtpPort", {
                    valueAsNumber: true, // Converte automaticamente para número
                    setValueAs: (value) =>
                      value === "" ? null : Number(value), // Trata valores vazios
                  })}
                  onChange={(event) => {
                    const value = event.target.value;
                    setValue("smtpPort", value === "" ? null : Number(value));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Usuário</Label>
                <Input id="smtpUser" {...register("smtpUser")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPass">SMTP Senha</Label>
                <Input
                  id="smtpPass"
                  type="password"
                  {...register("smtpPass")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpFrom">Endereço de Email do Remetente</Label>
              <Input id="smtpFrom" type="email" {...register("smtpFrom")} />
              {errors.smtpFrom && (
                <p className="text-sm text-red-500">
                  {errors.smtpFrom.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Social Media Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Mídias Sociais</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">URL do Facebook</Label>
                <Input id="facebookUrl" {...register("facebookUrl")} />
                {errors.facebookUrl && (
                  <p className="text-sm text-red-500">
                    {errors.facebookUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl">URL do Instagram</Label>
                <Input id="instagramUrl" {...register("instagramUrl")} />
                {errors.instagramUrl && (
                  <p className="text-sm text-red-500">
                    {errors.instagramUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">URL do Twitter</Label>
                <Input id="twitterUrl" {...register("twitterUrl")} />
                {errors.twitterUrl && (
                  <p className="text-sm text-red-500">
                    {errors.twitterUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">URL do LinkedIn</Label>
                <Input id="linkedinUrl" {...register("linkedinUrl")} />
                {errors.linkedinUrl && (
                  <p className="text-sm text-red-500">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">URL do YouTube</Label>
              <Input id="youtubeUrl" {...register("youtubeUrl")} />
              {errors.youtubeUrl && (
                <p className="text-sm text-red-500">
                  {errors.youtubeUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Salvar Configurações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
