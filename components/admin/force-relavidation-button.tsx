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

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

type RebuildStatus = "idle" | "running" | "success" | "failed" | "unknown";

async function fetchRebuildStatus(): Promise<{
  status: RebuildStatus;
  message?: string;
}> {
  const res = await fetch("/api/admin/trigger-build", { method: "GET" });
  if (!res.ok) {
    throw new Error("Não foi possível verificar o status do rebuild");
  }
  return res.json();
}

async function waitForRebuildCompletion(): Promise<{
  ok: boolean;
  message: string;
}> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    try {
      const current = await fetchRebuildStatus();

      if (current.status === "success") {
        return { ok: true, message: "Rebuild concluído com sucesso." };
      }

      if (current.status === "failed") {
        return {
          ok: false,
          message:
            current.message ??
            "Rebuild falhou. Verifique o log do servidor.",
        };
      }
    } catch {
      // PM2 reinicia durante o rebuild — continua polling
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return {
    ok: false,
    message: "Rebuild excedeu o tempo limite de 10 minutos.",
  };
}

const ForceRevalidationButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const revalidate = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/trigger-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: `${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 409) {
        toast({
          title: "Rebuild em andamento",
          description: data?.message ?? "Aguarde o rebuild atual terminar.",
        });
        return;
      }

      if (!res.ok) {
        throw new Error(data?.message ?? "Falha ao iniciar o rebuild");
      }

      const result = await waitForRebuildCompletion();

      if (result.ok) {
        toast({
          title: "Rebuild concluído",
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Falha no rebuild",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível concluir o rebuild do site.",
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
          {loading ? "Rebuild em andamento..." : "Forçar atualização"}
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
