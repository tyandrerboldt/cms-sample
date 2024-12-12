import { SiteSettings } from "@prisma/client";
import { Organization, WithContext } from "schema-dts";

export function generateOrganizationSchema(settings: SiteSettings): WithContext<Organization> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: settings.name,
    description: settings.description,
    url: baseUrl,
    logo: settings.logo ? `${baseUrl}${settings.logo}` : undefined,
    sameAs: [
      settings.facebookUrl,
      settings.instagramUrl,
      settings.twitterUrl,
      settings.linkedinUrl,
      settings.youtubeUrl,
    ].filter(Boolean),
    contactPoint: settings.whatsappNumber ? {
      "@type": "ContactPoint",
      telephone: settings.whatsappNumber,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: ["Portuguese"]
    } : undefined
  } as any;
}