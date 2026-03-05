"use client";
import GridMotion from "@/components/GridMotion";
import PictureUpload from "@/components/PictureUpload";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function signupFormAction(
  _state: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      return { success: false, error: errorJson?.message || "Signup failed" };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Signup failed",
    };
  }
}

export default function SignupPage() {
  const [, setPicture] = useState<File | null>(null);
  const [state, formAction, isPending] = useActionState(signupFormAction, {
    success: false,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/login?signup=success");
    }
  }, [state.success, router]);

  return (
    <>
      <GridMotion />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <form
          className="w-[340px] bg-black/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl"
          action={formAction}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-thin tracking-[0.3em] text-white uppercase">
              Pulse
            </h1>
            <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">
              Create your account
            </p>
          </div>

          <PictureUpload onChange={setPicture} />

          <label className="block mb-3">
            <span className="text-white/40 text-[10px] uppercase tracking-[0.15em]">
              Display Name
            </span>
            <input
              name="displayName"
              type="text"
              autoComplete="username"
              required
              className="mt-1.5 block w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all"
            />
          </label>

          <label className="block mb-3">
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
              autoComplete="new-password"
              required
              className="mt-1.5 block w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all"
            />
          </label>

          {state.error && (
            <p className="mb-4 text-xs text-red-400 text-center bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-lg text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-5 text-center text-xs text-white/30">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
