import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGroup } from "framer-motion";
import { CompanionProvider } from "@/components/companion/companion-context";
import CompanionOverlay from "@/components/companion/companion-overlay";
import HeaderLogo from "@/components/header-logo";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ishaform",
  description: "ishaform — the internet’s best forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 font-sans antialiased dark:from-neutral-950 dark:via-violet-950 dark:to-indigo-950`}
      >
        <CompanionProvider>
          <LayoutGroup id="app-shared">
            <header className="relative z-10 border-b border-black/10 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:border-white/10 dark:bg-neutral-900/50 supports-[backdrop-filter]:dark:bg-neutral-900/40">
              <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                  <HeaderLogo />
                </Link>
              </div>
            </header>
            {children}
            <CompanionOverlay />
          </LayoutGroup>
        </CompanionProvider>
      </body>
    </html>
  );
}
