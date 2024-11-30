import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function getBaseMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findFirst();

  return {
    title: {
      default: settings?.name || "Travel Portal",
      template: `%s | ${settings?.name || "Travel Portal"}`,
    },
    description: settings?.description || "Discover amazing travel destinations",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: process.env.NEXT_PUBLIC_APP_URL,
      siteName: settings?.name || "Travel Portal",
      images: settings?.logo ? [{ url: settings.logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  };
}

export async function getPackageTypeMetadata(slug: string): Promise<Metadata> {
  const packageType = await prisma.packageType.findFirst({
    where: { slug },
  });

  if (!packageType) {
    return {};
  }

  return {
    title: packageType.name,
    description: packageType.description || `Conheça nossos pacotes de ${packageType.name.toLowerCase()}`,
    openGraph: {
      title: packageType.name,
      description: packageType.description || `Conheça nossos pacotes de ${packageType.name.toLowerCase()}`,
    },
  };
}

export async function getPackageMetadata(packageSlug: string): Promise<Metadata> {
  const pkg = await prisma.travelPackage.findFirst({
    where: { slug: packageSlug },
    include: { packageType: true },
  });

  if (!pkg) {
    return {};
  }

  return {
    title: `${pkg.title} - ${pkg.code}`,
    description: pkg.description,
    openGraph: {
      title: `${pkg.title} - ${pkg.code}`,
      description: pkg.description,
      images: pkg.imageUrl ? [{ url: pkg.imageUrl }] : undefined,
    },
  };
}