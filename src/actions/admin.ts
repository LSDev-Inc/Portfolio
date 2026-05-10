"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db/prisma";
import {
  adminChatReplySchema,
  experienceSchema,
  projectSchema,
  settingsSchema,
  skillCategorySchema,
  skillSchema,
  noteSchema,
} from "@/lib/validation/schemas";

type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const splitList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

function cleanUrl(value?: string | null) {
  return value ? value : null;
}

function refreshPortfolio() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveSettingsAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Controlla i campi impostazioni.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = {
    ...parsed.data,
    githubUrl: cleanUrl(parsed.data.githubUrl),
    linkedinUrl: cleanUrl(parsed.data.linkedinUrl),
    twitterUrl: cleanUrl(parsed.data.twitterUrl),
    websiteUrl: cleanUrl(parsed.data.websiteUrl),
    ogImage: cleanUrl(parsed.data.ogImage),
  };

  const prisma = getPrisma();
  const existing = await prisma.siteSettings.findFirst();

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  refreshPortfolio();
  return { ok: true, message: "Impostazioni salvate." };
}

export async function saveProjectAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Controlla i campi progetto.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, stack, demoUrl, repoUrl, ...rest } = parsed.data;
  const data = {
    ...rest,
    stack: splitList(stack),
    images: [rest.imageUrl],
    demoUrl: cleanUrl(demoUrl),
    repoUrl: cleanUrl(repoUrl),
    client: cleanUrl(rest.client),
  };

  if (id) {
    await getPrisma().project.update({ where: { id }, data });
  } else {
    await getPrisma().project.create({ data });
  }

  refreshPortfolio();
  return { ok: true, message: id ? "Progetto aggiornato." : "Progetto creato." };
}

export async function saveSkillCategoryAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = skillCategorySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: "Categoria non valida.", errors: parsed.error.flatten().fieldErrors };
  }

  const { id, ...data } = parsed.data;

  if (id) {
    await getPrisma().skillCategory.update({ where: { id }, data });
  } else {
    await getPrisma().skillCategory.create({ data });
  }

  refreshPortfolio();
  return { ok: true, message: "Categoria salvata." };
}

export async function saveSkillAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: "Skill non valida.", errors: parsed.error.flatten().fieldErrors };
  }

  const { id, ...data } = parsed.data;

  if (id) {
    await getPrisma().skill.update({ where: { id }, data });
  } else {
    await getPrisma().skill.create({ data });
  }

  refreshPortfolio();
  return { ok: true, message: "Skill salvata." };
}

export async function saveExperienceAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Esperienza non valida.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, highlights, startDate, endDate, location, ...rest } = parsed.data;
  const data = {
    ...rest,
    location: cleanUrl(location),
    highlights: splitList(highlights),
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
  };

  if (id) {
    await getPrisma().experience.update({ where: { id }, data });
  } else {
    await getPrisma().experience.create({ data });
  }

  refreshPortfolio();
  return { ok: true, message: "Esperienza salvata." };
}

export async function saveNoteAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Nota non valida.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, tags, imageUrl, publishedAt, ...rest } = parsed.data;
  const data = {
    ...rest,
    tags: splitList(tags),
    imageUrl: cleanUrl(imageUrl),
    publishedAt: publishedAt ? new Date(publishedAt) : rest.published ? new Date() : null,
  };

  if (id) {
    await getPrisma().note.update({ where: { id }, data });
  } else {
    await getPrisma().note.create({ data });
  }

  refreshPortfolio();
  return { ok: true, message: "Nota salvata." };
}

export async function deleteEntityAction(formData: FormData) {
  await requireAdmin();
  const entity = String(formData.get("entity"));
  const id = String(formData.get("id"));
  const prisma = getPrisma();

  switch (entity) {
    case "project":
      await prisma.project.delete({ where: { id } });
      break;
    case "skill":
      await prisma.skill.delete({ where: { id } });
      break;
    case "skillCategory":
      await prisma.skillCategory.delete({ where: { id } });
      break;
    case "experience":
      await prisma.experience.delete({ where: { id } });
      break;
    case "contact":
      await prisma.contactMessage.delete({ where: { id } });
      break;
    case "conversation":
      await prisma.chatConversation.delete({ where: { id } });
      break;
    case "note":
      await prisma.note.delete({ where: { id } });
      break;
    default:
      throw new Error("Entity non supportata.");
  }

  refreshPortfolio();
}

export async function updateContactStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as
    | "UNREAD"
    | "READ"
    | "REPLIED"
    | "ARCHIVED";

  await getPrisma().contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function replyChatAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = adminChatReplySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { ok: false, message: "Scrivi una risposta valida." };
  }

  const prisma = getPrisma();

  await prisma.chatMessage.create({
    data: {
      conversationId: parsed.data.conversationId,
      sender: "ADMIN",
      body: parsed.data.message,
    },
  });

  await prisma.chatConversation.update({
    where: { id: parsed.data.conversationId },
    data: {
      unreadVisitor: { increment: 1 },
      unreadAdmin: 0,
      lastMessageAt: new Date(),
      status: "OPEN",
    },
  });

  revalidatePath("/admin");
  return { ok: true, message: "Risposta inviata." };
}

export async function setConversationStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as "OPEN" | "CLOSED";

  await getPrisma().chatConversation.update({
    where: { id },
    data: { status, unreadAdmin: 0 },
  });

  revalidatePath("/admin");
}
