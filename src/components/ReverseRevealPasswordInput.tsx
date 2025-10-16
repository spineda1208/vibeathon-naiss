"use client";

import React from "react";
import { useCompanion } from "./companion/CompanionContext";

type ReverseRevealPasswordInputProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
};

export default function ReverseRevealPasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  className,
}: ReverseRevealPasswordInputProps) {
  const [show, setShow] = React.useState(false);
  const companion = useCompanion();
  const sinceToggleRef = React.useRef(0);
  const [oopsMode, setOopsMode] = React.useState(false);
  const oopsTimeoutRef = React.useRef<number | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const laughThresholdRef = React.useRef<number>(
    Math.floor(3 + Math.random() * 5),
  ); // 3-7
  const laughCountRef = React.useRef<number>(0);

  const triggerOops = () => {
    setOopsMode(true);
    if (oopsTimeoutRef.current) window.clearTimeout(oopsTimeoutRef.current);
    oopsTimeoutRef.current = window.setTimeout(() => setOopsMode(false), 2000);
  };

  React.useEffect(
    () => () => {
      if (oopsTimeoutRef.current) window.clearTimeout(oopsTimeoutRef.current);
    },
    [],
  );

  const positionCompanionLeftOfField = React.useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const anchor = (el.closest('[data-companion-anchor]') as HTMLElement | null) ?? el;
    const r = anchor.getBoundingClientRect();
    const top = r.top + window.scrollY; // align to top of card area
    const left = Math.max(8, r.left + window.scrollX - 140); // shift further left to avoid overlap
    companion.moveTo({ top, left });
  }, [companion]);

  const resetLaughPlan = React.useCallback(() => {
    laughCountRef.current = 0;
    laughThresholdRef.current = Math.floor(3 + Math.random() * 5); // 3-7
  }, []);

  const bumpToggle = (delta: number) => {
    sinceToggleRef.current += delta;
    while (sinceToggleRef.current >= 2) {
      setShow((s) => !s);
      sinceToggleRef.current -= 2;
    }
  };

  // Treat input as read-only and handle key events to build reversed state
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return; // allow shortcuts
    const key = e.key;
    if (key === "Backspace") {
      e.preventDefault();
      onChange(value.slice(1)); // remove most-recent typed (front of reversed string)
      return;
    }
    if (key.length === 1) {
      e.preventDefault();
      onChange(key + value); // prepend to reversed string
      bumpToggle(1);
      // count toward laugh
      laughCountRef.current += 1;
      if (laughCountRef.current >= laughThresholdRef.current) {
        companion.say("Hahaha!", { timeoutMs: 1200 });
        resetLaughPlan();
      }
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    const reversed = text.split("").reverse().join("");
    onChange(reversed + value);
    bumpToggle(text.length || 1);
    laughCountRef.current += text.length || 1;
    if (laughCountRef.current >= laughThresholdRef.current) {
      companion.say("Hahaha!", { timeoutMs: 1200 });
      resetLaughPlan();
    }
  };

  const handleShowShuffle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const len = Math.max(1, value.length);
    let next = "";
    for (let i = 0; i < len; i++) {
      next += charset[Math.floor(Math.random() * charset.length)];
    }
    // store reversed as state (since component stores reversed string)
    onChange(next);
    setShow(true);
    companion.say("Oops my bad", { timeoutMs: 1500 });
    triggerOops();
  };

  return (
    <div className="mt-1 relative" ref={wrapperRef}>
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        autoComplete="current-password"
        required
        value={value}
        onChange={() => {
          /* controlled via key handlers */
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => {
          positionCompanionLeftOfField();
          companion.enlarge();
          companion.show();
          companion.say("Try putting in the password 'password123'", {
            timeoutMs: 2500,
          });
          resetLaughPlan();
        }}
        readOnly
        className={
          className ??
          "w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 px-3 py-2 pr-10 text-neutral-900 dark:text-neutral-100 shadow-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950"
        }
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={handleShowShuffle}
        className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        {oopsMode ? "Oops my bad" : "Show"}
      </button>
    </div>
  );
}
