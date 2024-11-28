"use client";

import { WhatsappIcon } from "@/components/icons/whatsapp";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

interface SocialBarProps {
  className?: string;
}

export function SocialBar({ className }: SocialBarProps) {
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const socialLinks = [
    { href: settings.facebookUrl, icon: Facebook },
    { href: settings.instagramUrl, icon: Instagram },
    { href: settings.twitterUrl, icon: Twitter },
    { href: settings.linkedinUrl, icon: Linkedin },
    { href: settings.youtubeUrl, icon: Youtube },
  ].filter((link) => link.href);

  const hasEmail = settings.smtpFrom;
  const hasWhatsApp = settings.whatsappNumber;
  const hasSocialLinks = socialLinks.length > 0;

  if (!hasEmail && !hasSocialLinks && !hasWhatsApp) return null;

  const whatsappUrl = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : null;

  return (
    <div className={cn("bg-primary py-2 text-white", className)}>
      <div className="container mx-auto px-4 flex items-center justify-end text-sm">
        {hasSocialLinks && (
          <div className="flex items-center space-x-4">
            {hasEmail && (
              <Link
                title="Enviar e-mail"
                href={`mailto:${settings.smtpFrom}`}
                className="flex items-center hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
              </Link>
            )}
            {hasWhatsApp && (
              <Link
                title="Falar no Whatsapp"
                href={whatsappUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-foreground transition-colors"
              >
                <WhatsappIcon className="h-4 w-4 mr-2" />
              </Link>
            )}
            {socialLinks.map(({ href, icon: Icon }) => (
              <Link
                key={href}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
