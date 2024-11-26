import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage } from "@/lib/image-upload";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    let imageUrl = null;
    const imageFile = formData.get('image') as File;
    
    if (imageFile) {
      imageUrl = await saveImage(imageFile, 'slides');
    }

    const slide = await prisma.heroSlide.create({
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

    revalidatePath('/');

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Failed to create slide:', error);
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}