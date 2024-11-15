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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

const settingsSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  description: z.string().min(1, "Site description is required"),
  logo: z.string().nullable().optional(),
  status: z.boolean(),
  smtpHost: z.string().nullable().optional(),
  smtpPort: z.string().transform(val => val ? parseInt(val) : null).nullable().optional(),
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
  const [isActive, setIsActive] = useState(settings?.status ?? true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo || null);

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
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    setValue("logo", "");
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const formData = new FormData();
      
      // Handle logo
      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (logoPreview && settings?.logo) {
        formData.append('existingLogo', settings.logo);
      }

      // Add all other form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch('/api/settings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save settings");

      toast({
        title: "Settings Updated",
        description: "The site settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Site Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={isActive}
                      onCheckedChange={(checked) => {
                        setIsActive(checked);
                        setValue("status", checked);
                      }}
                    />
                    <Label htmlFor="status">Site is {isActive ? 'active' : 'inactive'}</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Logo</Label>
                {logoPreview ? (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="logo"
                      className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                    >
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">Upload Logo</span>
                      </div>
                    </Label>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" {...register("smtpHost")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" {...register("smtpPort")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" {...register("smtpUser")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input id="smtpPass" type="password" {...register("smtpPass")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpFrom">From Email Address</Label>
                <Input id="smtpFrom" type="email" {...register("smtpFrom")} />
                {errors.smtpFrom && (
                  <p className="text-sm text-red-500">{errors.smtpFrom.message}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook URL</Label>
                  <Input id="facebookUrl" {...register("facebookUrl")} />
                  {errors.facebookUrl && (
                    <p className="text-sm text-red-500">{errors.facebookUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram URL</Label>
                  <Input id="instagramUrl" {...register("instagramUrl")} />
                  {errors.instagramUrl && (
                    <p className="text-sm text-red-500">{errors.instagramUrl.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter URL</Label>
                  <Input id="twitterUrl" {...register("twitterUrl")} />
                  {errors.twitterUrl && (
                    <p className="text-sm text-red-500">{errors.twitterUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input id="linkedinUrl" {...register("linkedinUrl")} />
                  {errors.linkedinUrl && (
                    <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input id="youtubeUrl" {...register("youtubeUrl")} />
                {errors.youtubeUrl && (
                  <p className="text-sm text-red-500">{errors.youtubeUrl.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}