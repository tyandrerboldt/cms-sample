import { prisma } from "@/lib/prisma";
import { PackageForm } from "@/components/admin/package-form";
import { notFound } from "next/navigation";

export default async function EditPackage({
  params,
}: {
  params: { id: string };
}) {
  const packageData = await prisma.travelPackage.findUnique({
    where: { id: params.id },
  });

  if (!packageData) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Package</h1>
      <PackageForm packageToEdit={packageData} />
    </div>
  );
}