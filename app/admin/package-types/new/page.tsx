import { PackageTypeForm } from "@/components/admin/package-type-form";

export default function NewPackageType() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Package Type</h1>
      <PackageTypeForm />
    </div>
  );
}