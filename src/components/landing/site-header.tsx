"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Journey", "#journey"],
  ["Notes", "#notes"],
  ["Contact", "#contact"],
] as const;

export function SiteHeader({ ownerName }: { ownerName: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <motion.span
            whileHover={{ rotate: 10, scale: 1.04 }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
          >
            <Sparkles className="h-4 w-4" />
          </motion.span>
          <span className="truncate text-sm font-semibold tracking-wide">
            {ownerName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/8 hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-white/15 bg-white/8 backdrop-blur-xl md:hidden"
                aria-label="Apri menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-white/10 bg-background/95 backdrop-blur-2xl">
              <SheetHeader>
                <SheetTitle>{ownerName}</SheetTitle>
              </SheetHeader>
              <div className="mt-8 grid gap-2">
                {nav.map(([label, href], index) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={href}
                      className="block rounded-lg px-3 py-3 text-base text-muted-foreground transition hover:bg-white/8 hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
