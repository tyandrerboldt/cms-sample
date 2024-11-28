import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage } from "@/lib/image-upload";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");

    const packages = await prisma.travelPackage.findMany({
      where: {
        status: "ACTIVE",
        ...(featured ? { 
          OR: [
            { highlight: "FEATURED" },
            { highlight: "MAIN" }
          ]
        } : {}),
      },
      take: limit,
      orderBy: [
        { highlight: 'desc' },
        { createdAt: "desc" }
      ],
      include: {
        packageType: true,
      },
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
    const formData = await request.formData();

    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" }
    });

    if(!user){
      throw new Error("Failed to load User")
    }
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    
    for (const file of imageFiles) {
      const url = await saveImage(file);
      imageUrls.push(url);
    }

    // Generate slug from title
    const title = formData.get('title') as string;
    const slug = slugify(title, { lower: true, strict: true });

    // Check if there's already a main package when this one is set as main
    const highlight = formData.get('highlight') as 'NORMAL' | 'FEATURED' | 'MAIN';
    if (highlight === 'MAIN') {
      const existingMain = await prisma.travelPackage.findFirst({
        where: { highlight: 'MAIN' }
      });

      if (existingMain) {
        await prisma.travelPackage.update({
          where: { id: existingMain.id },
          data: { highlight: 'FEATURED' }
        });
      }
    }

    // Create package with images and package type
    const packageData = await prisma.travelPackage.create({
      data: {
        userId: user.id,
        title,
        slug,
        code: formData.get('code') as string,
        description: formData.get('description') as string,
        content: formData.get('content') as string,
        location: formData.get('location') as string,
        maxGuests: parseInt(formData.get('maxGuests') as string),
        numberOfDays: parseInt(formData.get('numberOfDays') as string),
        status: formData.get('status') as any,
        highlight: highlight,
        typeId: formData.get('typeId') as string,
        imageUrl: imageUrls[0] || '',
        images: {
          create: imageUrls.map((url, index) => ({
            url,
            isMain: index === 0
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