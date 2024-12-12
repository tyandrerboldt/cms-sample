import { SiteSettings } from "@prisma/client";
import { AboutPage, WithContext } from "schema-dts";

export function generateAboutPageSchema(settings: SiteSettings): WithContext<AboutPage> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre a Pesca & Mordomia",
    description: settings.description,
    url: `${baseUrl}/quem-somos`,
    mainEntity: {
      "@type": "Organization",
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
    }
  } as any;
}