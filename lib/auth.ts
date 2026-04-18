import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import type { SessionUser } from "@/models/drive";

const COOKIE_NAME = "dobby_session";
const JWT_ALG = "HS256";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionCookie(user: SessionUser) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: JWT_ALG })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify<JwtPayload>(token, getJwtSecret(), {
      algorithms: [JWT_ALG],
    });

    return {
      id: verified.payload.sub,
      email: verified.payload.email,
      name: verified.payload.name,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();

  if (!session?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireApiUser() {
  const session = await getSession();

  if (!session?.id) {
    return null;
  }

  return db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
