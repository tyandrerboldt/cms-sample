"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function SiteStatusAlert() {
  const { data: session } = useSession();
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const response = await fetch("/api/config");
        const data = await response.json();
        setIsInactive(!data.status);
      } catch (error) {
        console.error("Failed to check site status:", error);
      }
    };

    if (session?.user) {
      checkSiteStatus();
    }
  }, [session]);

  if (session?.role != "EDITOR" || session?.role != "ADMIN" || !isInactive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-4 right-4 z-50 max-w-md"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Site Inativo</AlertTitle>
          <AlertDescription>
            O site está atualmente em modo de manutenção e não está visível para visitantes, inclusive este aviso.
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}