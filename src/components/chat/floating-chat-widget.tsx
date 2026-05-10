"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  id: string;
  sender: "VISITOR" | "ADMIN" | "SYSTEM";
  body: string;
  createdAt: string;
};

function getVisitorId() {
  const key = "portfolio-visitor-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

export function FloatingChatWidget({ online }: { online: boolean }) {
  const [open, setOpen] = useState(false);
  const [visitorId] = useState<string | null>(() =>
    typeof window === "undefined" ? null : getVisitorId(),
  );
  const [visitorName, setVisitorName] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("portfolio-visitor-name") ?? "",
  );
  const [visitorEmail, setVisitorEmail] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("portfolio-visitor-email") ?? "",
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [serverOnline, setServerOnline] = useState(online);
  const [hasNewReply, setHasNewReply] = useState(false);
  const lastAdminMessage = useRef<string | null>(null);

  const loadConversation = useMemo(() => {
    return async (id: string) => {
      const response = await fetch(`/api/chat?visitorId=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const payload = await response.json();
      setServerOnline(Boolean(payload.online));
      setMessages(payload.messages ?? []);

      const latestAdmin = [...(payload.messages ?? [])]
        .reverse()
        .find((item: ChatMessage) => item.sender === "ADMIN");

      if (latestAdmin?.id && latestAdmin.id !== lastAdminMessage.current) {
        if (lastAdminMessage.current && !open) setHasNewReply(true);
        lastAdminMessage.current = latestAdmin.id;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!visitorId || !open) return;
    const timeout = window.setTimeout(() => {
      void loadConversation(visitorId);
    }, 0);
    const interval = window.setInterval(() => loadConversation(visitorId), 12000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [loadConversation, open, visitorId]);

  async function submitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visitorId || !message.trim()) return;

    setIsSending(true);
    window.localStorage.setItem("portfolio-visitor-name", visitorName);
    window.localStorage.setItem("portfolio-visitor-email", visitorEmail);

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: "VISITOR",
      body: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimistic]);
    const text = message.trim();
    setMessage("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        visitorName,
        visitorEmail,
        message: text,
      }),
    });

    setIsSending(false);

    if (!response.ok) {
      toast.error("Non sono riuscito a inviare il messaggio.");
      return;
    }

    const payload = await response.json();
    if (payload.demo) toast.info(payload.message);
    await loadConversation(visitorId);
  }

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-white/12 bg-background/92 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl sm:w-[380px]"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full ${
                        serverOnline ? "bg-emerald-400" : "bg-zinc-400"
                      } opacity-75`}
                    />
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                        serverOnline ? "bg-emerald-400" : "bg-zinc-400"
                      }`}
                    />
                  </span>
                  <p className="text-sm font-semibold">
                    {serverOnline ? "Online" : "Offline"}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scrivimi qui, rispondo dall&apos;area admin.
                </p>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-72 px-4 py-4">
              <div className="grid gap-3 pr-3">
                {messages.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                    Ciao! Lasciami un messaggio rapido con obiettivo e timeline.
                  </div>
                )}
                {messages.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[86%] rounded-lg px-3 py-2 text-sm leading-6 ${
                      item.sender === "VISITOR"
                        ? "ml-auto bg-cyan-500 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {item.body}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={submitMessage} className="grid gap-3 border-t border-border/60 p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  value={visitorName}
                  onChange={(event) => setVisitorName(event.target.value)}
                  placeholder="Nome"
                  className="h-9"
                />
                <Input
                  value={visitorEmail}
                  onChange={(event) => setVisitorEmail(event.target.value)}
                  placeholder="Email"
                  type="email"
                  className="h-9"
                />
              </div>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Scrivi un messaggio..."
                rows={3}
              />
              <Button type="submit" disabled={isSending || !message.trim()} className="rounded-full">
                <Send className="h-4 w-4" />
                {isSending ? "Invio..." : "Invia"}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setOpen((value) => {
            if (!value) setHasNewReply(false);
            return !value;
          });
        }}
        className="relative grid h-14 w-14 place-items-center rounded-full border border-cyan-200/30 bg-cyan-400 text-cyan-950 shadow-2xl shadow-cyan-500/35 transition hover:bg-cyan-300"
        aria-label="Apri chat"
      >
        <MessageCircle className="h-6 w-6" />
        {hasNewReply && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-fuchsia-400 text-white"
          >
            <Bell className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
