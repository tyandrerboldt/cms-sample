import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PublicBreadcrumbs } from "@/components/public/breadcrumbs";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import { Suspense } from "react";
import {
  generateOrganizationSchema,
  generateTravelAgencySchema,
  generateWebPageSchema,
  generateTouristTripSchema,
} from "@/lib/schema";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

async function getPageSchemas(pathname: string) {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) return null;

  // Base schemas that should be present on all pages
  const schemas: any[] = [generateOrganizationSchema(settings)];

  // Add TravelAgency schema only on homepage
  if (pathname === "/") {
    console.log("HOME");

    const featuredPackages = await prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        highlight: { in: ["FEATURED", "MAIN"] },
      },
      include: { packageType: true },
      take: 5,
    });
    schemas.push(generateTravelAgencySchema(settings, featuredPackages));
  }
  // Handle individual package pages
  else if (pathname.match(/^\/pacotes\/[^/]+\/[^/]+$/)) {
    console.log("INDIVIDUAL PACKAGE");
    const [_, __, typeSlug, packageSlug] = pathname.split("/");
    const pkg = await prisma.travelPackage.findFirst({
      where: {
        slug: packageSlug,
        packageType: {
          slug: typeSlug,
        },
      },
      include: {
        packageType: true,
        images: true,
      },
    });

    if (pkg) {
      schemas.push(generateTouristTripSchema(pkg, settings));
    }
  }
  // Handle package type pages
  else if (pathname.match(/^\/pacotes\/[^/]+$/)) {
    console.log("PACKAGE TYPE");
    const [_, __, typeSlug] = pathname.split("/");
    const [packageType, packages] = await Promise.all([
      prisma.packageType.findFirst({
        where: { slug: typeSlug },
      }),
      prisma.travelPackage.findMany({
        where: {
          status: "ACTIVE",
          packageType: {
            slug: typeSlug,
          },
        },
        include: {
          packageType: true,
        },
        take: 10,
      }),
    ]);

    if (packageType) {
      schemas.push(
        generateWebPageSchema(
          settings,
          pathname,
          `Pacotes de ${packageType.name}`,
          packageType.description,
          {
            "@type": "ItemList",
            numberOfItems: packages.length,
            itemListElement: packages.map((pkg, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "TouristTrip",
                name: pkg.title,
                description: pkg.description,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
              },
            })),
          }
        )
      );
    }
  }
  // Add WebPage schema for other pages
  else if (pathname !== "/") {
    console.log("OTHER PAGE");
    let title = settings.name;
    let description = settings.description;
    
    // Customize title and description based on path
    if (pathname === "/pacotes") {
      console.log("PACOTES");
      title = "Pacotes de Viagem";
      description =
      "Explore nossa seleção de pacotes de viagem e encontre o destino perfeito para sua próxima aventura";
    } else if (pathname === "/quem-somos") {
      console.log("QUEM SOMOES");
      title = "Quem Somos";
      description = "Conheça nossa história, missão e valores";
    }

    schemas.push(generateWebPageSchema(settings, pathname, title, description));
  }

  return schemas;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/";
  const schemas = await getPageSchemas(pathname);

  return (
    <>
      {schemas?.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <SiteSettingsProvider>
        <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
        <main className="min-h-screen mt-24">
          <PublicBreadcrumbs />
          <Suspense fallback={<div></div>}>{children}</Suspense>
        </main>
        <Footer />
      </SiteSettingsProvider>
    </>
  );
}
