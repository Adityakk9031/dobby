import Link from "next/link";
import { ArrowRight, FolderTree, HardDrive, ImageUp, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  const proofPoints = [
    "Private by account",
    "Nested folder trees",
    "Recursive size tracking",
  ];

  const previewFolders = [
    ["Campaign imagery", "48 uploads"],
    ["Brand system", "12 uploads"],
    ["Invoices", "9 uploads"],
    ["Launch selects", "31 uploads"],
  ];

  const features = [
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
      description: "Upload images with a name, preview them instantly, and keep everything in one flow.",
    },
    {
      icon: HardDrive,
      title: "Size tracking",
      description: "Every folder shows the total image size, including the nested folders inside it.",
    },
  ];

  return (
    <div className="page-shell overflow-hidden">
      <div className="hero-noise relative">
        <div className="hero-beam" />
        <SiteHeader variant="landing" />

        <section className="relative min-h-[100svh] px-6 pb-20 pt-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-emerald-300/18 bg-emerald-300/8 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-emerald-200">
                Dobby Drive
              </div>
              <p className="mt-8 text-sm uppercase tracking-[0.36em] text-slate-500">Private image workspace</p>
              <h1 className="mt-4 max-w-[11ch] text-[clamp(3.6rem,8vw,7.6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
                Build a private{" "}
                <span className="font-editorial text-emerald-200 italic tracking-[-0.02em]">image archive</span> that
                stays ordered.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
                Upload, sort, and revisit every image in a workspace that feels calm, fast, and unmistakably yours.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 text-base font-medium text-slate-950 shadow-[0_18px_40px_rgba(99,242,176,0.2)] transition hover:bg-emerald-300"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/drive"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/35 px-6 py-3.5 text-base font-medium text-slate-100 backdrop-blur-md transition hover:border-emerald-400/50 hover:text-white"
                >
                  Open workspace
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-3 text-sm text-slate-300">
                {proofPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/8 bg-slate-950/30 px-4 py-2 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[560px] lg:h-[760px]">
              <div className="float-delayed absolute left-[4%] top-[12%] z-10 hidden w-56 rounded-[2rem] border border-white/10 bg-[rgba(6,11,21,0.82)] p-4 backdrop-blur-xl lg:block">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Live folders</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Campaign", "12.4 GB"],
                    ["Shoots", "4.9 GB"],
                    ["Brand", "1.2 GB"],
                  ].map(([label, size]) => (
                    <div key={label} className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                      <p className="text-sm text-slate-200">{label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{size}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glow-line float-slow absolute right-0 top-0 w-full max-w-[42rem] rounded-[2.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,24,0.96),rgba(8,12,24,0.8))] p-5 shadow-[0_30px_80px_rgba(2,6,23,0.5)] lg:p-7">
                <div className="rounded-[2.2rem] border border-white/8 bg-slate-950/80 p-5 lg:p-7">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Workspace preview</p>
                      <h2 className="mt-3 max-w-[10ch] text-4xl font-semibold tracking-[-0.04em] text-white">
                        Images stay clean, visible, and easy to move through.
                      </h2>
                    </div>
                    <div className="rounded-full border border-emerald-300/18 bg-emerald-300/8 px-4 py-2 text-sm text-emerald-200">
                      private
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-3">
                      {previewFolders.map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[1.6rem] border border-white/6 bg-white/[0.03] px-5 py-4 text-sm text-slate-200"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span>{label}</span>
                            <span className="text-slate-500">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      {[
                        { label: "Uploads", value: "100+" },
                        { label: "Folder size", value: "Auto" },
                        { label: "Access", value: "Private" },
                        { label: "Preview", value: "Instant" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[1.8rem] border border-white/6 bg-white/[0.03] px-5 py-5"
                        >
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="float-delayed absolute bottom-[8%] left-[14%] z-10 hidden w-72 rounded-[2rem] border border-white/10 bg-[rgba(8,13,24,0.84)] p-4 backdrop-blur-xl lg:block">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "from-emerald-300/60 to-teal-500/10",
                    "from-sky-300/60 to-blue-500/10",
                    "from-orange-200/70 to-rose-500/10",
                    "from-fuchsia-200/60 to-purple-500/10",
                    "from-lime-200/60 to-emerald-500/10",
                    "from-cyan-200/60 to-sky-500/10",
                  ].map((item) => (
                    <div
                      key={item}
                      className={`aspect-[0.9] rounded-[1.2rem] border border-white/6 bg-gradient-to-br ${item}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-300">Preview images instantly before diving into folders.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        <section className="grid gap-8 border-y border-white/6 py-12 lg:grid-cols-[1.1fr_repeat(3,1fr)]">
          <div className="pr-6">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">What it does</p>
            <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] text-white">
              A workspace that behaves like a tool, not a template.
            </h2>
          </div>

          {features.slice(0, 3).map((item) => (
            <div key={item.title} className="border-l border-white/6 pl-6">
              <item.icon className="h-7 w-7 text-emerald-300" />
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 py-16 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Why it feels better</p>
            <h2 className="mt-4 max-w-[9ch] text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white">
              The clutter drops out. The work stays in view.
            </h2>
          </div>

          <div className="space-y-5">
            {[
              {
                index: "01",
                title: "Upload with context",
                body: "Every image starts with a clear name, a home folder, and an instant preview.",
              },
              {
                index: "02",
                title: "Navigate without getting lost",
                body: "Nested folders and breadcrumbs keep deep client or campaign trees easy to follow.",
              },
              {
                index: "03",
                title: "Understand storage at a glance",
                body: "Folder totals include nested images, so size never disappears into subfolders.",
              },
            ].map((item) => (
              <div key={item.index} className="grid gap-4 border-t border-white/8 py-5 md:grid-cols-[80px_1fr]">
                <p className="text-sm text-slate-500">{item.index}</p>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.4rem] border border-white/8 bg-[linear-gradient(145deg,rgba(8,12,24,0.94),rgba(8,12,24,0.72))] px-8 py-10 shadow-[0_20px_60px_rgba(2,6,23,0.35)] lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Ready to use</p>
              <h2 className="mt-4 max-w-[11ch] text-4xl font-semibold tracking-[-0.04em] text-white">
                Start your image workspace and make the first folder count.
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 text-base font-medium text-slate-950 transition hover:bg-emerald-300"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-base font-medium text-slate-100 transition hover:border-emerald-400/50 hover:text-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
