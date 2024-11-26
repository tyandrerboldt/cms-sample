import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const packages = await prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
      },
      take: 3,
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