"use client";

import { useSiteSettings } from "@/contexts/site-settings";
import { motion } from "framer-motion";
import Image from "next/image";
import { ContactModal } from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AboutContent() {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    );
  }

  if (!settings?.aboutText) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            Informações não disponíveis no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {settings.name}
            </motion.h1>
            <p className="text-center">{settings.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="prose prose-lg dark:prose-invert mx-auto text-center md:text-justify leading-7"
              dangerouslySetInnerHTML={{ __html: settings.aboutText.replace("||intro||", "") }}
            />

            <motion.div
              variants={itemVariants}
              className="mt-12 flex justify-center"
            >
              <ContactModal
                source="Página Quem Somos"
                trigger={
                  <Button size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Entre em Contato
                  </Button>
                }
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}