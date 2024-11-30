import { PageTransition } from "@/components/page-transition";
import { HeroCarousel } from "@/components/hero-carousel";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { LodgingPackages } from "@/components/home/lodging-packages";
import { AboutSection } from "@/components/home/about-section";
import { CTASection } from "@/components/home/cta-section";
import { Metadata } from "next";
import { getBaseMetadata } from "@/lib/metadata";
import { BoatPackages } from "@/components/home/boat-packages";

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();
  
  return {
    title: "Pesca & Mordomia - Agência especializada em pesca esportiva",
    description: "Experiência em pacotes de pesca com toda a infraestrutura necessária para garantir segurança, conforto e excelentes pescarias",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Pesca & Mordomia - Agência especializada em pesca esportiva",
      description: "Experiência em pacotes de pesca com toda a infraestrutura necessária para garantir segurança, conforto e excelentes pescarias",
    },
  };
}

export default function Home() {
  return (
    <PageTransition>
      <HeroCarousel />
      <AboutSection />
      <FeaturedPackages />
      <BoatPackages />
      <CTASection />
      <LodgingPackages />
    </PageTransition>
  );
}