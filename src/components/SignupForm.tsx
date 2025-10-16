"use client";

import { useState } from "react";
import PennStateIdRotaryInput from "./PennStateIdRotaryInput";
import ReverseRevealPasswordInput from "./ReverseRevealPasswordInput";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isValidPennStateId = validatePennStateId(pennStateId);
  const [isRememberMeBlocking, setIsRememberMeBlocking] = useState(false);

  const audioCtxRef = (typeof window !== "undefined" ? (window as any).__ishaformAudioCtxRef : null) as React.MutableRefObject<any> | null;
  if (typeof window !== "undefined" && !(window as any).__ishaformAudioCtxRef) {
    (window as any).__ishaformAudioCtxRef = { current: null };
  }

  function ensureAudioContext(): AudioContext | null {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ref = (window as any).__ishaformAudioCtxRef as { current: AudioContext | null };
      if (!ref.current) ref.current = new AudioCtx();
      // Attempt resume in case it's suspended
      if (ref.current.state === "suspended") ref.current.resume().catch(() => {});
      return ref.current;
    } catch {
      return null;
    }
  }

  function playAlarmSound(ms: number = 3000) {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const duration = Math.max(0.5, ms / 1000);
    const now = ctx.currentTime;

    // Main oscillator with pitch LFO (siren effect)
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(1000, now);

    const lfo = ctx.createOscillator();
    lfo.type = "triangle";
    lfo.frequency.setValueAtTime(2.2, now); // sweep rate
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(400, now); // +/- 400 Hz around base
    lfo.connect(lfoGain).connect(osc.frequency);

    // Gentle highpass to remove rumble, slight lowpass to tame harshness
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(300, now);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(3000, now);

    // Output gain envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.7, now + 0.03);
    gain.gain.setValueAtTime(0.7, now + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Light compression for consistent loudness
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-24, now);
    comp.knee.setValueAtTime(18, now);
    comp.ratio.setValueAtTime(8, now);
    comp.attack.setValueAtTime(0.003, now);
    comp.release.setValueAtTime(0.2, now);

    osc.connect(hp).connect(lp).connect(gain).connect(comp).connect(ctx.destination);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + duration);
    lfo.stop(now + duration);
  }

  function handleRememberMeClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (isRememberMeBlocking) return;
    playAlarmSound(3000);
    setIsRememberMeBlocking(true);
    setTimeout(() => setIsRememberMeBlocking(false), 3000);
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

    try {
      setIsSubmitting(true);
      // Simulate network request
      await new Promise((r) => setTimeout(r, 800));
      console.log("Signup with:", { pennStateId, password });
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.pennStateId}
          </p>
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
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleRememberMeClick}
          aria-pressed={isRememberMeBlocking}
          className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 select-none"
        >
          <span
            aria-hidden="true"
            className="grid place-items-center size-4 rounded border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/60"
          >
            {isRememberMeBlocking ? (
              <span className="block size-2 rounded-full bg-violet-600" />
            ) : null}
          </span>
          Remember me
        </button>
        <a
          href="#"
          className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-violet-500/20 transition focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950 disabled:opacity-60"
      >
        {isSubmitting ? "Signing up…" : "Sign up"}
      </button>

      {isRememberMeBlocking ? (
        <div className="absolute inset-0 z-[60] rounded-2xl pointer-events-auto grid place-items-center overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-red-600/30 animate-pulse" />
          <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-sm" />
          <div className="relative size-12 rounded-full border-4 border-white/60 border-t-transparent animate-spin" />
        </div>
      ) : null}
    </form>
  );
}
