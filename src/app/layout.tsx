import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/page-transition";
import { ModeProvider } from "@/components/mode-provider";
import { VisitorScan } from "@/components/visitor-scan";
import { MultiplayerCursors } from "@/components/multiplayer-cursors";
import { GalaxyMode } from "@/components/galaxy-mode";
import { GalaxyLauncher } from "@/components/galaxy-launcher";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Regee Casaña",
  description: "Software Engineer",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} ${notoSansJP.variable} font-mono antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <VisitorScan />
          <MultiplayerCursors />
          <GalaxyMode />
          <GalaxyLauncher />
          <ModeProvider>
            <PageTransition>{children}</PageTransition>
          </ModeProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
