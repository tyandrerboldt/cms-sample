import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PublicBreadcrumbs } from "@/components/public/breadcrumbs";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import { Suspense } from "react";
import { generateOrganizationSchema } from "@/lib/schema";
import Script from "next/script";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findFirst();
  const organizationSchema = settings ? generateOrganizationSchema(settings) : null;

  return (
    <>
      {organizationSchema && (
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      )}
      
      <SiteSettingsProvider>
        <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
        <main className="min-h-screen mt-24">
          <PublicBreadcrumbs />
          <Suspense fallback={<div></div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </SiteSettingsProvider>
    </>
  );
}