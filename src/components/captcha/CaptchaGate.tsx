"use client";

import React from "react";

export default function CaptchaGate({ onClose, onPassed }: { onClose: () => void; onPassed: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-4 shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Prove you are human</h2>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-4">Mini-game placeholder. We will plug different tests here.</p>
        <div className="h-32 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 grid place-items-center text-neutral-500">
          Coming soon…
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm">Close</button>
          <button onClick={onPassed} className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm">I passed</button>
        </div>
      </div>
    </div>
  );
}
