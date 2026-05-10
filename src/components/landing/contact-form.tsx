"use client";

import { useActionState, useEffect } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { sendContactMessage, type ContactState } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="Il tuo nome" required />
          {state.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@email.com" required />
          {state.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Opzionale" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="subject">Oggetto</Label>
          <Input id="subject" name="subject" placeholder="Progetto, ruolo, audit..." required />
          {state.errors?.subject && (
            <p className="text-xs text-destructive">{state.errors.subject[0]}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Messaggio</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Raccontami obiettivo, timeline e contesto."
          required
        />
        {state.errors?.message && (
          <p className="text-xs text-destructive">{state.errors.message[0]}</p>
        )}
      </div>
      <Button type="submit" size="lg" disabled={pending} className="group w-full sm:w-fit">
        <motion.span
          animate={pending ? { x: [0, 4, 0] } : { x: 0 }}
          transition={{ repeat: pending ? Infinity : 0, duration: 0.8 }}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {pending ? "Invio..." : "Invia messaggio"}
        </motion.span>
      </Button>
    </form>
  );
}
