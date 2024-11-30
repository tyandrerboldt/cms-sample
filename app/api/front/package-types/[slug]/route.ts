import { prisma } from "@/lib/prisma";
import { equal } from "assert";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "8");
    const search = searchParams.get("search");

    // Get package type
    const packageType = await prisma.packageType.findFirst({
      where: { slug: params.slug },
    });

    if (!packageType) {
      return NextResponse.json(
        { error: "Package type not found" },
        { status: 404 }
      );
    }

    // Build where clause
    const where: any = {
      status: "ACTIVE",
      packageType: {
        slug: params.slug,
      },
    };

    if (search) {
      where.OR = [
        { code: { equals: search } },
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get packages with pagination
    const packages = await prisma.travelPackage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        packageType: true,
      },
    });

    return NextResponse.json({
      packageType,
      packages,
      page,
      perPage,
    });
  } catch (error) {
    console.error("Error fetching package type:", error);
    return NextResponse.json(
      { error: "Failed to fetch package type" },
      { status: 500 }
    );
  }
}