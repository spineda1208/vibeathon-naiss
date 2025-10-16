"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { DOMRectLike } from "./CompanionContext";
import { useCompanionState } from "./CompanionContext";

export default function CompanionOverlay() {
  const { isVisible, position, message, isLarge, logoRect } = useCompanionState();

  if (!isVisible) return null;

  // Match base size to the navbar logo (28px) or measured logoRect width
  const baseSize = Math.max(1, Math.floor(logoRect?.width ?? 28));

  // Compute animation targets for fixed positioning
  const topTarget = position.top ?? (logoRect ? logoRect.y : undefined);
  const leftTarget = position.left ?? (logoRect ? logoRect.x : undefined);
  const rightTarget = position.right;
  const bottomTarget = position.bottom;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={
        logoRect
          ? { top: logoRect.y, left: logoRect.x, opacity: 0.001 }
          : { opacity: 0.001 }
      }
      animate={{
        top: topTarget,
        left: leftTarget,
        right: rightTarget,
        bottom: bottomTarget,
        opacity: 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{}}
    >
      <div className="relative">
        <motion.div animate={{ scale: isLarge ? 1.8 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
          <Image
            src="/logo.png"
            alt="ishaform companion"
            width={baseSize}
            height={baseSize}
            className="rounded-full"
          />
        </motion.div>
        {message?.text ? (
          <div className="absolute -top-2 left-full ml-2 max-w-[240px] bg-white/90 dark:bg-neutral-900/90 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm shadow-md pointer-events-auto">
            <p className="text-neutral-800 dark:text-neutral-200">
              {message.text}
            </p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
