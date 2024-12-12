import { PackageType, TravelPackage } from "@prisma/client";
import { ItemList, WithContext } from "schema-dts";

export function generatePackageListSchema(
  packages: (TravelPackage & { packageType: PackageType })[],
  packageType?: PackageType
): WithContext<ItemList> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: packageType ? `Pacotes de ${packageType.name}` : "Pacotes de Pesca",
    description: packageType?.description || "Explore nossa seleção de pacotes de pesca",
    numberOfItems: packages.length,
    itemListElement: packages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristTrip",
        name: pkg.title,
        description: pkg.description,
        identifier: pkg.code,
        url: `${baseUrl}/pacotes/${pkg.packageType.slug}/${pkg.slug}`,
        image: pkg.imageUrl,
        touristType: ["Fishing enthusiasts"],
        maximumAttendeeCapacity: pkg.maxGuests,
        additionalType: "FishingTrip"
      }
    }))
  };
}