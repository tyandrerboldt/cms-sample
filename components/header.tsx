"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plane } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6" />
          <span className="font-bold text-xl">TravelPortal</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <Link href="/destinations" legacyBehavior passHref>
                <NavigationMenuLink className="font-medium">
                  Destinations
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/packages" legacyBehavior passHref>
                <NavigationMenuLink className="font-medium">
                  Packages
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {session?.user && (
              <NavigationMenuItem>
                <Link href="/admin/packages" legacyBehavior passHref>
                  <NavigationMenuLink className="font-medium">
                    Admin Panel
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
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
      </div>
    </header>
  );
}