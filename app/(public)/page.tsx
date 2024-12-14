import { HeroCarousel } from "@/components/hero-carousel";
import { AboutSection } from "@/components/home/about-section";
import { BoatPackages } from "@/components/home/boat-packages";
import { CTASection } from "@/components/home/cta-section";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { LodgingPackages } from "@/components/home/lodging-packages";
import { getBaseMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { generateHomePageSchema } from "@/lib/schema";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();

  return {
    title: "Pesca & Mordomia - Agência especializada em pesca esportiva",
    description:
      "Experiência em pacotes de pesca com toda a infraestrutura necessária para garantir segurança, conforto e excelentes pescarias",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Pesca & Mordomia - Agência especializada em pesca esportiva",
      description:
        "Experiência em pacotes de pesca com toda a infraestrutura necessária para garantir segurança, conforto e excelentes pescarias",
    },
  };
}

export default async function Home() {
  const [settings, featuredPackages, slides, boatPackages, lodgingPackages] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        highlight: { in: ["MAIN", "FEATURED"] },
      },
      orderBy: [
        { highlight: 'desc' },
      ],
      include: { packageType: true },
      take: 5,
    }),
    prisma.heroSlide.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    }),
    prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        packageType: {
          slug: 'barcos-hoteis'
        }
      },
      take: 3,
      orderBy: [
        { contactCount: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        packageType: true,
        images: true,
      },
    }),
    prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        packageType: {
          slug: 'pousadas'
        }
      },
      take: 3,
      orderBy: [
        { contactCount: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        packageType: true,
        images: true,
      },
    })
  ]);

  const jsonLd = settings
    ? generateHomePageSchema(settings, featuredPackages)
    : null;

  return (
    <>
      {jsonLd && (
        <Script
          id="homepage-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <HeroCarousel slides={slides} />
      <FeaturedPackages packages={featuredPackages} />
      <AboutSection settings={settings} />
      <BoatPackages packages={boatPackages} />
      <CTASection settings={settings} />
      <LodgingPackages packages={lodgingPackages} />
    </>
  );
}