import { prisma } from "@/lib/prisma";
import { HeroSlideForm } from "@/components/admin/hero-slide-form";
import { notFound } from "next/navigation";

export default async function EditHeroSlide({
  params,
}: {
  params: { id: string };
}) {
  const slide = await prisma.heroSlide.findUnique({
    where: { id: params.id },
  });

  if (!slide) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Slide</h1>
      <HeroSlideForm slideToEdit={slide} />
    </div>
  );
}