"use client";

import { createContext, useContext, useMemo } from "react";

import type { SessionUser } from "@/models/drive";

type SessionContextValue = {
  user: SessionUser | null;
};

const SessionContext = createContext<SessionContextValue>({
  user: null,
});

export function SessionProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser | null;
}) {
  const value = useMemo(() => ({ user }), [user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
