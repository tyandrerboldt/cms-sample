"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { publicTheme } from "@/lib/themes/public";

export function PublicThemeProvider() {
  const pathname = usePathname();
  const isPublicPage = !pathname.startsWith('/admin');

  useEffect(() => {
    if (!isPublicPage) return;

    const applyTheme = (theme: 'light' | 'dark') => {
      const root = document.documentElement;
      const colors = publicTheme[theme];
      
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };

    // Initial theme application
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'dark' : 'light');

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          applyTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      // Reset to default theme when unmounting
      const root = document.documentElement;
      Object.keys(publicTheme.light).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [isPublicPage]);

  return null;
}