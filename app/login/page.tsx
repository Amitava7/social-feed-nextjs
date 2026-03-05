"use client";

import GridMotion from "@/components/GridMotion";
import SignupSuccessToast from "@/components/SignupSuccessToast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, Suspense } from "react";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Login failed. Please try again.");
        return;
      }

      router.push("/feed");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <form
        className="w-[340px] bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-thin tracking-[0.3em] text-white uppercase">
            Pulse
          </h1>
          <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">
            Sign in to continue
          </p>
        </div>

        <label className="block mb-4">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.15em]">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1.5 block w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all"
          />
        </label>

        <label className="block mb-6">
          <span className="text-white/40 text-[10px] uppercase tracking-[0.15em]">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1.5 block w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all"
          />
        </label>

        {error && (
          <p className="mb-4 text-xs text-red-400 text-center bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-lg text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-5 text-center text-xs text-white/30">
          New here?{" "}
          <Link
            href="/signup"
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Suspense>
        <SignupSuccessToast />
      </Suspense>
      <GridMotion />
      <LoginForm />
    </>
  );
}
