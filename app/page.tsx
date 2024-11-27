"use client";

import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { LodgingPackages } from "@/components/home/lodging-packages";
import { PageTransition } from "@/components/page-transition";

export default function Home() {
  return (
    <>
      <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
      <main className="min-h-screen pt-28 bg-background">
        <PageTransition>
          <HeroCarousel />
          <FeaturedPackages />
          <LodgingPackages />
        </PageTransition>
      </main>
    </>
  );
}
