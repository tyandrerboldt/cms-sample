"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";
import { ContactModal } from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function MaintenancePage() {
  const [config, setConfig] = useState<any>(null);
  const session = useSession();

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getSiteConfig();
      setConfig(data);
    };
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8 p-8">
        {config?.logo && (
          <div className="flex justify-center">
            <Image
              src={config.logo}
              alt={config.name}
              width={200}
              height={80}
              className="object-contain"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900">
          {config?.name || "Portal de Viagens"}
        </h1>

        <div className="space-y-4">
          <div className="animate-bounce">
            <div className="w-16 h-16 mx-auto">
              <svg
                className="text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-700">
            Site em Manutenção
          </h2>

          <p className="text-gray-600 max-w-md mx-auto">
            Estamos realizando algumas melhorias para proporcionar uma
            experiência ainda melhor. Por favor, volte em breve!
          </p>

          <div className="pt-4">
            <ContactModal
              source="Página de Manutenção"
              title="Precisa de Ajuda?"
              description="Envie sua mensagem e entraremos em contato assim que possível."
              trigger={<Button size="lg">Entrar em Contato</Button>}
            />
          </div>
          {session?.data && (
            <div className="border-t p-4">
              <p className="text-left"><strong>Usuário: </strong>{session.data?.user?.name}</p>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
