import { TravelPackage } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Building2, Calendar, MapPin, Star, Users } from "lucide-react";
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
  isMain?: boolean;
  className?: string;
}

export function PackageCardVertical({ package: pkg, className, isMain }: PackageCardVerticalProps) {
  const TypeIcon = pkg.packageType.slug === "barcos-hoteis" ? Anchor : Building2;

  return (
    <Card className={cn("overflow-hidden h-[220px] relative", className)}>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="relative aspect-[16/9] lg:w-[300px] flex-none">
          <Image
            src={pkg.imageUrl}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
            priority
          />
        </div>
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-sm font-semibold line-clamp-1">{pkg.title}</h3>
            </div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{pkg.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <TypeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate max-w-[100px]">{pkg.packageType.name}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{pkg.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{pkg.numberOfDays} dia{pkg.numberOfDays > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Max {pkg.maxGuests} hóspede{pkg.maxGuests > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Link href={`/pacotes/${pkg.packageType.slug}/${pkg.slug}`} className="w-full">
              <Button className="w-full">Ver Detalhes</Button>
            </Link>
          </div>
        </CardContent>
      </div>
      <div className="absolute top-0 left-0 p-2 flex justify-between w-full">
        <Badge variant="default">
          Código: {pkg.code}
        </Badge>
        {isMain && <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
      </div>
    </Card>
  );
}