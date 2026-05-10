"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-500">
          Runtime error
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Qualcosa non ha risposto.</h1>
        <p className="mt-3 text-muted-foreground">
          Riprova: se il database non e ancora collegato, verifica `DATABASE_URL`.
        </p>
        <Button className="mt-6 rounded-full" onClick={reset}>
          Riprova
        </Button>
      </div>
    </main>
  );
}
