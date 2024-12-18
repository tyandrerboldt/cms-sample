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
    fetch("/api/admin/trigger-build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: `${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
      }),
    })
      .then((res) => {
        setLoading(false);
        toast({
          title: "Site atualizado!",
          description: "O site foi renderizado com sucesso.",
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Falha ao renderizar",
          description: "Não foi possível renderizar o site.",
          variant: "destructive",
        });
      });
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
        <p>Força a atualização das páginas do site com base nos dados atuais.</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ForceRevalidationButton;
