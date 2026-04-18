import { NextResponse } from "next/server";

import { createSessionCookie, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { authSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = authSchema.safeParse(body);

    if (!parsed.success || !parsed.data.name) {
      return NextResponse.json({ error: "Please provide a valid name, email, and password." }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
    }

    const user = await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await createSessionCookie(user);

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ error: "Unable to create account right now." }, { status: 500 });
  }
}
