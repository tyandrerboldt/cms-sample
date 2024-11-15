import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saveImage } from "@/lib/image-upload";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { id: "default" }
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let logoUrl = formData.get('existingLogo') as string;

    // Handle logo upload
    const logoFile = formData.get('logo') as File;
    if (logoFile) {
      logoUrl = await saveImage(logoFile, 'logos');
    }

    // Convert form data to settings object
    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== 'logo' && key !== 'existingLogo') {
        if (key === 'status') {
          data[key] = value === 'true';
        } else if (key === 'smtpPort' && value) {
          data[key] = parseInt(value as string);
        } else if (value) {
          data[key] = value;
        }
      }
    });

    // Add logo URL if exists
    if (logoUrl) {
      data.logo = logoUrl;
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        ...data
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}