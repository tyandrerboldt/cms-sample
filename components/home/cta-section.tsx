"use client";

import { useSiteSettings } from "@/hooks/use-site-settings";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { ContactModal } from "@/components/contact-modal";

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

export function CTASection() {
  const { settings, loading } = useSiteSettings();

  if (loading || !settings?.ctaText) return null;

  return (
    <section className="py-16 px-4 bg-slate-800">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div dangerouslySetInnerHTML={{ __html: settings.ctaText }} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6"
          >
            <div className="text-white space-y-2">
              <h3 className="text-2xl font-bold">Entre em Contato</h3>
              <p className="text-white/80">
                Estamos prontos para ajudar você a planejar sua próxima aventura
              </p>
            </div>

            <div className="space-y-4">

              <ContactModal
                source="CTA Section"
                trigger={
                  <Button className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Fale Conosco
                  </Button>
                }
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
