import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateArticleCategory } from "@/lib/revalidate-public-pages";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.articleCategory.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const data = await request.json();
    const category = await prisma.articleCategory.update({
      where: { id: params.id },
      data
    });

    await revalidateArticleCategory(existing.slug);
    if (category.slug !== existing.slug) {
      await revalidateArticleCategory(category.slug);
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.articleCategory.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    await prisma.articleCategory.delete({
      where: { id: params.id },
    });

    await revalidateArticleCategory(existing.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
