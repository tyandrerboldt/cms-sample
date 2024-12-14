"use client";

import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

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

export function AboutContact() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="container mx-auto px-4 pb-16"
    >
      <motion.div variants={itemVariants} className="flex justify-center">
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
  );
}