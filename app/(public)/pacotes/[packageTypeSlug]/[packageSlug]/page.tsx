import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/page-transition";

export default async function PackageDetails({
  params,
}: {
  params: { packageTypeSlug: string; packageSlug: string };
}) {
  const travelPackage = await prisma.travelPackage.findFirst({
    where: {
      slug: params.packageSlug,
      packageType: {
        slug: params.packageTypeSlug,
      },
    },
    include: {
      packageType: true,
    },
  });

  if (!travelPackage) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src={travelPackage.imageUrl}
              alt={travelPackage.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{travelPackage.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{travelPackage.location}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Max {travelPackage.maxGuests} guests</span>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="prose max-w-none">
              <p className="text-lg">{travelPackage.description}</p>
            </div>
            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Price per person</p>
                <p className="text-3xl font-bold">
                </p>
              </div>
              <Button size="lg">Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}