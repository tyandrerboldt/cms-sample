import { TravelPackage } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Building2, Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const TypeIcon = pkg.packageType.slug === "barcos" ? Anchor : Building2;

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
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-lg font-semibold">{pkg.title}</h3>
              <Badge variant="outline" className="shrink-0">
                Código: {pkg.code}
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{pkg.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <TypeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{pkg.packageType.name}</span>
              </div>
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