"use client";

import Image from "next/image";
import React from "react";
import { CompanionSize, useCompanion, useCompanionState } from "@/components/companion/companion-context";
import { anchorTopLeftOf } from "@/components/companion/positioning";

export default function HeaderLogo() {
  const { setLogoRect, moveTo, show, setSize } = useCompanion();
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

  const handleClick = () => {
    const el = ref.current;
    if (!el) return;
    const { top, left } = anchorTopLeftOf(el);
    moveTo({ top, left });
    setSize(CompanionSize.Base);
    show();
  };

  return (
    <span className="flex items-center gap-2 cursor-pointer select-none" onClick={handleClick}>
      <span ref={ref} className="inline-flex">
        {!hasActivated ? (
          <Image
            src="/logo.png"
            alt="ishaform logo"
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <span
            aria-hidden="true"
            className="block size-[28px] rounded-full bg-neutral-200 dark:bg-neutral-800 ring-1 ring-black/10 dark:ring-white/10 animate-pulse"
          />
        )}
      </span>
      <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        ishaform
      </span>
    </span>
  );
}
