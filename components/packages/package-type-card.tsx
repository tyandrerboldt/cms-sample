import { PackageType } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Anchor, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PackageTypeCardProps {
  packageType: PackageType & {
    _count: {
      packages: number;
    };
  };
  className?: string;
}

export function PackageTypeCard({ packageType, className }: PackageTypeCardProps) {
  const Icon = packageType.slug === "barcos-hoteis" ? Anchor : Building2;

  return (
    <Link href={`/pacotes/${packageType.slug}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                {packageType.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {packageType._count.packages} {packageType._count.packages === 1 ? 'pacote' : 'pacotes'} disponíveis
              </p>
            </div>
          </div>
          {packageType.description && (
            <p className="mt-4 text-muted-foreground text-sm line-clamp-2">
              {packageType.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}