import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const packages = await prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        packageType: {
          slug: 'pousadas'
        }
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