"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeaderLogo() {
  return (
    <motion.div layoutId="brand-logo" className="flex items-center gap-2">
      <Image src="/logo.png" alt="ishaform logo" width={28} height={28} className="rounded" />
      <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">ishaform</span>
    </motion.div>
  );
}
