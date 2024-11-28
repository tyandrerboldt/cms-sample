import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // First, get the main package if it exists
    const mainPackage = await prisma.travelPackage.findFirst({
      where: {
        status: "ACTIVE",
        highlight: "MAIN"
      },
      include: {
        packageType: true,
        images: true,
      },
    });

    // Then get featured packages, excluding the main one if it exists
    const featuredPackages = await prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        highlight: "FEATURED",
        ...(mainPackage ? { id: { not: mainPackage.id } } : {})
      },
      take: mainPackage ? limit - 1 : limit,
      orderBy: [
        { contactCount: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        packageType: true,
        images: true,
      },
    });

    // Combine main package with featured packages
    const packages = mainPackage 
      ? [mainPackage, ...featuredPackages]
      : featuredPackages;

    // Revalidate the home page
    revalidatePath('/');

    return NextResponse.json(packages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch featured packages" },
      { status: 500 }
    );
  }
}