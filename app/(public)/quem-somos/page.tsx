import { PageTransition } from "@/components/page-transition";
import { AboutContent } from "@/components/about/about-content";
import { Metadata } from "next";
import { getBaseMetadata } from "@/lib/metadata";
import { generateAboutPageSchema } from "@/lib/schema/about-page";
import { prisma } from "@/lib/prisma";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = await getBaseMetadata();
  
  return {
    title: "Quem Somos",
    description: "Conheça nossa história, missão e valores",
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Quem Somos",
      description: "Conheça nossa história, missão e valores",
    },
  };
}

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst();
  const jsonLd = settings ? generateAboutPageSchema(settings) : null;

  return (
    <PageTransition>
      {jsonLd && (
        <Script
          id="about-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AboutContent />
    </PageTransition>
  );
}