import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { folderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = folderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Folder name is invalid." }, { status: 400 });
    }

    const baseSlug = slugify(parsed.data.name) || "folder";
    let slug = baseSlug;
    let counter = 1;

    while (
      await db.folder.findFirst({
        where: {
          ownerId: user.id,
          parentId: parsed.data.parentId,
          slug,
        },
      })
    ) {
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }

    const folder = await db.folder.create({
      data: {
        name: parsed.data.name,
        slug,
        ownerId: user.id,
        parentId: parsed.data.parentId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ ok: true, folder });
  } catch {
    return NextResponse.json({ error: "Unable to create folder." }, { status: 500 });
  }
}
