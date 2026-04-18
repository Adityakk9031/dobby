import "server-only";

import { db } from "@/lib/db";
import type { DriveAsset, DriveBreadcrumb, DriveFolder } from "@/models/drive";

export async function resolveFolderPath(userId: string, segments?: string[]) {
  if (!segments?.length) {
    return {
      currentFolderId: null,
      breadcrumbs: [] as DriveBreadcrumb[],
    };
  }

  const breadcrumbs: DriveBreadcrumb[] = [];
  let parentId: string | null = null;

  for (let index = 0; index < segments.length; index += 1) {
    const folderId = segments[index];
    const folder: { id: string; name: string } | null = await db.folder.findFirst({
      where: {
        id: folderId,
        ownerId: userId,
        parentId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!folder) {
      return null;
    }

    breadcrumbs.push({
      id: folder.id,
      name: folder.name,
      href: `/drive/${segments.slice(0, index + 1).join("/")}`,
    });

    parentId = folder.id;
  }

  return {
    currentFolderId: parentId,
    breadcrumbs,
  };
}

export async function getDriveSnapshot(userId: string, folderId: string | null) {
  const [allFolders, allFiles, totalFolders, totalFiles] = await Promise.all([
    db.folder.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        name: true,
        parentId: true,
        updatedAt: true,
      },
    }),
    db.driveFile.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        note: true,
        url: true,
        folderId: true,
        updatedAt: true,
      },
    }),
    db.folder.count({
      where: {
        ownerId: userId,
      },
    }),
    db.driveFile.count({
      where: {
        ownerId: userId,
      },
    }),
  ]);

  const childFolders = allFolders.filter((folder) => folder.parentId === folderId);
  const currentFiles = allFiles.filter((file) => file.folderId === folderId);

  const childMap = new Map<string | null, string[]>();
  for (const folder of allFolders) {
    const siblings = childMap.get(folder.parentId) ?? [];
    siblings.push(folder.id);
    childMap.set(folder.parentId, siblings);
  }

  const directFileCountMap = new Map<string | null, number>();
  const directFileSizeMap = new Map<string | null, number>();

  for (const file of allFiles) {
    directFileCountMap.set(file.folderId, (directFileCountMap.get(file.folderId) ?? 0) + 1);
    directFileSizeMap.set(file.folderId, (directFileSizeMap.get(file.folderId) ?? 0) + file.size);
  }

  const sizeMemo = new Map<string, number>();

  function getRecursiveFolderSize(targetFolderId: string): number {
    if (sizeMemo.has(targetFolderId)) {
      return sizeMemo.get(targetFolderId) ?? 0;
    }

    const ownSize = directFileSizeMap.get(targetFolderId) ?? 0;
    const nestedSize = (childMap.get(targetFolderId) ?? []).reduce(
      (sum, childId) => sum + getRecursiveFolderSize(childId),
      0,
    );
    const totalSize = ownSize + nestedSize;

    sizeMemo.set(targetFolderId, totalSize);
    return totalSize;
  }

  return {
    folders: childFolders.map(
      (folder) =>
        ({
          id: folder.id,
          name: folder.name,
          updatedAt: folder.updatedAt,
          childCount: (childMap.get(folder.id) ?? []).length,
          fileCount: directFileCountMap.get(folder.id) ?? 0,
          totalSize: getRecursiveFolderSize(folder.id),
        }) satisfies DriveFolder,
    ),
    files: currentFiles.map(
      (file) =>
        ({
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          note: file.note,
          url: file.url,
          updatedAt: file.updatedAt,
        }) satisfies DriveAsset,
    ),
    stats: {
      totalFolders,
      totalFiles,
      currentItems: childFolders.length + currentFiles.length,
      totalBytes: allFiles.reduce((sum, file) => sum + file.size, 0),
    },
  };
}
