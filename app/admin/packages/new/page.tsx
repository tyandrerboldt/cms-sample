import { PackageForm } from "@/components/admin/package-form";

export default function NewPackage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Package</h1>
      <PackageForm />
    </div>
  );
}