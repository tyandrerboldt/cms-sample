"use client";

import { PackageImage } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageGalleryProps {
  mainImage: string;
  images: PackageImage[];
  title: string;
  className?: string;
}

export function PackageGallery({ mainImage, images, title, className }: PackageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [mainImage, ...images.map(img => img.url)];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        <Image
          src={allImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
        
        {allImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          <button
            className={cn(
              "relative aspect-square rounded-md overflow-hidden ring-2 ring-offset-2",
              currentImageIndex === 0 ? "ring-primary" : "ring-transparent"
            )}
            onClick={() => setCurrentImageIndex(0)}
          >
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
            />
          </button>
          {images.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden ring-2 ring-offset-2",
                currentImageIndex === index + 1 ? "ring-primary" : "ring-transparent"
              )}
              onClick={() => setCurrentImageIndex(index + 1)}
            >
              <Image
                src={image.url}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}