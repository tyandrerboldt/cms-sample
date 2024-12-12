import { SiteSettings } from "@prisma/client";
import { WebPage, WithContext } from "schema-dts";

export function generateWebPageSchema(
  settings: SiteSettings,
  path: string,
  title: string,
  description: string,
  mainEntity?: any
): WithContext<WebPage> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${path}#webpage`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: settings.name,
      description: settings.description,
      url: baseUrl,
      publisher: {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`
      }
    },
    url: `${baseUrl}${path}`,
    name: title,
    description: description,
    ...(mainEntity && { mainEntity }),
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/pacotes?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}