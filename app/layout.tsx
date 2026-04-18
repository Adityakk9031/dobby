import type { Metadata } from "next";
import { Toaster } from "sonner";

import { getSession } from "@/lib/auth";
import { SessionProvider } from "@/contexts/session-context";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dobby Drive",
  description: "A Vercel-ready Drive workspace powered by Next.js, Prisma, and Neon.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <SessionProvider user={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.94)",
                color: "#e5edf9",
                border: "1px solid rgba(148, 163, 184, 0.16)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
