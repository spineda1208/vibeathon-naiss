"use client";

import React from "react";

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

  // Treat input as read-only and handle key events to build reversed state
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return; // allow shortcuts
    const key = e.key;
    if (key === "Backspace") {
      e.preventDefault();
      onChange(value.slice(1)); // remove most-recent typed (front of reversed string)
      setShow(true);
      return;
    }
    if (key.length === 1) {
      e.preventDefault();
      onChange(key + value); // prepend to reversed string
      setShow(true);
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    const reversed = text.split("").reverse().join("");
    onChange(reversed + value);
    setShow(true);
  };

  return (
    <div className="mt-1 relative">
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        autoComplete="current-password"
        required
        value={value}
        onChange={() => { /* controlled via key handlers */ }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        readOnly
        className={
          className ??
          "w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 px-3 py-2 pr-10 text-neutral-900 dark:text-neutral-100 shadow-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950"
        }
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
