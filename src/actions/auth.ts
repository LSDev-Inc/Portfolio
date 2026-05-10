"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { clearSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/schemas";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Credenziali non valide." };
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  const isValid =
    user && (await bcrypt.compare(parsed.data.password, user.passwordHash));

  if (!isValid || user.role !== "ADMIN") {
    return { error: "Email o password non corrette." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: "ADMIN",
  });

  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
