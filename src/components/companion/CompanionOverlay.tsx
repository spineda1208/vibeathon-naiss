"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useCompanionState } from "./CompanionContext";

export default function CompanionOverlay() {
  const { isVisible, position, message, isLarge } = useCompanionState();

  if (!isVisible) return null;

  const size = isLarge ? 100 : 36;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom,
      }}
    >
      <div className="relative">
        <motion.div layoutId="brand-logo" initial={false} animate={{ scale: isLarge ? 1.25 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
          <Image src="/logo.png" alt="ishaform companion" width={size} height={size} className="rounded" />
        </motion.div>
        {message?.text ? (
          <div className="absolute -top-2 left-full ml-2 max-w-[240px] bg-white/90 dark:bg-neutral-900/90 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm shadow-md pointer-events-auto">
            <p className="text-neutral-800 dark:text-neutral-200">{message.text}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
