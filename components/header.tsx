"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plane } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/destinations", label: "Destinations" },
    { href: "/packages", label: "Packages" },
    { href: "/blog", label: "Blog" },
    ...(session?.user ? [{ href: "/admin/packages", label: "Admin Panel" }] : []),
  ];

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
              className="block px-2 py-1 text-lg"
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
              <Button
                onClick={() => signIn("google")}
                className="w-full"
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6" />
          <span className="font-bold text-xl">TravelPortal</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className="font-medium">
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
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
  );
}