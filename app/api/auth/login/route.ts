import { NextResponse } from "next/server";

import { createSessionCookie, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { authSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = authSchema.omit({ name: true }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid email and password." }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const matches = await verifyPassword(parsed.data.password, user.passwordHash);

    if (!matches) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await createSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
