import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const packages = await prisma.travelPackage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const packageData = await prisma.travelPackage.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
    return NextResponse.json(packageData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}