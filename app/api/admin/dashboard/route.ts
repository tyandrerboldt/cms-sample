export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [recentPackages, recentArticles, trendingPackages, packageStats] =
      await Promise.all([
        prisma.travelPackage.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            packageType: true,
          },
        }),
        prisma.article.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
          },
        }),
        prisma.travelPackage.findMany({
          take: 5,
          orderBy: { contactCount: "desc" },
          include: {
            packageType: true,
          },
        }),
        prisma.packageType.findMany({
          include: {
            _count: {
              select: { packages: true },
            },
          },
        }),
      ]);

    const totalPackages = await prisma.travelPackage.count();
    const totalArticles = await prisma.article.count();
    const totalContacts = await prisma.travelPackage.aggregate({
      _sum: {
        contactCount: true,
      },
    });

    const stats = {
      totalPackages,
      totalArticles,
      totalContacts: totalContacts._sum.contactCount || 0,
    };

    return NextResponse.json({
      recentPackages,
      recentArticles,
      trendingPackages,
      packageStats,
      stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}