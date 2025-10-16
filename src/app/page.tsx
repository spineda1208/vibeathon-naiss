import Link from "next/link";

import React from "react";
import BackgroundParticlesMount from "@/components/background/background-particles-mount";
import BodyNoScroll from "@/components/body-no-scroll";

export const metadata = {
  title: "ishaform — Worst Auth Landing",
  description: "An ironically over-the-top landing for the worst auth form.",
};

export default function Home() {
  return (
    <main className="relative flex h-[100svh] overflow-hidden px-6 py-48">
      <BodyNoScroll />
      <BackgroundParticlesMount />
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-neutral-900/60 dark:text-neutral-300">
          for serious inquiries only
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-100">
          forms so bad, they’re beautiful.
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          are you tired of paying for clerk?
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white shadow-lg shadow-neutral-900/10 hover:opacity-90 dark:bg-white dark:text-neutral-900"
          >
            try isha form
          </Link>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-3 z-20">
        <div className="mx-auto max-w-6xl px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur dark:border-white/15 dark:bg-neutral-900/60 dark:text-neutral-300">
            brought to you by fans of dreamberd <span aria-hidden>🧪</span>
          </span>
        </div>
      </div>
    </main>
  );
}
