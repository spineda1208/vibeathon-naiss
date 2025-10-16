"use client";

import React from "react";
import { useCompanion, useCompanionState } from "./CompanionContext";

// Anchors the companion to a DOM element's top-right corner
export default function CompanionAnchor({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const companion = useCompanion();
  const { isVisible } = useCompanionState();
  const initializedRef = React.useRef(false);

  const updatePosition = React.useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const top = Math.max(0, r.top + window.scrollY - 0);
    const left = Math.max(0, r.right + window.scrollX - 0);
    // Position via right/bottom isn't ideal when anchoring; use absolute top/left
    companion.moveTo({ top, left });
  }, [companion]);

  React.useEffect(() => {
    if (!isVisible) return; // only anchor when companion is visible
    initializedRef.current = false; // skip the very first callback after (re)mount
    const onResize = () => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        return; // ignore first invocation to avoid page-load reposition
      }
      updatePosition();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true } as any);
    const ro = new ResizeObserver(onResize);
    if (ref.current) ro.observe(ref.current);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize as any);
      ro.disconnect();
    };
  }, [isVisible, updatePosition]);

  return (
    <div ref={ref} className="relative" data-companion-anchor>
      {children}
    </div>
  );
}
