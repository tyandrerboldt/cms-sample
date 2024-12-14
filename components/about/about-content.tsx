"use client";

import { SiteSettings } from "@prisma/client";
import { AboutContact } from "./about-contact";
import { motion } from "framer-motion";

interface AboutContentProps {
  settings: SiteSettings | null;
}


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


export function AboutContent({ settings }: AboutContentProps) {
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
          <motion.p variants={itemVariants} className="text-center">
            {settings.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
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
        </motion.div>
      </div>
    </section>
      <AboutContact />
    </div>
  );
}