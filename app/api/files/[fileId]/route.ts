import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const user = await requireApiUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { fileId } = await params;

    const file = await db.driveFile.findFirst({
      where: {
        id: fileId,
        ownerId: user.id,
      },
      select: {
        id: true,
        url: true,
      },
    });

    if (!file) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    if (file.url && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(file.url);
    }

    await db.driveFile.delete({
      where: {
        id: file.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete item." }, { status: 500 });
  }
}
