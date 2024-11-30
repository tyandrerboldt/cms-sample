import { PageTransition } from "@/components/page-transition";
import { AboutContent } from "@/components/about/about-content";
import { Metadata } from "next";
import { getBaseMetadata } from "@/lib/metadata";

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

export default function AboutPage() {
  return (
    <PageTransition>
      <AboutContent />
    </PageTransition>
  );
}