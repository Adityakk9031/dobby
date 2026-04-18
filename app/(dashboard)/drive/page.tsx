import { DriveShell } from "@/components/drive-shell";
import { requireUser } from "@/lib/auth";
import { getDriveSnapshot } from "@/lib/drive";

export default async function DriveRootPage() {
  const user = await requireUser();
  const snapshot = await getDriveSnapshot(user.id, null);

  return (
    <DriveShell
      user={user}
      breadcrumbs={[]}
      currentFolderId={null}
      folders={snapshot.folders}
      files={snapshot.files}
      folderOptions={snapshot.folderOptions}
      stats={snapshot.stats}
    />
  );
}
