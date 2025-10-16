"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { CompanionSize, useCompanionState } from "./CompanionContext";

export default function CompanionOverlay() {
  const { isVisible, position, message, logoRect, avatarSrc, isCentered, size, sizePx } = useCompanionState();

  if (!isVisible) return null;

  // Pixel width is resolved in context; fallback to logo width if missing
  const baseSize = sizePx != null ? Math.max(1, Math.floor(sizePx)) : Math.max(1, Math.floor(logoRect?.width ?? 28));

  // Compute animation targets for fixed positioning
  const topTarget = isCentered ? '50%' : (position.top ?? (logoRect ? logoRect.y : undefined));
  const leftTarget = isCentered ? '50%' : (position.left ?? (logoRect ? logoRect.x : undefined));
  const rightTarget = isCentered ? undefined : position.right;
  const bottomTarget = isCentered ? undefined : position.bottom;

  return (
    <motion.div
      className="fixed z-[70] pointer-events-none"
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
      style={{ transform: isCentered ? 'translate(-50%, -50%)' : undefined }}
    >
      <div className="relative">
        <motion.div animate={{ scale: isCentered ? 1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
          <Image
            src={avatarSrc}
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
