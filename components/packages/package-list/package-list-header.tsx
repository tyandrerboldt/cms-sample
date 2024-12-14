import { PackageType } from "@prisma/client";

interface PackageListHeaderProps {
  packageType: PackageType;
}

export function PackageListHeader({ packageType }: PackageListHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-4">{packageType.name}</h1>
      {packageType.description && (
        <p className="text-lg text-muted-foreground">{packageType.description}</p>
      )}
    </div>
  );
}