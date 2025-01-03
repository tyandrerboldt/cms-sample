"use client";

import { HeroSlide } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentSlide(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[600px]">
      <section className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              {slide.imageUrl ? (
                <div className="relative h-full">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              ) : slide.videoUrl ? (
                <div className="relative h-full">
                  <iframe
                    src={slide.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                </div>
              ) : null}

              <AnimatePresence mode="wait">
                {currentSlide === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 flex items-center text-white"
                  >
                    <div className="text-center md:text-left max-w-full md:max-w-3xl mx-auto md:mx-48 px-4">
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-5xl font-bold mb-4"
                      >
                        {slide.title}
                      </motion.h2>
                      {slide.subtitle && (
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg md:text-xl mb-8"
                        >
                          {slide.subtitle}
                        </motion.p>
                      )}
                      {slide.linkUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Link href={slide.linkUrl}>
                            <Button size="lg" className="text-lg">
                              {slide.linkText || "Saiba mais"}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </section>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-800 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ArrowRight className="h-5 w-5 rotate-180" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-800 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
        onClick={() => emblaApi?.scrollNext()}
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}