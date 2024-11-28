import { TravelPackage } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{pkg.title}</h3>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{pkg.location}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-2">{pkg.description}</p>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{pkg.numberOfDays} dias</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Max {pkg.maxGuests} hóspedes</span>
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