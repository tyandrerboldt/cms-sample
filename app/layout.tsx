import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteStatusAlert } from "@/components/site-status-alert";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicThemeProvider } from "@/components/theme/public-theme-provider";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import { getBaseMetadata } from "@/lib/metadata";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });
const gaId = `${process.env.GOOGLE_GTAG_ID}`
const isProduction = process.env.NODE_ENV == "production"

export async function generateMetadata() {
  return getBaseMetadata();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicThemeProvider />
          <AuthProvider>
            <SiteSettingsProvider>
              <SiteStatusAlert />
              {children}
              <Toaster />
            </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
      {isProduction && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
