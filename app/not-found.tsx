import { ContactModal } from "@/components/contact-modal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FeaturedPackages } from "@/components/home/featured-packages";
import { PublicBreadcrumbs } from "@/components/public/breadcrumbs";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function NotFoundPage() {
  const config = await prisma.siteSettings.findFirst();
  const featuredPackages = await prisma.travelPackage.findMany({
    where: {
      status: "ACTIVE",
      highlight: { in: ["FEATURED", "MAIN"] },
    },
    include: { packageType: true },
    take: 5,
  })

  return (
    <>
      <Header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm" />
      <main className="min-h-screen mt-24">
        <PublicBreadcrumbs />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <div className="container mx-auto px-4 py-16 text-center">
              <div className="space-y-8">
                {config?.logo && (
                  <div className="flex justify-center">
                    <Image
                      src={config.logo}
                      alt={config.name}
                      width={200}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold">Página não encontrada</h1>
                  <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                    Desculpe, não conseguimos encontrar a página que você está
                    procurando.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Link href="/">
                    <Button size="lg">
                      <Home className="mr-2 h-5 w-5" />
                      Voltar ao Início
                    </Button>
                  </Link>

                  <ContactModal
                    source="Página 404"
                    title="Precisa de Ajuda?"
                    description="Envie sua mensagem e entraremos em contato assim que possível."
                    trigger={
                      <Button variant="outline" size="lg">
                        Fale Conosco
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold">
                  Conheça alguns de nossos pacotes
                </h2>
                <p className="text-muted-foreground">
                  Talvez você se interesse por algumas dessas opções
                </p>
              </div>
              <FeaturedPackages packages={featuredPackages} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
