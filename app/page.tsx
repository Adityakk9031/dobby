import Link from "next/link";
import { ArrowRight, FolderTree, HardDrive, ImageUp, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-16">
        <section className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200">
              Private image workspace
            </div>
            <div className="max-w-3xl space-y-5">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                Upload, organize, and find every image in one clean workspace.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Create nested folders, keep uploads private to each account, and track folder sizes automatically as
                your image library grows.
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
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Workspace preview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Everything stays organized</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  private
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {[
                  ["Campaign images", "48 uploads"],
                  ["Brand assets", "12 uploads"],
                  ["Invoices", "9 uploads"],
                  ["Product shoots", "31 uploads"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <span>{label}</span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Uploads", value: "100+" },
                  { label: "Folder size", value: "Auto" },
                  { label: "Access", value: "Private" },
                  { label: "Preview", value: "Instant" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
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
              title: "Private access",
              description: "Each account only sees its own folders and uploaded images.",
            },
            {
              icon: FolderTree,
              title: "Nested folders",
              description: "Build deep folder trees and keep campaigns, clients, and assets grouped cleanly.",
            },
            {
              icon: ImageUp,
              title: "Image uploads",
              description: "Upload images with a name, preview them instantly, and track folder size as you go.",
            },
            {
              icon: HardDrive,
              title: "Size tracking",
              description: "Every folder shows the total size of its images, including nested folders inside it.",
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
