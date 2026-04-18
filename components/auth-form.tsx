"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        name: mode === "register" ? String(formData.get("name") || "") : undefined,
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      };

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Something went wrong.");
        return;
      }

      toast.success(mode === "login" ? "Welcome back." : "Account created.");
      router.push("/drive");
      router.refresh();
    } catch {
      toast.error("Unable to reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass w-full max-w-md rounded-[2rem] p-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">
          {mode === "login" ? "Sign in" : "Create account"}
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {mode === "login" ? "Step back into your workspace." : "Start your private Drive."}
        </h1>
        <p className="text-sm leading-7 text-slate-300">
          {mode === "login"
            ? "Use your account to open the Neon-backed dashboard."
            : "This single-repo starter is ready for Vercel and Neon from day one."}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {mode === "register" ? (
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Full name</span>
            <input
              name="name"
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
              placeholder="Dobby Developer"
            />
          </label>
        ) : null}
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            placeholder="you@example.com"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            placeholder="At least 8 characters"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p className="mt-6 text-center text-sm text-slate-400">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="text-emerald-300 transition hover:text-emerald-200"
        >
          {mode === "login" ? "Register" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
