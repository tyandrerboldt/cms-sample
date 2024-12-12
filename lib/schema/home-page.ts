import { PackageType, TravelPackage, SiteSettings } from "@prisma/client";
import { WebPage, WithContext } from "schema-dts";

export function generateHomePageSchema(
  settings: SiteSettings,
  featuredPackages: (TravelPackage & { packageType: PackageType })[]
): WithContext<WebPage> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: settings.name,
    description: settings.description,
    url: baseUrl,
    primaryImageOfPage: settings.logo ? `${baseUrl}${settings.logo}` : undefined,
    mainEntity: {
      "@type": "TravelAgency",
      name: settings.name,
      description: settings.description,
      url: baseUrl,
      makesOffer: featuredPackages.map(pkg => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: pkg.title,
          description: pkg.description,
          identifier: pkg.code,
          url: `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
          touristType: ["Fishing enthusiasts"],
          additionalType: "FishingTrip"
        }
      }))
    },
    specialty: "Pesca Esportiva",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/pacotes?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  } as any;
}