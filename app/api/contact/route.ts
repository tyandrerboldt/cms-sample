import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: "Site settings not found" },
        { status: 404 }
      );
    }

    if (!settings.smtpHost || !settings.smtpPort || !settings.smtpUser || !settings.smtpPass) {
      return NextResponse.json(
        { error: "SMTP settings not configured" },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    // Email content
    const mailOptions = {
      from: settings.smtpFrom || settings.smtpUser,
      to: settings.smtpFrom || settings.smtpUser,
      replyTo: data.email,
      subject: `Novo contato via ${data.source}`,
      html: `
        <h2>Novo Contato</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>E-mail:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone}</p>
        <p><strong>Origem:</strong> ${data.source}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}