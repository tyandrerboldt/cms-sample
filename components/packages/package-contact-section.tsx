import { TravelPackage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, MapPin, Phone, Users } from "lucide-react";
import { useState } from "react";

interface PackageContactSectionProps {
  package: TravelPackage;
}

export function PackageContactSection({ package: pkg }: PackageContactSectionProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      location: pkg.location,
      source: `${pkg.code} - ${pkg.title}`,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao enviar mensagem");

      toast({
        title: "Mensagem Enviada",
        description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pluralDays = pkg.numberOfDays > 1 ? "dias" : "dia";
  const pluralGuests = pkg.maxGuests > 1 ? "hóspedes" : "hóspede";

  return (
    <div className="relative mt-12">
      {/* Background with image and overlay */}
      {pkg.imageUrl && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${pkg.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/80 backdrop-blur-sm" />
        </div>
      )}

      <div className="relative rounded-lg p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column - Package Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Solicite mais informações</h2>
              <p className="text-lg text-muted-foreground">
                Entre em contato para saber mais detalhes sobre este pacote e verificar disponibilidade.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{pkg.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5 text-primary" />
                <span>
                  Pacote para até {pkg.maxGuests} {pluralGuests}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <span>Resposta em até 24 horas</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span>Atendimento personalizado</span>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Digite sua mensagem..."
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}