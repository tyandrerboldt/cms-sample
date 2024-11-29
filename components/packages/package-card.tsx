import { TravelPackage } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Building2, Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PackageCardProps {
  package: TravelPackage & {
    packageType: {
      id: string;
      name: string;
      slug: string;
    };
  };
  className?: string;
}

export function PackageCard({ package: pkg, className }: PackageCardProps) {
  const TypeIcon = pkg.packageType.slug === "barcos" ? Anchor : Building2;

  return (
    <Card className={cn("overflow-hidden flex flex-col", className)}>
      <div className="relative aspect-[16/9]">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xl font-semibold flex-1">{pkg.title}</h3>
          <Badge variant="outline" className="shrink-0">
            Código: {pkg.code}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{pkg.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <TypeIcon className="h-4 w-4 mr-1" />
            <span>{pkg.packageType.name}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-2">{pkg.description}</p>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{pkg.numberOfDays} diária{pkg.numberOfDays > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Max. {pkg.maxGuests} hóspede{pkg.maxGuests > 1 ? "s" : ""}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/pacotes/${pkg.packageType.slug}/${pkg.slug}`} className="w-full">
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}