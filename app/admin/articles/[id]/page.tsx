import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/article-form";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EditArticle({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  // If user is not admin, only show their own article
  const where: any = user?.role === "ADMIN" ? {} : { userId: user?.id };
  where.id = params.id;

  const article = await prisma.article.findUnique({
    where,
    include: { category: true },
  });

  if (!article) {
    notFound();
  }

  const categories = await prisma.articleCategory.findMany();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Artigo</h1>
      <ArticleForm articleToEdit={article} categories={categories} />
    </div>
  );
}
