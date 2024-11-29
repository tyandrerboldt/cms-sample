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

    // Format phone number for better readability
    const formattedPhone = data.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

    // Email content with fishing-themed template
    const mailOptions = {
      from: settings.smtpFrom || settings.smtpUser,
      to: settings.smtpFrom || settings.smtpUser,
      replyTo: data.email,
      subject: `🎣 Nova solicitação de: ${data.source}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h1 style="color: #166534; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #dcfce7;">
            Nova Solicitação de Contato
          </h1>
          
          <div style="background-color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #166534; margin-top: 0;">Informações do Cliente</h2>
            <p style="margin: 8px 0;"><strong>Nome:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>E-mail:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>Telefone:</strong> ${formattedPhone}</p>
            <p style="margin: 8px 0;"><strong>Local de Interesse:</strong> ${data.location || 'Não informado'}</p>
            <p style="margin: 8px 0;"><strong>Origem do Contato:</strong> ${data.source}</p>
          </div>

          <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #166534; margin-top: 0;">Mensagem</h2>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px; margin-top: 8px;">
              ${data.message.replace(/\n/g, "<br>")}
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #dcfce7; font-size: 14px; color: #666;">
            <p style="margin: 4px 0;">Este e-mail foi enviado automaticamente pelo sistema de contato do site.</p>
            <p style="margin: 4px 0;">Para responder ao cliente, utilize o e-mail: ${data.email}</p>
          </div>
        </div>
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