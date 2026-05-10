import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(130deg,rgba(34,211,238,.15),transparent_42%,rgba(217,70,239,.12)),radial-gradient(circle_at_50%_0%,rgba(255,255,255,.1),transparent_35%)]" />
      <LoginForm />
    </main>
  );
}
