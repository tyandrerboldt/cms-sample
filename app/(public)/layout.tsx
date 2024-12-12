import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PublicBreadcrumbs } from "@/components/public/breadcrumbs";
import { SiteSettingsProvider } from "@/contexts/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <JsonLdSchema /> */}
      <SiteSettingsProvider>
        <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
        <main className="min-h-screen mt-24">
          <PublicBreadcrumbs />
          {children}
        </main>
        <Footer />
      </SiteSettingsProvider>
    </>
  );
}
