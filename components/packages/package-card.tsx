import { TravelPackage } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Building2, Calendar, MapPin, Star, Users } from "lucide-react";
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
  isMain?: boolean;
  className?: string;
}

export function PackageCard({
  package: pkg,
  className,
  isMain,
}: PackageCardProps) {
  const TypeIcon =
    pkg.packageType.slug === "barcos-hoteis" ? Anchor : Building2;

  return (
    <Card
      className={cn(
        "relative overflow-hidden flex flex-col lg:max-h-[480px]",
        isMain && "border-yellow-500 border-2",
        className
      )}
    >
      <div className="relative aspect-[16/9] flex-none">
        <Image
          src={pkg.imageUrl}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>
      <CardHeader className="flex-none space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm md:text-lg font-semibold line-clamp-1 flex-1">
            {pkg.title}
          </h3>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{pkg.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <TypeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{pkg.packageType.name}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-1">
          {pkg.description}
        </p>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>
              {pkg.numberOfDays} dia{pkg.numberOfDays > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>
              Max {pkg.maxGuests} hóspede{pkg.maxGuests > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-none">
        <Link
          href={`/pacotes/${pkg.packageType.slug}/${pkg.slug}`}
          className="w-full"
        >
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </CardFooter>

      <div className="absolute top-0 left-0 p-2 flex justify-between w-full">
        <Badge variant="default">
          Código: {pkg.code}
        </Badge>
        {isMain && <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
      </div>
    </Card>
  );
}
