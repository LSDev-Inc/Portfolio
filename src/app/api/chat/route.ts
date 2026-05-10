import { NextRequest } from "next/server";

import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { chatMessageSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const visitorId = request.nextUrl.searchParams.get("visitorId");

  if (!visitorId || !hasDatabaseUrl()) {
    return Response.json({
      online: true,
      conversation: null,
      messages: [],
    });
  }

  const prisma = getPrisma();
  const [settings, conversation] = await Promise.all([
    prisma.siteSettings.findFirst({ select: { onlineStatus: true } }),
    prisma.chatConversation.findUnique({
      where: { visitorId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    }),
  ]);

  if (conversation) {
    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { unreadVisitor: 0 },
    });
  }

  return Response.json({
    online: settings?.onlineStatus ?? true,
    conversation: conversation
      ? {
          id: conversation.id,
          status: conversation.status,
          visitorName: conversation.visitorName,
          visitorEmail: conversation.visitorEmail,
        }
      : null,
    messages:
      conversation?.messages.map((message) => ({
        id: message.id,
        sender: message.sender,
        body: message.body,
        createdAt: message.createdAt.toISOString(),
      })) ?? [],
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = chatMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Messaggio non valido.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (!hasDatabaseUrl()) {
    return Response.json({
      ok: true,
      demo: true,
      message:
        "Messaggio ricevuto in modalita demo. Collega PostgreSQL per persistere la chat.",
    });
  }

  const prisma = getPrisma();
  const conversation = await prisma.chatConversation.upsert({
    where: { visitorId: parsed.data.visitorId },
    update: {
      visitorName: parsed.data.visitorName || undefined,
      visitorEmail: parsed.data.visitorEmail || undefined,
      unreadAdmin: { increment: 1 },
      lastMessageAt: new Date(),
      status: "OPEN",
    },
    create: {
      visitorId: parsed.data.visitorId,
      visitorName: parsed.data.visitorName || null,
      visitorEmail: parsed.data.visitorEmail || null,
      unreadAdmin: 1,
      lastMessageAt: new Date(),
    },
  });

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      sender: "VISITOR",
      body: parsed.data.message,
    },
  });

  return Response.json({
    ok: true,
    conversationId: conversation.id,
    message: {
      id: message.id,
      sender: message.sender,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
    },
  });
}
