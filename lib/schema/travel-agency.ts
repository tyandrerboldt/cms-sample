import { PackageType, TravelPackage, SiteSettings } from "@prisma/client";
import { TravelAgency, WithContext } from "schema-dts";

export function generateTravelAgencySchema(
  settings: SiteSettings,
  featuredPackages: (TravelPackage & { packageType: PackageType })[]
): WithContext<TravelAgency> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${baseUrl}/#travel-agency`,
    name: settings.name,
    description: settings.description,
    url: baseUrl,
    logo: settings.logo ? `${baseUrl}${settings.logo}` : undefined,
    makesOffer: featuredPackages.map(pkg => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "TouristTrip",
        "@id": `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}#touristtrip`,
        name: pkg.title,
        description: pkg.description,
        identifier: pkg.code,
        url: `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
        touristType: ["Fishing enthusiasts"],
        additionalType: "FishingTrip"
      }
    })),
    sameAs: [
      settings.facebookUrl,
      settings.instagramUrl,
      settings.twitterUrl,
      settings.linkedinUrl,
      settings.youtubeUrl,
    ].filter(Boolean)
  } as any;
}