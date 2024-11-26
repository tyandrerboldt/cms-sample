import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "10");

    const packages = await prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
      },
      take: limit,
      orderBy: [
        { contactCount: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        packageType: true,
        images: true,
      },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}