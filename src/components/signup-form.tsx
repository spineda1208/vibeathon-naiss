"use client";

import { useState } from "react";
import Link from "next/link";
import CaptchaGate from "@/components/captcha/captcha-gate";
import {
  CompanionAvatar,
  CompanionSize,
  useCompanion,
} from "@/components/companion/companion-context";
import PennStateIdRotaryInput from "@/components/penn-state-id-rotary-input";
import ReverseRevealPasswordInput from "@/components/reverse-reveal-password-input";

type FormErrors = {
  pennStateId?: string;
  password?: string;
};

function validatePennStateId(pennStateId: string): boolean {
  const compact = (pennStateId ?? "").replace(/\s/g, "");
  return /^[A-Za-z]{3}\d{4}$/.test(compact);
}

export default function SignupForm() {
  const [pennStateId, setPennStateId] = useState("       ");
  const [password, setPassword] = useState("");
  const [_showPassword, _setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isValidPennStateId = validatePennStateId(pennStateId);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isValidPennStateId && isPasswordValid;
  const [isRememberMeBlocking, setIsRememberMeBlocking] = useState(false);
  const [showCaptchaGate, setShowCaptchaGate] = useState(false);
  const companion = useCompanion();

  // Global singleton AudioContext stored on window
  type AudioCtxRef = { current: (AudioContext & { resume: () => Promise<void> }) | null };
  const _audioCtxRef: AudioCtxRef | null =
    typeof window !== "undefined" ? ((window as any).__ishaformAudioCtxRef as AudioCtxRef) : null;
  if (typeof window !== "undefined" && !(window as any).__ishaformAudioCtxRef) {
    (window as any).__ishaformAudioCtxRef = { current: null } as AudioCtxRef;
  }

  function ensureAudioContext(): AudioContext | null {
    try {
      const AudioCtx: { new (): AudioContext } =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      const ref = (window as any).__ishaformAudioCtxRef as AudioCtxRef;
      if (!ref.current) ref.current = new AudioCtx();
      // Attempt resume in case it's suspended
      if (ref.current && ref.current.state === "suspended") ref.current.resume().catch(() => {});
      return ref.current;
    } catch {
      return null;
    }
  }

  async function playAlarmSoundFromFile() {
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const res = await fetch("/remember-alarm.m4a", { cache: "force-cache" });
      const arrayBuf = await res.arrayBuffer();
      const audioBuf = await ctx.decodeAudioData(arrayBuf.slice(0));
      const src = ctx.createBufferSource();
      src.buffer = audioBuf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.0, ctx.currentTime);
      src.connect(gain).connect(ctx.destination);
      src.start();
    } catch {}
  }

  function handleRememberMeClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (isRememberMeBlocking) return;
    playAlarmSoundFromFile();
    // Companion: switch to anime girl, center and enlarge
    companion.avatar(CompanionAvatar.AnimeGirl);
    companion.setCentered(true);
    companion.setSize(CompanionSize.Large);
    companion.show();
    setIsRememberMeBlocking(true);
    setTimeout(() => {
      setIsRememberMeBlocking(false);
      // Revert centered/avatar explicitly; backtrack position/size
      companion.setCentered(false);
      companion.avatar(CompanionAvatar.Logo);
      companion.backtrack();
    }, 3000);
  }

  const pennStateIdInputClass = [
    "mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 px-3 py-2 text-neutral-900 dark:text-neutral-100 shadow-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950",
    isValidPennStateId
      ? "border-green-500 dark:border-green-400 focus:ring-green-500/60"
      : "border-red-500 dark:border-red-400 focus:ring-red-500/60",
  ].join(" ");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!pennStateId.trim()) {
      nextErrors.pennStateId = "Penn State ID is required";
    } else if (!validatePennStateId(pennStateId)) {
      nextErrors.pennStateId = "Format must be AAA1234 (3 letters + 4 digits)";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Must be at least 6 characters";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Loading state then show captcha gate skeleton
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowCaptchaGate(true);
    }, 800);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 font-mono"
      onFocus={() => {
        /* ensure companion shows near card when any input focused */
      }}
    >
      <div>
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Penn State ID
        </label>
        <PennStateIdRotaryInput
          value={pennStateId}
          onChange={setPennStateId}
          length={7}
          className={pennStateIdInputClass}
          placeholder="Use keys 1-7 to cycle each position"
          aria-label="Penn State ID"
        />
        {errors.pennStateId ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.pennStateId}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
        >
          Password
        </label>
        <ReverseRevealPasswordInput value={password} onChange={setPassword} />
        {errors.password ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleRememberMeClick}
          aria-pressed={isRememberMeBlocking}
          className="inline-flex items-center gap-2 text-sm text-neutral-700 select-none dark:text-neutral-300"
        >
          <span
            aria-hidden="true"
            className="grid size-4 place-items-center rounded border border-neutral-300 bg-white/80 dark:border-neutral-700 dark:bg-neutral-900/60"
          >
            {isRememberMeBlocking ? (
              <span className="block size-2 rounded-full bg-violet-600" />
            ) : null}
          </span>
          Remember me
        </button>
        <Link
          href="#"
          className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isFormValid}
        aria-busy={isSubmitting}
        className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-violet-500/20 transition focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:cursor-not-allowed disabled:from-neutral-400 disabled:via-neutral-400 disabled:to-neutral-400 disabled:opacity-60 dark:focus:ring-offset-neutral-950"
      >
        {isSubmitting ? (
          <>
            <span className="relative grid place-items-center">
              <span className="size-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            </span>
            Signing up…
          </>
        ) : (
          "Sign up"
        )}
      </button>

      {isRememberMeBlocking ? (
        <div className="pointer-events-auto absolute inset-0 z-[60] grid place-items-center overflow-hidden rounded-2xl">
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-red-600/30" />
          <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-sm" />
          <div className="relative size-12 animate-spin rounded-full border-4 border-white/60 border-t-transparent" />
        </div>
      ) : null}

      {showCaptchaGate ? (
        <CaptchaGate
          onClose={() => setShowCaptchaGate(false)}
          onPassed={() => {
            setShowCaptchaGate(false);
            // TODO: proceed with actual signup flow
          }}
        />
      ) : null}
    </form>
  );
}
