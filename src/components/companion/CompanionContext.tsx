"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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

export type DOMRectLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum CompanionSize {
  Base = "base",
  Medium = "medium",
  Large = "large",
}

export enum CompanionAvatar {
  Logo = "logo",
  AnimeGirl = "anime_girl",
  Mad = "mad",
}

export type CompanionState = {
  isVisible: boolean;
  position: CompanionPosition;
  message: CompanionMessage | null;
  logoRect: DOMRectLike | null;
  hasActivated: boolean; // once true, navbar icon should hide
  avatar: CompanionAvatar; // selected avatar
  isCentered: boolean; // whether overlay should be centered on screen
  size: CompanionSize; // strict sizing mode
  // Previous position/size snapshot for quick backtracking
  lastPosition: CompanionPosition | null;
  lastSize: CompanionSize | null;
};

export type CompanionAPI = {
  show: () => void;
  hide: () => void;
  moveTo: (pos: CompanionPosition) => void;
  say: (text: string, options?: { timeoutMs?: number }) => void;
  setSize: (size: CompanionSize) => void;
  setLogoRect: (rect: DOMRectLike) => void;
  avatar: (a: CompanionAvatar) => void;
  setCentered: (centered: boolean) => void;
  backtrack: () => void;
};

const CompanionStateContext = createContext<CompanionState | undefined>(
  undefined,
);
const CompanionApiContext = createContext<CompanionAPI | undefined>(undefined);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CompanionState>(() => ({
    isVisible: false,
    position: {},
    message: null,
    logoRect: null,
    hasActivated: false,
    avatar: CompanionAvatar.Logo,
    isCentered: false,
    size: CompanionSize.Base,
    lastPosition: null,
    lastSize: null,
  }));

  const show = useCallback(
    () => setState((s) => ({ ...s, isVisible: true, hasActivated: true })),
    [],
  );
  const hide = useCallback(
    () => setState((s) => ({ ...s, isVisible: false })),
    [],
  );
  const moveTo = useCallback((pos: CompanionPosition) => {
    setState((s) => {
      // While centered, ignore move requests entirely to preserve pre-centered snapshot & position
      if (s.isCentered) return s;
      // Deterministic absolute positioning: only allow top/left (ignore right/bottom)
      const normalized: CompanionPosition = {
        top: pos.top,
        left: pos.left,
      };
      return { ...s, lastPosition: { ...s.position }, position: normalized };
    });
  }, []);
  const say = useCallback((text: string, options?: { timeoutMs?: number }) => {
    const id = `${Date.now()}`;
    const message: CompanionMessage = {
      id,
      text,
      timeoutMs: options?.timeoutMs,
    };
    setState((s) => ({ ...s, isVisible: true, hasActivated: true, message }));
    if (options?.timeoutMs && options.timeoutMs > 0) {
      setTimeout(() => {
        setState((s) => (s.message?.id === id ? { ...s, message: null } : s));
      }, options.timeoutMs);
    }
  }, []);

  // No pixel sizing stored in state; size is enum-only

  const setSize = useCallback((size: CompanionSize) => {
    setState((s) => {
      // While centered, don't mutate last size (we want pre-center size kept)
      if (s.isCentered) {
        return { ...s, size, isVisible: true, hasActivated: true };
      }
      // Snapshot current size before applying new
      return {
        ...s,
        lastSize: s.size,
        size,
        isVisible: true,
        hasActivated: true,
      };
    });
  }, []);
  const setLogoRect = useCallback((rect: DOMRectLike) => {
    setState((s) => ({ ...s, logoRect: rect }));
    try {
      localStorage.setItem("companion.logoRect", JSON.stringify(rect));
    } catch {}
  }, []);

  const avatar = useCallback((a: CompanionAvatar) => {
    setState((s) => ({ ...s, avatar: a }));
  }, []);

  const setCentered = useCallback((centered: boolean) => {
    setState((s) => {
      if (centered) {
        const logoPos: CompanionPosition | null = s.logoRect
          ? { top: s.logoRect.y, left: s.logoRect.x }
          : null;
        // Snapshot CURRENT state first (prefer logo when first activating), then center
        const originPosition = !s.hasActivated && logoPos ? logoPos : s.position;
        return {
          ...s,
          isCentered: true,
          lastPosition: originPosition,
          lastSize: s.size,
        };
      }
      return { ...s, isCentered: false };
    });
  }, []);

  // direct pixel sizing is not exposed; use setSize(enum)

  const backtrack = useCallback(() => {
    setState((s) => {
      const fallbackFromLogo: CompanionPosition | null = s.logoRect
        ? { top: s.logoRect.y, left: s.logoRect.x }
        : null;
      if (!s.lastPosition && !s.lastSize && !fallbackFromLogo) return s;
      const prevPosition = s.position;
      const prevSize = s.size;
      const nextSize = s.lastSize ?? s.size;
      const nextPosition = s.lastPosition ?? fallbackFromLogo ?? s.position;
      return {
        ...s,
        isCentered: false, // backtrack exits centered mode
        position: nextPosition,
        size: nextSize,
        lastPosition: prevPosition,
        lastSize: prevSize,
      };
    });
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

  const api = useMemo<CompanionAPI>(
    () => ({
      show,
      hide,
      moveTo,
      say,
      setSize,
      setLogoRect,
      avatar,
      setCentered,
      backtrack,
    }),
    [
      show,
      hide,
      moveTo,
      say,
      setSize,
      setLogoRect,
      avatar,
      setCentered,
      backtrack,
    ],
  );

  return (
    <CompanionApiContext.Provider value={api}>
      <CompanionStateContext.Provider value={state}>
        {children}
      </CompanionStateContext.Provider>
    </CompanionApiContext.Provider>
  );
}

export function useCompanion(): CompanionAPI {
  const ctx = useContext(CompanionApiContext);
  if (!ctx)
    throw new Error("useCompanion must be used within CompanionProvider");
  return ctx;
}

export function useCompanionState(): CompanionState {
  const ctx = useContext(CompanionStateContext);
  if (!ctx)
    throw new Error("useCompanionState must be used within CompanionProvider");
  return ctx;
}
