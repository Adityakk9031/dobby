"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileImage, Folder, FolderPlus, ImageUp, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatBytes, formatRelativeDate } from "@/lib/utils";
import type { DriveAsset, DriveBreadcrumb, DriveFolder, DriveFolderOption, SessionUser } from "@/models/drive";

type DriveShellProps = {
  user: SessionUser;
  breadcrumbs: DriveBreadcrumb[];
  folders: DriveFolder[];
  files: DriveAsset[];
  folderOptions: DriveFolderOption[];
  currentFolderId: string | null;
  stats: {
    totalFolders: number;
    totalFiles: number;
    currentItems: number;
    totalBytes: number;
  };
};

export function DriveShell({
  user,
  breadcrumbs,
  folders,
  files,
  folderOptions,
  currentFolderId,
  stats,
}: DriveShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [folderName, setFolderName] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetFolderId, setTargetFolderId] = useState(currentFolderId ?? "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTargetFolderId(currentFolderId ?? "");
  }, [currentFolderId]);

  const currentPath = useMemo(() => {
    return breadcrumbs.length ? breadcrumbs[breadcrumbs.length - 1]?.name : "Root";
  }, [breadcrumbs]);

  async function createFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        parentId: currentFolderId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to create folder.");
      return;
    }

    setFolderName("");
    toast.success("Folder created.");
    router.refresh();
  }

  async function createFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!imageFile) {
      toast.error("Choose an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("name", imageName);
    formData.append("folderId", targetFolderId);
    formData.append("image", imageFile);

    const response = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to add item.");
      return;
    }

    setImageName("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Image uploaded.");
    router.refresh();
  }

  async function deleteFolder(folderId: string) {
    const response = await fetch(`/api/folders/${folderId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to delete folder.");
      return;
    }

    toast.success("Folder deleted.");
    router.refresh();
  }

  async function deleteFile(fileId: string) {
    const response = await fetch(`/api/files/${fileId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to delete item.");
      return;
    }

    toast.success("Item removed.");
    router.refresh();
  }

  function refreshWorkspace() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-6">
        <section className="glass rounded-[1.8rem] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{currentPath}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Signed in as {user.name}. Upload images, organize them into nested folders, and keep everything visible
            only to your account.
          </p>
          <button
            type="button"
            onClick={refreshWorkspace}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400/40"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Refresh
          </button>
        </section>

        <section className="glass rounded-[1.8rem] p-6">
          <h2 className="text-sm uppercase tracking-[0.22em] text-slate-400">Overview</h2>
          <div className="mt-5 grid gap-3">
            {[
              { label: "Total folders", value: stats.totalFolders },
              { label: "Total images", value: stats.totalFiles },
              { label: "Visible here", value: stats.currentItems },
              { label: "Storage used", value: formatBytes(stats.totalBytes) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[1.8rem] p-6">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-slate-400">
            <FolderPlus className="h-4 w-4" />
            Quick create
          </div>
          <form onSubmit={createFolder} className="mt-5 space-y-3">
            <input
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              placeholder="New folder name"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
            >
              Create folder
            </button>
          </form>
        </section>

        <section className="glass rounded-[1.8rem] p-6">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-slate-400">
            <ImageUp className="h-4 w-4" />
            Upload image
          </div>
          <form onSubmit={createFile} className="mt-5 space-y-3">
            <input
              value={imageName}
              onChange={(event) => setImageName(event.target.value)}
              placeholder="Image name"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
              required
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              required
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:font-medium file:text-slate-950 hover:file:bg-emerald-300"
            />
            <select
              value={targetFolderId}
              onChange={(event) => setTargetFolderId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/50"
            >
              <option value="">Root folder</option>
              {folderOptions.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-emerald-400/50"
            >
              Upload image
            </button>
          </form>
        </section>
      </aside>

      <section className="space-y-6">
        <div className="glass rounded-[1.8rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current location</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <Link href="/drive" className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-400/40 hover:text-white">
                  Root
                </Link>
                {breadcrumbs.map((crumb) => (
                  <Link
                    key={crumb.id}
                    href={crumb.href}
                    className="rounded-full border border-white/10 px-3 py-1 transition hover:border-emerald-400/40 hover:text-white"
                  >
                    {crumb.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">{pathname}</div>
          </div>
        </div>

        <div className="glass rounded-[1.8rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Folders</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Navigate your tree</h2>
            </div>
            <p className="text-sm text-slate-400">{folders.length} visible</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {folders.length ? (
              folders.map((folder) => {
                const href = breadcrumbs.length
                  ? `/drive/${[...breadcrumbs.map((crumb) => crumb.id), folder.id].join("/")}`
                  : `/drive/${folder.id}`;

                return (
                  <div key={folder.id} className="rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <Link href={href} className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                          <Folder className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{folder.name}</h3>
                          <p className="text-sm text-slate-400">
                            {folder.childCount} folders / {folder.fileCount} images
                          </p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteFolder(folder.id)}
                        className="rounded-full border border-rose-400/10 p-2 text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
                      <span>{formatBytes(folder.totalSize)} total</span>
                      <span>Updated {formatRelativeDate(folder.updatedAt)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 p-6 text-sm text-slate-400">
                No folders yet in this location.
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-[1.8rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Items</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Uploaded images</h2>
            </div>
            <p className="text-sm text-slate-400">{files.length} visible</p>
          </div>

          <div className="mt-6 space-y-3">
            {files.length ? (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-white/5 bg-white/[0.03] px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    {file.url ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="mt-0.5 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                        <FileImage className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-medium text-white">{file.name}</h3>
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                          image
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{formatBytes(file.size)}</span>
                        <span>Updated {formatRelativeDate(file.updatedAt)}</span>
                        {file.url ? (
                          <a href={file.url} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                            Open image
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteFile(file.id)}
                    className="inline-flex items-center justify-center rounded-full border border-rose-400/10 p-3 text-rose-200 transition hover:border-rose-400/40 hover:bg-rose-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 p-6 text-sm text-slate-400">
                This folder does not have any uploaded images yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
