"use client";

import { HeroSlideList } from "@/components/admin/hero-slide-list";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroSlide } from "@prisma/client";

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides');
        if (!response.ok) throw new Error('Failed to fetch slides');
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Slides de Destaque</h1>
          <Link href="/admin/hero-slides/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Slide
            </Button>
          </Link>
        </div>
        <HeroSlideList slides={slides} />
      </div>
    </PageTransition>
  );
}