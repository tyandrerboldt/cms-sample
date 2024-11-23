import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage, deleteImage } from "@/lib/image-upload";
import slugify from "slugify";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Obtém o pacote atual para acessar as imagens existentes
    const currentPackage = await prisma.travelPackage.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!currentPackage) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Processa novas imagens enviadas no formulário
    const imageFiles = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];
    for (const file of imageFiles) {
      const url = await saveImage(file);
      newImageUrls.push(url);
    }

    // Recupera as imagens existentes enviadas no formulário
    const existingImages = formData.getAll("existingImages") as string[];

    // Determina quais imagens precisam ser excluídas
    const imagesToDelete = currentPackage.images
      .filter((img) => !existingImages.includes(img.url))
      .map((img) => img.url);

    for (const imageUrl of imagesToDelete) {
      await deleteImage(imageUrl);
    }

    // Atualiza as imagens (novas e existentes)
    const allImages = [
      ...newImageUrls.map((url, index) => ({
        url,
        isMain: formData.get(`imageIsMain${index}`) === "true",
      })),
      ...existingImages.map((url) => ({
        url,
        isMain: formData.get(`existingImageIsMain${url}`) === "true",
      })),
    ];

    // Atualiza o pacote sem apagar imagens existentes do banco
    const title = formData.get("title") as string;
    const slug = slugify(title, { lower: true, strict: true });

    const updatedPackage = await prisma.travelPackage.update({
      where: { id },
      data: {
        title,
        slug,
        code: formData.get("code") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        location: formData.get("location") as string,
        maxGuests: parseInt(formData.get("maxGuests") as string),
        numberOfDays: parseInt(formData.get("numberOfDays") as string),
        status: formData.get("status") as any,
        typeId: formData.get("typeId") as string,
        imageUrl:
          allImages.find((img) => img.isMain)?.url || currentPackage.imageUrl,
        images: {
          deleteMany: {
            url: { in: imagesToDelete },
          },
          create: newImageUrls.map((url) => ({
            url,
            isMain: formData.get(`imageIsMain${url}`) === "true",
          })),
        },
      },
      include: {
        images: true,
        packageType: true,
      },
    });

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error("Failed to update package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the package to delete its images
    const packageToDelete = await prisma.travelPackage.findUnique({
      where: { id },
      include: { images: true }
    });

    if (packageToDelete) {
      // Delete all associated images
      for (const image of packageToDelete.images) {
        await deleteImage(image.url);
      }
    }

    // Delete the package (this will cascade delete the images from the database)
    await prisma.travelPackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}