import { TravelPackage, PackageType, SiteSettings } from "@prisma/client";
import { Organization, TouristTrip, WithContext } from "schema-dts";

export function generateOrganizationSchema(settings: SiteSettings): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    description: settings.description,
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: settings.logo ? `${process.env.NEXT_PUBLIC_APP_URL}${settings.logo}` : undefined,
    sameAs: [
      settings.facebookUrl,
      settings.instagramUrl,
      settings.twitterUrl,
      settings.linkedinUrl,
      settings.youtubeUrl,
    ].filter(Boolean) as any,
    contactPoint: settings.whatsappNumber ? {
      "@type": "ContactPoint",
      telephone: settings.whatsappNumber,
      contactType: "customer service"
    } : undefined
  };
}

export function generateTouristTripSchema(
  pkg: TravelPackage & { packageType: PackageType },
  settings: SiteSettings
): WithContext<TouristTrip> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.description,
    identifier: pkg.code,
    tourOperator: {
      "@type": "Organization",
      name: settings.name,
      url: baseUrl
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
    provider: {
      "@type": "Organization",
      name: settings.name,
      description: settings.description,
      url: baseUrl
    },
    additionalType: "FishingTrip",
    url: `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
    offers: {
      "@type": "Offer",
      availability: (pkg.status === "ACTIVE" ? "http://schema.org/InStock" : "http://schema.org/OutOfStock"),
      validFrom: new Date(pkg.createdAt).toISOString(),
    }
  } as any;
}