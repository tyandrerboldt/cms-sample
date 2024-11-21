import { prisma } from "@/lib/prisma";
import { PackageForm } from "@/components/admin/package-form";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EditPackage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  // If user is not admin, only show their own package
  const where: any = user?.role === "ADMIN" ? {} : { userId: user?.id };
  where.id = params.id;

  const [packageData, packageTypes] = await Promise.all([
    prisma.travelPackage.findUnique({
      where,
      include: { images: true }
    }),
    prisma.packageType.findMany()
  ]);

  if (!packageData) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Pacote</h1>
      <PackageForm packageToEdit={packageData} packageTypes={packageTypes} />
    </div>
  );
}