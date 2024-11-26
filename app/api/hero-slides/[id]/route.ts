import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage, deleteImage } from "@/lib/image-upload";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    
    // Get current slide to check for image changes
    const currentSlide = await prisma.heroSlide.findUnique({
      where: { id: params.id }
    });

    if (!currentSlide) {
      return NextResponse.json(
        { error: "Slide not found" },
        { status: 404 }
      );
    }

    let imageUrl = formData.get('existingImage') as string;
    const shouldRemoveImage = formData.get('removeImage') === 'true';

    // Handle image removal
    if (shouldRemoveImage && currentSlide.imageUrl) {
      await deleteImage(currentSlide.imageUrl);
      imageUrl = null;
    }
    // Handle image upload
    else {
      const imageFile = formData.get('image') as File;
      if (imageFile) {
        // Delete old image if it exists
        if (currentSlide.imageUrl) {
          await deleteImage(currentSlide.imageUrl);
        }
        imageUrl = await saveImage(imageFile, 'slides');
      }
    }

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        imageUrl,
        videoUrl: formData.get('videoUrl') as string,
        linkUrl: formData.get('linkUrl') as string,
        linkText: formData.get('linkText') as string,
        isActive: formData.get('isActive') === 'true',
        order: parseInt(formData.get('order') as string) || 0,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Failed to update slide:', error);
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id }
    });

    if (slide?.imageUrl) {
      await deleteImage(slide.imageUrl);
    }

    await prisma.heroSlide.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete slide:', error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}