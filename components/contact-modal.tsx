"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ContactModalProps {
  source?: string;
  title?: string;
  description?: string;
  location?: string;
  trigger?: React.ReactNode;
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export function ContactModal({
  source = "website",
  title = "Entre em Contato",
  description = "Preencha o formulário abaixo para entrar em contato conosco.",
  trigger,
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const recaptchaLoaded = useRef(false);

  // Lazy load reCAPTCHA script only when needed
  const loadRecaptchaScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (recaptchaLoaded.current && window.grecaptcha) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="recaptcha"]`);
      if (existingScript) {
        window.grecaptcha.ready(() => {
          recaptchaLoaded.current = true;
          resolve();
        });
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.grecaptcha.ready(() => {
          recaptchaLoaded.current = true;
          resolve();
        });
      };

      script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
      document.head.appendChild(script);
    });
  }, []);

  // Get reCAPTCHA token
  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    await loadRecaptchaScript();
    return window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact_form" });
  }, [loadRecaptchaScript]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Capture form reference before any async operations
    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);

    try {
      // Get reCAPTCHA token before submitting
      const recaptchaToken = RECAPTCHA_SITE_KEY ? await getRecaptchaToken() : null;

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        location: formData.get("location"),
        source,
        recaptchaToken,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Falha ao enviar mensagem");
      }

      toast({
        title: "Mensagem Enviada",
        description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Houve um erro ao enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Entrar em Contato</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Seu nome completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                required
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Local</Label>
              <Input
                id="location"
                name="location"
                required
                placeholder="Local que deseja pescar"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="Digite sua mensagem..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Mensagem
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}