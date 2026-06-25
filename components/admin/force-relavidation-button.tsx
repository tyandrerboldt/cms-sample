"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const ForceRevalidationButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const revalidate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trigger-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: `${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Falha ao iniciar a renderização");
      }

      toast({
        title: "Rebuild completo iniciado",
        description:
          "Use apenas se as alterações não aparecerem automaticamente após salvar. Aguarde alguns minutos para o site refletir as mudanças.",
      });
    } catch {
      toast({
        title: "Falha ao renderizar",
        description: "Não foi possível iniciar a renderização do site.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button
          title=""
          variant={"destructive"}
          disabled={loading}
          onClick={revalidate}
        >
          <RefreshCw
            className={cn("h-5 w-5 mr-2", loading && "animate-spin")}
          />
          {loading ? "...Aguardando" : "Forçar atualização"}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>
          Use apenas se as alterações não aparecerem automaticamente após salvar.
          Isso dispara um rebuild completo do site (pode levar alguns minutos).
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ForceRevalidationButton;
