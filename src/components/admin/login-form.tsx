"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";

import { loginAction, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <Card className="w-full max-w-md border-white/10 bg-white/75 shadow-2xl shadow-cyan-950/10 backdrop-blur-2xl dark:bg-white/[0.06]">
      <CardHeader>
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-cyan-300/10 text-cyan-500 dark:text-cyan-200">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <CardTitle className="text-2xl">Admin access</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Area protetta per gestire portfolio, contenuti, contatti e chat.
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state.error && (
            <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="rounded-full">
            <LogIn className="h-4 w-4" />
            {pending ? "Accesso..." : "Entra in dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
