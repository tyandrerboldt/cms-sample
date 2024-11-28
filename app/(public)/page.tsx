"use client";

import { HeroCarousel } from "@/components/hero-carousel";
import { AboutSection } from "@/components/home/about-section";
import { BoatPackages } from "@/components/home/boat-packages";
import { CTASection } from "@/components/home/cta-section";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { LodgingPackages } from "@/components/home/lodging-packages";
import { PageTransition } from "@/components/page-transition";

export default function Home() {
  return (
    <PageTransition>
      <HeroCarousel />
      <FeaturedPackages />
      <AboutSection />
      <LodgingPackages />
      <BoatPackages />
      <CTASection />
    </PageTransition>
  );
}
