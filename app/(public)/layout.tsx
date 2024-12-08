import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PublicBreadcrumbs } from "@/components/public/breadcrumbs";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteSettingsProvider>
        <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
        <main className="min-h-screen mt-24">
          <PublicBreadcrumbs />
          {/* TODO: add loading */}
          <Suspense fallback={<div></div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </SiteSettingsProvider>
    </>
  );
}
