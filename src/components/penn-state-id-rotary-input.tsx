"use client";

import React from "react";
import { CompanionSize, useCompanion } from "@/components/companion/companion-context";
import { positionRightOf } from "@/components/companion/positioning";

type PennStateIdRotaryInputProps = {
  value: string;
  onChange: (next: string) => void;
  length?: number; // number of positions to control; default 7
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
};

const CHARSET = "abcdefghijklmnopqrstuvwxyz1234567890 ";

function cycleChar(current: string): string {
  const idx = CHARSET.indexOf(current);
  if (idx === -1) return CHARSET[0];
  const nextIdx = (idx + 1) % CHARSET.length;
  return CHARSET[nextIdx];
}

function normalizeToLength(input: string, length: number): string {
  if (input.length === length) return input;
  if (input.length > length) return input.slice(0, length);
  return input.padEnd(length, " ");
}

export default function PennStateIdRotaryInput({
  value,
  onChange,
  length = 7,
  className,
  placeholder,
  "aria-label": ariaLabel,
}: PennStateIdRotaryInputProps) {
  const normalizedValue = normalizeToLength(value ?? "", length);
  const companion = useCompanion();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const lastCaretPosRef = React.useRef<number | null>(null);

  // Position companion to the RIGHT of the input, vertically centered next to the input line
  const positionCompanionRightOfInput = React.useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const { top, left } = positionRightOf(el, { margin: 8, referenceSizePx: 28 });
    companion.moveTo({ top, left });
    companion.setSize(CompanionSize.Medium);
  }, [companion]);

  const moveToAnchorTopRight = React.useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const anchor =
      (el.closest("[data-companion-anchor]") as HTMLElement | null) ?? el.parentElement;
    const r = (anchor ?? el).getBoundingClientRect();
    const top = r.top + window.scrollY;
    const left = r.right + window.scrollX;
    companion.moveTo({ top, left });
  }, [companion]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    // Only respond to numeric keys 1..7
    if (key < "1" || key > "7") return;

    event.preventDefault();
    const position = Number(key) - 1; // 0-based index

    let chars = normalizedValue.split("");
    const currentChar = chars[position] ?? " ";
    chars[position] = cycleChar(currentChar);
    onChange(chars.join(""));

    // Trigger companion behaviors
    companion.setSize(CompanionSize.Medium);
    companion.show();
    companion.say(`Oh? Tapping ${key}? Let's make this truly inconvenient…`, {
      timeoutMs: 2500,
    });

    // Remember caret target so it sits in front of the last-updated character
    lastCaretPosRef.current = position; // caret before character at index
    // Ensure focus stays so the caret is visible
    inputRef.current?.focus();
  };

  // After value updates, move the caret to the remembered position
  React.useLayoutEffect(() => {
    if (lastCaretPosRef.current == null) return;
    const el = inputRef.current;
    if (!el) return;
    const pos = Math.max(0, Math.min(normalizedValue.length, lastCaretPosRef.current)) + 1;
    try {
      el.setSelectionRange(pos, pos);
    } catch {}
  }, [normalizedValue]);

  return (
    <input
      type="text"
      inputMode="none"
      onFocus={() => {
        positionCompanionRightOfInput();
        companion.setSize(CompanionSize.Medium);
        companion.show();
      }}
      ref={inputRef}
      value={normalizedValue}
      onKeyDown={handleKeyDown}
      onChange={() => {
        /* ignore direct typing */
      }}
      readOnly
      className={
        className ??
        "mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-offset-neutral-950"
      }
      placeholder={placeholder ?? "Use keys 1-7 to cycle"}
      aria-label={ariaLabel ?? "Penn State ID Rotary Input"}
    />
  );
}
