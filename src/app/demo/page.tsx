import SignupForm from "@/components/signup-form";
import Link from "next/link"; // eslint-disable-line @typescript-eslint/no-unused-vars

export const metadata = {
  title: "ishaform — Demo Signup",
  description: "Demo of the ironically bad signup form.",
};

export default function DemoPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            the best auth form
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">because who needs clerk</p>
        </div>

        <div className="relative rounded-2xl border border-black/10 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-neutral-900/70">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"></p>
      </div>
    </main>
  );
}
