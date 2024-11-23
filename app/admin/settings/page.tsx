"use client";

import { SettingsForm } from "@/components/admin/settings-form";
import { PageTransition } from "@/components/page-transition";
import { useEffect, useState } from "react";
import { SiteSettings } from "@prisma/client";

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        <SettingsForm settings={settings} />
      </div>
    </PageTransition>
  );
}