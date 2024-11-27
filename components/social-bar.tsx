"use client";

import {
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";

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
  const hasSocialLinks = socialLinks.length > 0;

  if (!hasEmail && !hasSocialLinks) return null;

  return (
    <div className={cn("bg-primary py-2 text-white", className)}>
      <div className="container mx-auto px-4 flex items-center justify-end text-sm">
        {hasSocialLinks && (
          <div className="flex items-center space-x-4">
            {hasEmail && (
              <Link
                key={"email"}
                title="E-mail"
                href={`mailto:${settings.smtpFrom}`}
                className="flex items-center hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
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
