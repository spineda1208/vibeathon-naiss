"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CompanionMessage = {
  id: string;
  text: string;
  timeoutMs?: number;
};

export type CompanionPosition = {
  // viewport-based positioning
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export type DOMRectLike = { x: number; y: number; width: number; height: number };

export type CompanionState = {
  isVisible: boolean;
  position: CompanionPosition;
  message: CompanionMessage | null;
  isLarge: boolean; // when "comes to life"
  logoRect: DOMRectLike | null;
};

export type CompanionAPI = {
  show: () => void;
  hide: () => void;
  moveTo: (pos: CompanionPosition) => void;
  say: (text: string, options?: { timeoutMs?: number }) => void;
  enlarge: () => void;
  resetSize: () => void;
  setLogoRect: (rect: DOMRectLike) => void;
};

const CompanionStateContext = createContext<CompanionState | undefined>(undefined);
const CompanionApiContext = createContext<CompanionAPI | undefined>(undefined);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CompanionState>(() => ({
    isVisible: false,
    position: { right: 24, bottom: 24 },
    message: null,
    isLarge: false,
    logoRect: null,
  }));

  const show = useCallback(() => setState((s) => ({ ...s, isVisible: true })), []);
  const hide = useCallback(() => setState((s) => ({ ...s, isVisible: false })), []);
  const moveTo = useCallback((pos: CompanionPosition) => setState((s) => ({ ...s, position: pos })), []);
  const say = useCallback((text: string, options?: { timeoutMs?: number }) => {
    const id = `${Date.now()}`;
    const message: CompanionMessage = { id, text, timeoutMs: options?.timeoutMs };
    setState((s) => ({ ...s, isVisible: true, message }));
    if (options?.timeoutMs && options.timeoutMs > 0) {
      setTimeout(() => {
        setState((s) => (s.message?.id === id ? { ...s, message: null } : s));
      }, options.timeoutMs);
    }
  }, []);
  const enlarge = useCallback(() => setState((s) => ({ ...s, isLarge: true, isVisible: true })), []);
  const resetSize = useCallback(() => setState((s) => ({ ...s, isLarge: false })), []);
  const setLogoRect = useCallback((rect: DOMRectLike) => {
    setState((s) => ({ ...s, logoRect: rect }));
    try {
      localStorage.setItem("companion.logoRect", JSON.stringify(rect));
    } catch {}
  }, []);

  // on mount: hydrate logoRect from localStorage (useful if navigating directly to /demo)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("companion.logoRect");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.x === "number" &&
          typeof parsed.y === "number" &&
          typeof parsed.width === "number" &&
          typeof parsed.height === "number"
        ) {
          setState((s) => ({ ...s, logoRect: parsed }));
        }
      }
    } catch {}
  }, []);

  const api = useMemo<CompanionAPI>(() => ({ show, hide, moveTo, say, enlarge, resetSize, setLogoRect }), [show, hide, moveTo, say, enlarge, resetSize, setLogoRect]);

  return (
    <CompanionApiContext.Provider value={api}>
      <CompanionStateContext.Provider value={state}>{children}</CompanionStateContext.Provider>
    </CompanionApiContext.Provider>
  );
}

export function useCompanion(): CompanionAPI {
  const ctx = useContext(CompanionApiContext);
  if (!ctx) throw new Error("useCompanion must be used within CompanionProvider");
  return ctx;
}

export function useCompanionState(): CompanionState {
  const ctx = useContext(CompanionStateContext);
  if (!ctx) throw new Error("useCompanionState must be used within CompanionProvider");
  return ctx;
}
