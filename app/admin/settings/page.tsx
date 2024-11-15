import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettings() {
  const settings = await prisma.siteSettings.findFirst({
    where: { id: "default" }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}