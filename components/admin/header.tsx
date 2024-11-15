"use client";

import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isMobile: boolean;
}

export function AdminHeader({ onToggleSidebar, isMobile }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-white dark:bg-gray-800 flex items-center px-4">
      {isMobile && <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-4">
        <Menu className="h-5 w-5" />
      </Button>}
      
      <div className="flex-1" />
      
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}