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
  sizePx: number | null; // resolved pixel width for rendering
  // Previous position/size snapshot for quick backtracking
  lastPosition: CompanionPosition | null;
  lastSizePx: number | null;
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
    position: { right: 24, bottom: 24 },
    message: null,
    logoRect: null,
    hasActivated: false,
    avatar: CompanionAvatar.Logo,
    isCentered: false,
    size: CompanionSize.Base,
    sizePx: null,
    lastPosition: null,
    lastSizePx: null,
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
    setState((s) => ({
      ...s,
      lastPosition: { ...s.position },
      lastSizePx: s.sizePx,
      position: pos,
    }));
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

  const resolveSizePx = useCallback(
    (size: CompanionSize, logoRect: DOMRectLike | null) => {
      const base = Math.max(1, Math.floor(logoRect?.width ?? 28));
      if (size === CompanionSize.Base) return base;
      if (size === CompanionSize.Medium)
        return Math.max(1, Math.floor(base * 2));
      // Large: fixed multiple of base (no viewport usage)
      return Math.max(1, Math.floor(base * 8));
    },
    [],
  );

  const setSize = useCallback(
    (size: CompanionSize) => {
      setState((s) => ({
        ...s,
        size,
        lastSizePx: s.sizePx,
        sizePx: resolveSizePx(size, s.logoRect),
        isVisible: true,
        hasActivated: true,
      }));
    },
    [resolveSizePx],
  );
  const setLogoRect = useCallback(
    (rect: DOMRectLike) => {
      setState((s) => {
        // If size is Base or Medium, recompute sizePx from new logoRect
        const shouldRecompute = s.size !== CompanionSize.Large;
        return {
          ...s,
          logoRect: rect,
          sizePx: shouldRecompute ? resolveSizePx(s.size, rect) : s.sizePx,
        };
      });
      try {
        localStorage.setItem("companion.logoRect", JSON.stringify(rect));
      } catch {}
    },
    [resolveSizePx],
  );

  const avatar = useCallback((a: CompanionAvatar) => {
    setState((s) => ({ ...s, avatar: a }));
  }, []);

  const setCentered = useCallback((centered: boolean) => {
    setState((s) => ({ ...s, isCentered: centered }));
  }, []);

  // direct pixel sizing is not exposed; use setSize(enum)

  const backtrack = useCallback(() => {
    setState((s) => {
      if (!s.lastPosition && s.lastSizePx == null) return s;
      const prevPosition = s.position;
      const prevSizePx = s.sizePx;
      return {
        ...s,
        position: s.lastPosition ?? s.position,
        sizePx: s.lastSizePx ?? s.sizePx,
        lastPosition: prevPosition,
        lastSizePx: prevSizePx,
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
          setState((s) => ({
            ...s,
            logoRect: parsed,
            sizePx: s.sizePx ?? resolveSizePx(s.size, parsed),
          }));
        }
      }
    } catch {}
  }, [resolveSizePx]);

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
