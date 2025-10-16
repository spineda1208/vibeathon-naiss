"use client";

import React from "react";

export default function CaptchaGate({
  onClose,
  onPassed,
}: {
  onClose: () => void;
  onPassed: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Prove you are human
        </h2>
        <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-300">
          Mini-game placeholder. We will plug different tests here.
        </p>
        <div className="grid h-32 place-items-center rounded-xl border border-dashed border-neutral-300 bg-neutral-100 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
          Coming soon…
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
          >
            Close
          </button>
          <button
            onClick={onPassed}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm text-white"
          >
            I passed
          </button>
        </div>
      </div>
    </div>
  );
}
