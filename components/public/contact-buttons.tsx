"use client"

import { WhatsappIcon } from "../icons/whatsapp";
import { Button } from "../ui/button";

type ContactButtonsProps = {
  whatsappNumber?: string;
  pkg: {
    code: string;
    title: string;
  };
};

const ContactButtons = ({ pkg, whatsappNumber }: ContactButtonsProps) => {
  const handleWhatsAppContact = () => {
    if (whatsappNumber) {
      const message = encodeURIComponent(
        `Olá! Gostaria de mais informações sobre o pacote ${pkg.code} - ${pkg.title}`
      );
      const zapNumber = whatsappNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    }
  };

  return (
    <>
      {whatsappNumber && (
        <Button size="lg" className="w-full" onClick={handleWhatsAppContact}>
          <WhatsappIcon className="h-5 w-5 mr-2" />
          Entrar em Contato via WhatsApp
        </Button>
      )}
    </>
  );
};

export default ContactButtons;
