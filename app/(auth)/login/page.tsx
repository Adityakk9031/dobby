import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/drive");
  }

  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm mode="login" />
    </main>
  );
}
