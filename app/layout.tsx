import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";

import { getSession } from "@/lib/auth";
import { SessionProvider } from "@/contexts/session-context";

import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

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
      <body className={`${spaceGrotesk.variable} ${cormorant.variable}`}>
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
