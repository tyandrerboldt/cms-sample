"use client";

import { useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { PackageType, TravelPackage, PackageImage } from "@prisma/client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Anchor, Building2, Calendar, MapPin, Users } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/whatsapp";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteSettings } from "@/contexts/site-settings";
import { PackageGallery } from "@/components/packages/package-gallery";
import { PackageContactSection } from "@/components/packages/package-contact-section";

interface PackageWithDetails extends TravelPackage {
  packageType: PackageType;
  images: PackageImage[];
}

export default function PackageDetailsPage() {
  const params = useParams();
  const [pkg, setPkg] = useState<PackageWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(
          `/api/front/packages/${params.packageSlug}`
        );
        if (!response.ok) throw new Error("Failed to fetch package");
        const data = await response.json();
        setPkg(data);
      } catch (error) {
        console.error("Error fetching package:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.packageSlug]);

  const handleWhatsAppContact = () => {
    if (!pkg || !settings?.whatsappNumber) return;

    const message = encodeURIComponent(
      `Olá! Gostaria de mais informações sobre o pacote ${pkg.code} - ${pkg.title}`
    );
    const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 md:py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <PageTransition>
      <div className="container mx-auto py-4 md:py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <PackageGallery
            mainImage={pkg.imageUrl}
            images={pkg.images}
            title={pkg.title}
          />

          {/* Package Details */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">{pkg.title}</h1>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Código: {pkg.code}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                {pkg?.packageType.slug === "barcos" ? (
                  <Anchor className="h-5 w-5 mr-2" />
                ) : (
                  <Building2 className="h-5 w-5 mr-2" />
                )}
                <span>{pkg.packageType.name}</span>
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{pkg.location}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{pkg.numberOfDays} dias</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Máx. {pkg.maxGuests} hóspedes</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-lg">{pkg.description}</p>
              {settings?.whatsappNumber && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleWhatsAppContact}
                >
                  <WhatsappIcon className="h-5 w-5 mr-2" />
                  Entrar em Contato via WhatsApp
                </Button>
              )}
              <div dangerouslySetInnerHTML={{ __html: pkg.content }} />
            </div>
          </div>
        </div>
      </div>
      {/* Contact Section */}
      <PackageContactSection package={pkg} />
    </PageTransition>
  );
}
