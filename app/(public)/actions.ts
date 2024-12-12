"use server"

import { generateOrganizationSchema, generateTouristTripSchema, generateTravelAgencySchema, generateWebPageSchema } from "@/lib/schema";
import { prisma } from "@/lib/prisma";

export async function getPageSchemas(pathname: string) {
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