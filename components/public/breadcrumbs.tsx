"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  current: boolean;
}

export function PublicBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [
      { label: "Início", href: "/", current: segments.length === 0 },
    ];

    segments.reduce((acc, segment, index) => {
      const href = `${acc}/${segment}`;
      const label = getBreadcrumbLabel(segment);
      items.push({
        label,
        href,
        current: index === segments.length - 1,
      });
      return href;
    }, "");

    return items;
  }, [pathname]);

  if (pathname === "/") return null;

  return (
    <nav className="container mx-auto px-4 py-4 pt-12 md:pt-24">
      <ol className="flex items-center space-x-2 text-sm flex-wrap">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
            {item.current ? (
              <span className="text-muted-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-foreground hover:text-primary transition-colors flex items-center"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function getBreadcrumbLabel(segment: string): string {
  // Add more special cases as needed
  switch (segment) {
    case "pacotes":
      return "Pacotes";
    case "blog":
      return "Blog";
    default:
      // Convert slug to title case
      return segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}