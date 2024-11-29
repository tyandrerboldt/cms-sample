import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "5");
    const code = searchParams.get("code");
    const typeId = searchParams.get("typeId");
    const search = searchParams.get("search");

    // Build where clause based on filters
    const where: any = {
      status: "ACTIVE",
    };

    if (code) {
      where.code = { contains: code, mode: "insensitive" };
    }

    if (typeId) {
      where.typeId = typeId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get packages with pagination
    const [packages, packageTypes] = await Promise.all([
      prisma.travelPackage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          packageType: true,
        },
      }),
      prisma.packageType.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      packages,
      packageTypes,
      page,
      perPage,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}