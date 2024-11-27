"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Moon, Plane, Sun, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-site-settings";
import Image from "next/image";
import { SocialBar } from "./social-bar";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { settings, loading } = useSiteSettings();
  const pathname = usePathname();

  const menuItems = [
    { href: "/pacotes", label: "Pacotes" },
    { href: "/blog", label: "Artigos" },
    ...(session?.user ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-2 py-1 text-lg transition-colors",
                isActiveLink(item.href)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4">
            {session?.user ? (
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="w-full"
              >
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => signIn("google")} className="w-full">
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <header className={cn("border-b bg-background", className)}>
        <SocialBar />
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Link href="/" className="absolute -top-10" title={settings?.name}>
            {settings?.logo ? (
              <>
                <Image
                  src={settings.logo}
                  alt={settings.name}
                  width={180}
                  height={72}
                  className="md:hidden object-contain"
                />
                <Image
                  src={settings.logo}
                  alt={settings.name}
                  width={240}
                  height={96}
                  className="hidden md:block object-contain"
                />
              </>
            ) : (
              `${settings?.name}`
            )}
          </Link>
          <div className="w-[240px]"></div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "font-medium transition-colors",
                        isActiveLink(item.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <div className="hidden md:block">
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sair
                  </Button>
                </div>
              ) : (
                <Button onClick={() => signIn("google")}>Sign In</Button>
              )}
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}