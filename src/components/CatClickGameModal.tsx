"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./CatClickGameModal.module.css";

type Cat = {
  id: number;
  x: number; // left position in px
  y: number; // top position in px
  popping?: boolean;
};

type CatClickGameModalProps = {
  isOpen: boolean;
  onWin: () => void;
  onRequestClose?: () => void; // Only relevant after win
};

const INITIAL_CATS = 17;
const SPAWN_INTERVAL_MS = 2000;
const MAX_CATS = 100;
const CAT_SIZE = 40; // matches CSS .cat width/height

export default function CatClickGameModal({ isOpen, onWin, onRequestClose }: CatClickGameModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const spawnIntervalRef = useRef<number | null>(null);
  const moveIntervalRef = useRef<number | null>(null);
  const idCounterRef = useRef<number>(1);
  const hasWonRef = useRef<boolean>(false);
  const startedRef = useRef<boolean>(false);
  const [winVisible, setWinVisible] = useState(false);
  const winTimeoutRef = useRef<number | null>(null);

  const [cats, setCats] = useState<Cat[]>([]);
  const [dims, setDims] = useState<{ width: number; height: number }>({ width: 640, height: 360 });

  const clearSpawnInterval = useCallback(() => {
    if (spawnIntervalRef.current != null) {
      window.clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
  }, []);

  const clearMoveInterval = useCallback(() => {
    if (moveIntervalRef.current != null) {
      window.clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  const clearWinTimeout = useCallback(() => {
    if (winTimeoutRef.current != null) {
      window.clearTimeout(winTimeoutRef.current);
      winTimeoutRef.current = null;
    }
  }, []);

  const measure = useCallback(() => {
    const el = playAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDims({ width: rect.width, height: rect.height });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    if (playAreaRef.current) ro.observe(playAreaRef.current);
    return () => {
      ro.disconnect();
    };
  }, [isOpen, measure]);

  const placeRandomCat = useCallback((): Cat => {
    const id = idCounterRef.current++;
    const maxX = Math.max(0, dims.width - CAT_SIZE);
    const maxY = Math.max(0, dims.height - CAT_SIZE);
    const x = Math.floor(Math.random() * (maxX + 1));
    const y = Math.floor(Math.random() * (maxY + 1));
    return { id, x, y };
  }, [dims.width, dims.height]);

  const spawnOne = useCallback(() => {
    setCats((prev) => {
      if (prev.length >= MAX_CATS) return prev;
      return [...prev, placeRandomCat()];
    });
  }, [placeRandomCat]);

  const startGame = useCallback(() => {
    hasWonRef.current = false;
    startedRef.current = false;
    setWinVisible(false);
    setCats(() => Array.from({ length: INITIAL_CATS }, () => placeRandomCat()));
    // Mark started immediately after initial spawn
    startedRef.current = true;
    clearSpawnInterval();
    spawnIntervalRef.current = window.setInterval(() => {
      if (!hasWonRef.current) spawnOne();
    }, SPAWN_INTERVAL_MS);

    // Movement loop: every 3s, move all cats to new random positions; CSS animates over 1s
    clearMoveInterval();
    moveIntervalRef.current = window.setInterval(() => {
      setCats((prev) =>
        prev.map((c) => {
          const maxX = Math.max(0, dims.width - CAT_SIZE);
          const maxY = Math.max(0, dims.height - CAT_SIZE);
          const x = Math.floor(Math.random() * (maxX + 1));
          const y = Math.floor(Math.random() * (maxY + 1));
          return { ...c, x, y };
        })
      );
    }, 5000);
  }, [clearSpawnInterval, placeRandomCat, spawnOne]);

  const endGameWin = useCallback(() => {
    if (hasWonRef.current) return;
    hasWonRef.current = true;
    clearSpawnInterval();
    clearMoveInterval();
    setWinVisible(true);
    clearWinTimeout();
    winTimeoutRef.current = window.setTimeout(() => {
      onWin();
    }, 3000);
  }, [clearSpawnInterval, clearMoveInterval, clearWinTimeout, onWin]);

  // Open/close lifecycle
  useEffect(() => {
    if (isOpen) {
      // Delay start until next frame so layout is measured
      const raf = requestAnimationFrame(() => startGame());
      // Focus trap entry
      const toFocus = dialogRef.current;
      if (toFocus) {
        toFocus.focus();
      }
      // Lock background scroll while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = originalOverflow;
      };
    } else {
      clearSpawnInterval();
      clearMoveInterval();
      clearWinTimeout();
      startedRef.current = false;
      setCats([]);
      // Ensure scroll restored
      document.body.style.overflow = "";
    }
  }, [isOpen, startGame, clearSpawnInterval, clearMoveInterval, clearWinTimeout]);

  // Win detection: if cats reach zero at any time, win immediately
  useEffect(() => {
    if (!isOpen || !startedRef.current) return;
    if (cats.length === 0) {
      endGameWin();
    }
  }, [cats.length, endGameWin, isOpen]);

  const onCatClick = useCallback((id: number) => {
    setCats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) return;
      // Prevent ESC until win (parent can pass onRequestClose after win)
      if (e.key === "Escape") {
        e.preventDefault();
        if (hasWonRef.current && onRequestClose) onRequestClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Simple focus trap: keep focus within dialog
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (current === first || current === dialog) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, onRequestClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-hidden={!isOpen}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-game-title"
        className={styles.modal}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          <h2 id="cat-game-title" className={styles.title}>Click on all the cats to continue</h2>
          <p className={styles.instructions}>Clear the play area completely. New cats appear every 2 seconds.</p>
        </div>
        <div ref={playAreaRef} className={styles.playArea}>
          {cats.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.cat} ${styles.idleMotion}`}
              style={{ left: `${cat.x}px`, top: `${cat.y}px` }}
              onClick={() => onCatClick(cat.id)}
              aria-label="cat"
            >
              <img src="/cat-chibi.svg" alt="chibi cat" className={styles.catImg} />
            </button>
          ))}
          {winVisible ? (
            <div className={styles.winOverlay} aria-live="polite">
              <div className={styles.winText}>YOU PASS!</div>
            </div>
          ) : null}
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.button}
            disabled
            aria-disabled
            title="Clear all cats to continue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}


