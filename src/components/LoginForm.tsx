"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const CatClickGameModal = dynamic(() => import("./CatClickGameModal"), { ssr: false });

type FormErrors = {
  email?: string;
  password?: string;
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!email) {
      nextErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Must be at least 6 characters";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // If captcha not passed yet, open cat mini-game instead of submitting
    if (!captchaPassed) {
      setShowCaptcha(true);
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate network request
      await new Promise((r) => setTimeout(r, 800));
      console.log("Login with:", { email, password });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 px-3 py-2 text-neutral-900 dark:text-neutral-100 shadow-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950"
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 px-3 py-2 pr-10 text-neutral-900 dark:text-neutral-100 shadow-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input type="checkbox" className="size-4 rounded border-neutral-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500" />
          Remember me
        </label>
        <a href="#" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400">
          Forgot password?
        </a>
      </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-violet-500/20 transition focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {/* Captcha Modal */}
      <CatClickGameModal
        isOpen={showCaptcha}
        onWin={() => {
          setCaptchaPassed(true);
          setShowCaptcha(false);
          // After passing captcha, auto-submit the form
          // Trigger submission flow
          (async () => {
            try {
              setIsSubmitting(true);
              await new Promise((r) => setTimeout(r, 800));
              console.log("Login with:", { email, password, captcha: "passed" });
            } finally {
              setIsSubmitting(false);
            }
          })();
        }}
        onRequestClose={() => setShowCaptcha(false)}
      />
    </>
  );
}
