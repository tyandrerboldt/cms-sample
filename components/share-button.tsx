"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Link2, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WhatsappIcon } from "@/components/icons/whatsapp";

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
  const { toast } = useToast();
  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${url}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para sua área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const shareLinks = [
    // {
    //   name: "WhatsApp",
    //   icon: WhatsappIcon,
    //   url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${fullUrl}`)}`,
    // },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    // {
    //   name: "Twitter",
    //   icon: Twitter,
    //   url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    // },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Link2 className="mr-2 h-4 w-4" />
          Copiar Link
        </DropdownMenuItem>
        {shareLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}