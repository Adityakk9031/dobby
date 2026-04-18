import { notFound } from "next/navigation";

import { DriveShell } from "@/components/drive-shell";
import { getDriveSnapshot, resolveFolderPath } from "@/lib/drive";
import { requireUser } from "@/lib/auth";

export default async function DrivePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const user = await requireUser();
  const { slug } = await params;
  const resolved = await resolveFolderPath(user.id, slug);

  if (slug?.length && !resolved) {
    notFound();
  }

  const snapshot = await getDriveSnapshot(user.id, resolved?.currentFolderId ?? null);

  return (
    <DriveShell
      user={user}
      breadcrumbs={resolved?.breadcrumbs ?? []}
      currentFolderId={resolved?.currentFolderId ?? null}
      folders={snapshot.folders}
      files={snapshot.files}
      stats={snapshot.stats}
    />
  );
}
