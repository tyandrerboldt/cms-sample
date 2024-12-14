import { PackageContactSection } from "@/components/packages/package-contact-section";
import { PackageGallery } from "@/components/packages/package-gallery";
import { ShareButton } from "@/components/share-button";
import { generateTouristTripSchema } from "@/lib/schema";
import { PackageImage, PackageType, TravelPackage } from "@prisma/client";
import { Anchor, Building2, Calendar, MapPin, Users } from "lucide-react";
import Script from "next/script";
import ContactButtons from "../public/contact-buttons";

interface PackageWithDetails extends TravelPackage {
  packageType: PackageType;
  images: PackageImage[];
}

interface PackageDetailsProps {
  pkg: PackageWithDetails;
  settings: any;
}

export default function PackageDetails({ pkg, settings }: PackageDetailsProps) {
  const jsonLd = generateTouristTripSchema(pkg, settings);

  return (
    <>
      <Script
        id="package-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto py-4 md:py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PackageGallery
            mainImage={pkg.imageUrl}
            images={pkg.images}
            title={pkg.title}
          />

          <article className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold">{pkg.title}</h1>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Código: {pkg.code}
                  </span>
                </div>
                <ShareButton
                  url={`/pacotes/${pkg.packageType.slug}/${pkg.slug}`}
                  title={`${pkg.title} - ${pkg.code}`}
                />
              </div>
              <div className="flex items-center text-muted-foreground mb-2">
                {pkg?.packageType.slug === "barcos-hoteis" ? (
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
                <ContactButtons
                  pkg={pkg}
                  whatsappNumber={settings.whatsappNumber}
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: pkg.content }} />
            </div>
          </article>
        </div>

        <PackageContactSection package={pkg} />
      </div>
    </>
  );
}
