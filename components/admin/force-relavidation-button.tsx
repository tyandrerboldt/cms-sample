"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

type ContactButtonsProps = {
  label: string;
  route: string;
};

const ForceRevalidationButton = ({ label, route }: ContactButtonsProps) => {
  const revalidate = async () => {
    const revalidateRes = await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: `${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
        route,
      }),
    });

    if (!revalidateRes.ok) throw new Error("Falha ao renderizar pacote");
  };

  return (
    <Button className="w-full" onClick={revalidate}>
      <RefreshCw className="h-5 w-5 mr-2" />
      {label}
    </Button>
  );
};

export default ForceRevalidationButton;
