"use client";

import Image from "next/image";
import React from "react";
import { useCompanion, useCompanionState } from "./companion/CompanionContext";

export default function HeaderLogo() {
  const { setLogoRect } = useCompanion();
  const { hasActivated } = useCompanionState();
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setLogoRect({ x: r.x, y: r.y, width: r.width, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [setLogoRect]);

  return (
    <span className="flex items-center gap-2">
      <span ref={ref} className="inline-flex">
        {!hasActivated ? (
          <Image
            src="/logo.png"
            alt="ishaform logo"
            width={28}
            height={28}
            className="rounded"
          />
        ) : (
          <span
            aria-hidden="true"
            className="block size-[28px] rounded bg-neutral-200 dark:bg-neutral-800 ring-1 ring-black/10 dark:ring-white/10 animate-pulse"
          />
        )}
      </span>
      <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        ishaform
      </span>
    </span>
  );
}
