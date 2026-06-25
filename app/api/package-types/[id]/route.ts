import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePackageType } from "@/lib/revalidate-public-pages";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.packageType.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Package type not found" },
        { status: 404 }
      );
    }

    const data = await request.json();
    const packageType = await prisma.packageType.update({
      where: { id: params.id },
      data
    });

    await revalidatePackageType(existing.slug);
    if (packageType.slug !== existing.slug) {
      await revalidatePackageType(packageType.slug);
    }

    return NextResponse.json(packageType);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update package type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.packageType.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Package type not found" },
        { status: 404 }
      );
    }

    await prisma.packageType.delete({
      where: { id: params.id },
    });

    await revalidatePackageType(existing.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete package type" },
      { status: 500 }
    );
  }
}
