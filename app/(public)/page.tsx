import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/packages/package-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const featuredPackages = await prisma.travelPackage.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">
            Explore our handpicked selection of amazing travel destinations and create unforgettable memories.
          </p>
          <Link href="/packages">
            <Button size="lg" className="text-lg">
              Browse Packages
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Packages</h2>
            <Link href="/packages">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}