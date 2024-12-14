"use client";

import { motion } from "framer-motion";
import { SiteSettings } from "@prisma/client";

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

interface AboutSectionProps {
  settings: SiteSettings | null;
}

export function AboutSection({ settings }: AboutSectionProps) {
  if (!settings?.aboutText) return null;

  return (
    <section className="py-16 px-4 bg-primary text-muted">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center text-white mb-8"
          >
            Quem Somos
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="prose prose-lg dark:prose-invert mx-auto text-center text-white"
            dangerouslySetInnerHTML={{ __html: settings.aboutText.split("||intro||")[0] }}
          />
        </motion.div>
      </div>
    </section>
  );
}