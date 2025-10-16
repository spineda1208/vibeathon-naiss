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

export type CompanionState = {
  isVisible: boolean;
  position: CompanionPosition;
  message: CompanionMessage | null;
  isLarge: boolean; // when "comes to life"
  logoRect: DOMRectLike | null;
  hasActivated: boolean; // once true, navbar icon should hide
  avatarSrc: string; // image used by overlay
  isCentered: boolean; // whether overlay should be centered on screen
  sizePx: number | null; // explicit pixel size override
  saved: {
    position: CompanionPosition;
    isCentered: boolean;
    sizePx: number | null;
    avatarSrc: string;
    isLarge: boolean;
  } | null;
};

export type CompanionAPI = {
  show: () => void;
  hide: () => void;
  moveTo: (pos: CompanionPosition) => void;
  say: (text: string, options?: { timeoutMs?: number }) => void;
  enlarge: () => void;
  resetSize: () => void;
  setLogoRect: (rect: DOMRectLike) => void;
  setAvatarSrc: (src: string) => void;
  setCentered: (centered: boolean) => void;
  setSizePx: (px: number) => void;
  clearSizePx: () => void;
  saveState: () => void;
  restoreState: () => void;
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
    isLarge: false,
    logoRect: null,
    hasActivated: false,
    avatarSrc: "/logo.png",
    isCentered: false,
    sizePx: null,
    saved: null,
  }));

  const show = useCallback(
    () => setState((s) => ({ ...s, isVisible: true, hasActivated: true })),
    [],
  );
  const hide = useCallback(
    () => setState((s) => ({ ...s, isVisible: false })),
    [],
  );
  const moveTo = useCallback(
    (pos: CompanionPosition) => setState((s) => ({ ...s, position: pos })),
    [],
  );
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
  const enlarge = useCallback(
    () => setState((s) => ({ ...s, isLarge: true, isVisible: true, hasActivated: true })),
    [],
  );
  const resetSize = useCallback(
    () => setState((s) => ({ ...s, isLarge: false })),
    [],
  );
  const setLogoRect = useCallback((rect: DOMRectLike) => {
    setState((s) => ({ ...s, logoRect: rect }));
    try {
      localStorage.setItem("companion.logoRect", JSON.stringify(rect));
    } catch {}
  }, []);

  const setAvatarSrc = useCallback((src: string) => {
    setState((s) => ({ ...s, avatarSrc: src }));
  }, []);

  const setCentered = useCallback((centered: boolean) => {
    setState((s) => ({ ...s, isCentered: centered }));
  }, []);

  const setSizePx = useCallback((px: number) => {
    setState((s) => ({ ...s, sizePx: Math.max(1, Math.floor(px)) }));
  }, []);

  const clearSizePx = useCallback(() => {
    setState((s) => ({ ...s, sizePx: null }));
  }, []);

  const saveState = useCallback(() => {
    setState((s) => ({
      ...s,
      saved: {
        position: { ...s.position },
        isCentered: s.isCentered,
        sizePx: s.sizePx,
        avatarSrc: s.avatarSrc,
        isLarge: s.isLarge,
      },
    }));
  }, []);

  const restoreState = useCallback(() => {
    setState((s) => {
      if (!s.saved) return s;
      const next = {
        ...s,
        position: { ...s.saved.position },
        isCentered: s.saved.isCentered,
        sizePx: s.saved.sizePx,
        avatarSrc: s.saved.avatarSrc,
        isLarge: s.saved.isLarge,
        saved: null,
      };
      return next;
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
      enlarge,
      resetSize,
      setLogoRect,
      setAvatarSrc,
      setCentered,
      setSizePx,
      clearSizePx,
      saveState,
      restoreState,
    }),
    [show, hide, moveTo, say, enlarge, resetSize, setLogoRect, setAvatarSrc, setCentered, setSizePx, clearSizePx, saveState, restoreState],
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
