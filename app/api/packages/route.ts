import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage } from "@/lib/image-upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    
    for (const file of imageFiles) {
      const url = await saveImage(file);
      imageUrls.push(url);
    }

    // Get existing images
    const existingImages = formData.getAll('existingImages') as string[];

    // Combine all images with their isMain status
    const allImages = [
      ...imageUrls.map((url, index) => ({
        url,
        isMain: formData.get(`imageIsMain${index}`) === 'true'
      })),
      ...existingImages.map(url => ({
        url,
        isMain: formData.get(`existingImageIsMain${url}`) === 'true'
      }))
    ];

    // Create package with images and package type
    const packageData = await prisma.travelPackage.create({
      data: {
        title: formData.get('title') as string,
        // code: formData.get('code') as string,
        // slug: formData.get('title')?.toString().toLocaleLowerCase() as string,
        description: formData.get('description') as string,
        location: formData.get('location') as string,
        price: parseFloat(formData.get('price') as string),
        startDate: new Date(formData.get('startDate') as string),
        endDate: new Date(formData.get('endDate') as string),
        maxGuests: parseInt(formData.get('maxGuests') as string),
        typeId: formData.get('typeId') as string,
        imageUrl: allImages.find(img => img.isMain)?.url || allImages[0]?.url || '',
        images: {
          create: allImages.map(img => ({
            url: img.url,
            isMain: img.isMain
          }))
        }
      },
      include: {
        images: true,
        packageType: true
      }
    });

    return NextResponse.json(packageData);
  } catch (error) {
    console.error('Failed to create package:', error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}