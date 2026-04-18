import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is missing. Add it before uploading images." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const name = String(formData.get("name") || "").trim();
    const folderIdValue = String(formData.get("folderId") || "").trim();
    const folderId = folderIdValue || null;
    const image = formData.get("image");

    if (!name) {
      return NextResponse.json({ error: "Image name is required." }, { status: 400 });
    }

    if (!(image instanceof File) || image.size <= 0) {
      return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    if (folderId) {
      const folder = await db.folder.findFirst({
        where: {
          id: folderId,
          ownerId: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!folder) {
        return NextResponse.json({ error: "Folder not found." }, { status: 404 });
      }
    }

    const safeBaseName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "image";
    const originalName = image.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const blob = await put(`users/${user.id}/${Date.now()}-${safeBaseName}-${originalName}`, image, {
      access: "public",
      addRandomSuffix: true,
      contentType: image.type,
    });

    const file = await db.driveFile.create({
      data: {
        ownerId: user.id,
        folderId,
        name,
        type: image.type,
        size: image.size,
        url: blob.url,
        note: null,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });

    return NextResponse.json({ ok: true, file });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload image." },
      { status: 500 },
    );
  }
}
