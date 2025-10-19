"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const CatClickGameModal = dynamic(() => import("../../components/CatClickGameModal"), { ssr: false });

export default function TestClient() {
  const [isOpen, setIsOpen] = useState(true);
  const [winCount, setWinCount] = useState(0);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          CatClickGameModal Test
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          The modal opens by default. Clear all cats before the next spawn to win.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 font-medium shadow hover:opacity-90"
          >
            Open Modal
          </button>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Wins: {winCount}</span>
        </div>
      </div>

      <CatClickGameModal
        isOpen={isOpen}
        onWin={() => {
          setWinCount((c) => c + 1);
          setIsOpen(false);
        }}
        onRequestClose={() => setIsOpen(false)}
      />
    </main>
  );
}


