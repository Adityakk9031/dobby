import Link from "next/link";
import { ArrowRight, FolderTree, HardDrive, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-16">
        <section className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200">
              Next.js + Neon + Prisma
            </div>
            <div className="max-w-3xl space-y-5">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                A single-repo Drive workspace that feels premium and deploys cleanly on Vercel.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Dobby Drive keeps the GitHub-style structure you wanted, swaps MongoDB for Neon Postgres, and uses
                Next.js route handlers so there is no separate backend to maintain.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-emerald-300"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/drive"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-medium text-slate-100 transition hover:border-emerald-400/50 hover:text-white"
              >
                Open workspace
              </Link>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Repo layout</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Single deploy target</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  vercel-ready
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {["app/", "components/", "contexts/", "lib/", "models/", "prisma/", "public/"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <span>{item}</span>
                    <span className="text-slate-500">root</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Cookie auth",
              description: "Custom JWT auth with secure HTTP-only cookies and bcrypt password hashing.",
            },
            {
              icon: FolderTree,
              title: "Nested folders",
              description: "A clean recursive data model backed by Prisma relations and Neon Postgres.",
            },
            {
              icon: HardDrive,
              title: "Workspace UI",
              description: "A dark, polished dashboard with breadcrumbs, quick actions, and metadata cards.",
            },
          ].map((item) => (
            <div key={item.title} className="glass rounded-[1.5rem] p-6">
              <item.icon className="h-8 w-8 text-emerald-300" />
              <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
