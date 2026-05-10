import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-500">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Pagina non trovata.</h1>
        <p className="mt-3 text-muted-foreground">
          Il contenuto potrebbe essere stato rimosso o non ancora pubblicato.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">Torna alla home</Link>
        </Button>
      </div>
    </main>
  );
}
