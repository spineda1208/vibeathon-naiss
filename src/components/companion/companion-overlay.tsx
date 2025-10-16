"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import {
  CompanionAvatar,
  CompanionSize,
  useCompanionState,
} from "@/components/companion/companion-context";

export default function CompanionOverlay() {
  const { isVisible, position, message, logoRect, avatar, isCentered, size } = useCompanionState();

  if (!isVisible) return null;

  // Map enum sizes to pixels at render time only
  const logoBase = Math.max(1, Math.floor(logoRect?.width ?? 28));
  const baseSize =
    size === CompanionSize.Base
      ? logoBase
      : size === CompanionSize.Medium
        ? Math.max(1, Math.floor(logoBase * 2))
        : Math.max(1, Math.floor(logoBase * 8));

  // Compute animation targets for fixed positioning (no fallback to logoRect here)
  const topTarget = isCentered ? "50%" : position.top;
  const leftTarget = isCentered ? "50%" : position.left;
  const rightTarget = undefined;
  const bottomTarget = undefined;

  return (
    <motion.div
      className="pointer-events-none fixed z-[70]"
      initial={
        logoRect ? { top: logoRect.y, left: logoRect.x, opacity: 0.001 } : { opacity: 0.001 }
      }
      animate={{
        top: topTarget,
        left: leftTarget,
        right: rightTarget,
        bottom: bottomTarget,
        opacity: 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{ transform: isCentered ? "translate(-50%, -50%)" : undefined }}
    >
      <div className="relative">
        <motion.div
          animate={{ scale: isCentered ? 1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <Image
            src={
              avatar === CompanionAvatar.Logo
                ? "/logo.png"
                : avatar === CompanionAvatar.AnimeGirl
                  ? "/companion/anime_girl.png"
                  : "/companion/mad.png"
            }
            alt="ishaform companion"
            width={baseSize}
            height={baseSize}
            className="rounded-full"
          />
        </motion.div>
        {message?.text ? (
          <div className="pointer-events-auto absolute -top-2 left-full ml-2 max-w-[240px] rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-sm shadow-md dark:border-white/10 dark:bg-neutral-900/90">
            <p className="text-neutral-800 dark:text-neutral-200">{message.text}</p>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
