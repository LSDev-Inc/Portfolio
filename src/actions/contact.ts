"use server";

import { revalidatePath } from "next/cache";

import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { contactSchema } from "@/lib/validation/schemas";

export type ContactState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function sendContactMessage(
  _state: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Controlla i campi evidenziati.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!hasDatabaseUrl()) {
    return {
      ok: true,
      message:
        "Messaggio ricevuto in modalita demo. Collega PostgreSQL per salvarlo nel database.",
    };
  }

  await getPrisma().contactMessage.create({
    data: {
      ...parsed.data,
      company: parsed.data.company || null,
    },
  });

  revalidatePath("/admin");

  return {
    ok: true,
    message: "Messaggio inviato. Ti rispondero il prima possibile.",
  };
}
