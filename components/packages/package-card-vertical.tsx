import { TravelPackage } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PackageCardVerticalProps {
  package: TravelPackage & {
    packageType: {
      id: string;
      name: string;
      slug: string;
    };
  };
  className?: string;
}

export function PackageCardVertical({ package: pkg, className }: PackageCardVerticalProps) {
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="relative w-full lg:w-[40%] aspect-[4/3] lg:aspect-auto">
          <Image
            src={pkg.imageUrl}
            alt={pkg.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{pkg.title}</h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{pkg.location}</span>
            </div>
            <p className="text-muted-foreground line-clamp-2 mb-4">{pkg.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{pkg.numberOfDays} dias</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Max {pkg.maxGuests} hóspedes</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link href={`/pacotes/${pkg.packageType.slug}/${pkg.slug}`} className="w-full">
              <Button className="w-full">Ver Detalhes</Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}