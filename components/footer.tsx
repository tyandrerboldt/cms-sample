"use client";

import { useSiteSettings } from "@/hooks/use-site-settings";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const socialLinks = [
    { href: settings.facebookUrl, icon: Facebook, label: "Facebook" },
    { href: settings.instagramUrl, icon: Instagram, label: "Instagram" },
    { href: settings.twitterUrl, icon: Twitter, label: "Twitter" },
    { href: settings.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: settings.youtubeUrl, icon: Youtube, label: "YouTube" },
  ].filter((link) => link.href);

  return (
    <footer className={cn("bg-muted py-8 mt-auto", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {socialLinks.length > 0 && (
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="text-sm text-muted-foreground text-center">
            <p>
              © {new Date().getFullYear()} {settings.name}. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}