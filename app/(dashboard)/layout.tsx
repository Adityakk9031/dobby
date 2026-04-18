import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderKanban } from "lucide-react";

import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="page-shell min-h-screen">
      <header className="border-b border-white/5 bg-[rgba(7,11,20,0.84)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/drive" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Dobby Drive</p>
              <p className="text-sm text-slate-200">{session.email}</p>
            </div>
          </Link>

          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-rose-400/40 hover:text-rose-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
