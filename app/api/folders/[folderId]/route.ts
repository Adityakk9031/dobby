import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ folderId: string }> },
) {
  try {
    const user = await requireApiUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { folderId } = await params;

    const folder = await db.folder.findFirst({
      where: {
        id: folderId,
        ownerId: user.id,
      },
      include: {
        _count: {
          select: {
            children: true,
            files: true,
          },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found." }, { status: 404 });
    }

    if (folder._count.children > 0 || folder._count.files > 0) {
      return NextResponse.json(
        { error: "Only empty folders can be deleted in this starter." },
        { status: 409 },
      );
    }

    await db.folder.delete({
      where: {
        id: folder.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete folder." }, { status: 500 });
  }
}
