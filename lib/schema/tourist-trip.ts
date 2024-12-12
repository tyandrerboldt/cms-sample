import { TravelPackage, PackageType, SiteSettings } from "@prisma/client";
import { TouristTrip, WithContext } from "schema-dts";

export function generateTouristTripSchema(
  pkg: TravelPackage & { packageType: PackageType },
  settings: SiteSettings
): WithContext<TouristTrip> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}#touristtrip`,
    name: pkg.title,
    description: pkg.description,
    identifier: pkg.code,
    provider: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`
    },
    touristType: ["Fishing enthusiasts", "Nature lovers", "Adventure travelers"],
    subjectOf: {
      "@type": "CreativeWork",
      abstract: pkg.description,
      text: pkg.content
    },
    image: [pkg.imageUrl],
    maximumAttendeeCapacity: pkg.maxGuests,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: pkg.numberOfDays,
      itemListElement: [{
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "TouristDestination",
          name: pkg.location,
          touristType: ["Fishing enthusiasts"]
        }
      }]
    },
    additionalType: "FishingTrip",
    url: `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
    offers: {
      "@type": "Offer",
      availability: pkg.status === "ACTIVE" ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
      validFrom: new Date(pkg.createdAt).toISOString(),
    }
  } as any;
}