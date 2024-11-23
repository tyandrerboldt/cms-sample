import { prisma } from "@/lib/prisma";
import { UserList } from "@/components/admin/user-list";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { authOptions } from "@/lib/auth";

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" }
  });

  if (!session?.user || user?.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageTransition>
      <div>
        <h1 className="text-3xl font-bold mb-6">Usuários</h1>
        <UserList users={users} />
      </div>
    </PageTransition>
  );
}