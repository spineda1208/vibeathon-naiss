import type { Metadata } from "next";
import Image from "next/image";
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
  description: "ishaform — the internet’s worst auth (ironically)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 dark:from-neutral-950 dark:via-violet-950 dark:to-indigo-950`}
      >
        <header className="border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="ishaform logo" width={28} height={28} className="rounded" />
              <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">ishaform</span>
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
