"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Users, LogOut, BookOpen, Tags, FileText, FolderTree, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile: boolean;
}

interface SiteSettings {
  name: string;
  logo: string | null;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Packages",
    href: "/admin/packages",
    icon: Package,
  },
  {
    title: "Package Types",
    href: "/admin/package-types",
    icon: Tags,
  },
  {
    title: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    title: "Article Categories",
    href: "/admin/article-categories",
    icon: FolderTree,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const SidebarContent = ({ pathname, settings }: { pathname: string; settings: SiteSettings | null }) => (
  <>
    <div className="h-16 border-b flex items-center px-6">
      <Link href="/" className="flex items-center space-x-2">
        {settings?.logo ? (
          <Image
            src={settings.logo}
            alt={settings.name}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          <Package className="h-6 w-6" />
        )}
        <span className="font-bold text-lg">{settings?.name || "TravelPortal"}</span>
      </Link>
    </div>
    <nav className="flex-1 p-4">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
    <div className="border-t p-4">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => signOut()}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  </>
);

export function AdminSidebar({ isOpen, onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] p-0">
          <SidebarContent pathname={pathname} settings={settings} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-border fixed top-0 left-0 h-screen transition-all duration-300 w-64",
      )}
    >
      <SidebarContent pathname={pathname} settings={settings} />
    </div>
  );
}