export const metadata = {
  title: "ishaform — Worst Auth Landing",
  description: "An ironically over-the-top landing for the worst auth form.",
};

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-sm backdrop-blur">
          Introducing: The Internet’s Worst Auth
        </div>
        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Auth so bad, it’s beautiful.
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Experience the pinnacle of questionable UX. Password toggles that
          taunt you. Validation that judges you. Pixels that sigh audibly.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="/demo"
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-3 font-medium shadow-lg shadow-neutral-900/10 hover:opacity-90"
          >
            Try the Worst Auth Form
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 px-5 py-3 font-medium text-neutral-800 dark:text-neutral-200 hover:bg-white/90 dark:hover:bg-neutral-900/80"
          >
            Why is it so bad?
          </a>
        </div>
      </div>

      <section
        id="features"
        className="mx-auto mt-20 max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 p-6 backdrop-blur">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Aggressively Mid UX
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Buttons that are almost the right size. Almost.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 p-6 backdrop-blur">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Chaotic Validation
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Rules that feel personal. Because they are.
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 p-6 backdrop-blur">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Aesthetic Regret
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Gradients so dramatic they deserve a podcast.
          </p>
        </div>
      </section>
    </main>
  );
}
