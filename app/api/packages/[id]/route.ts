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

    // Get current package to check for image changes
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

    // Check if there's already a main package when this one is set as main
    const highlight = formData.get('highlight') as 'NORMAL' | 'FEATURED' | 'MAIN';
    if (highlight === 'MAIN' && currentPackage.highlight !== 'MAIN') {
      const existingMain = await prisma.travelPackage.findFirst({
        where: { 
          highlight: 'MAIN',
          id: { not: id }
        }
      });

      if (existingMain) {
        await prisma.travelPackage.update({
          where: { id: existingMain.id },
          data: { highlight: 'FEATURED' }
        });
      }
    }

    // Process new images
    const imageFiles = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];
    for (const file of imageFiles) {
      const url = await saveImage(file);
      newImageUrls.push(url);
    }

    // Get existing images from form
    const existingImages = formData.getAll("existingImages") as string[];

    // Determine which images to delete
    const imagesToDelete = currentPackage.images
      .filter((img) => !existingImages.includes(img.url))
      .map((img) => img.url);

    for (const imageUrl of imagesToDelete) {
      await deleteImage(imageUrl);
    }

    // Update the package
    const title = formData.get("title") as string;
    const slug = slugify(title, { lower: true, strict: true });

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
        highlight: highlight,
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