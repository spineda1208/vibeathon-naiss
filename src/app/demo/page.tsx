import SignupForm from "../../components/SignupForm";
import CompanionAnchor from "../../components/companion/CompanionAnchor";

export const metadata = {
  title: "ishaform — Demo Signup",
  description: "Demo of the ironically bad signup form.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            The Worst Auth Form
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Please don’t enjoy this.
          </p>
        </div>

        <CompanionAnchor>
          <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-6 shadow-xl">
            <SignupForm />
          </div>
        </CompanionAnchor>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Regret this experience?{" "}
          <a
            href="/"
            className="font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            Return home
          </a>
        </p>
      </div>
    </main>
  );
}
