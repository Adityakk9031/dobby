import Link from "next/link";

import { getSession } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[rgba(7,11,20,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-lg text-emerald-300">
            D
          </span>
          <span className="tracking-[0.18em] text-slate-200">DOBBY DRIVE</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm text-slate-300">
          <Link href="/drive" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-emerald-400/40 hover:text-white">
            Workspace
          </Link>
          {session ? (
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full bg-emerald-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-300"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-emerald-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-300"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
