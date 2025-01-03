import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { saveImage } from "@/lib/image-upload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true
      }
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
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

    const title = formData.get('title') as string;
    const slug = slugify(title, { lower: true, strict: true });
    
    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    
    if (imageFile) {
      imageUrl = await saveImage(imageFile, 'articles');
    }

    const article = await prisma.article.create({
      data: {
        userId: user.id,
        title,
        slug,
        content: formData.get('content') as string,
        excerpt: formData.get('excerpt') as string,
        imageUrl,
        published: formData.get('published') === 'true',
        categoryId: formData.get('categoryId') as string,
      }
    });
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}