"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  GitBranch,
  Network,
  Mail,
  MapPin,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { FloatingChatWidget } from "@/components/chat/floating-chat-widget";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "./contact-form";
import { SiteHeader } from "./site-header";
import type { PublicPortfolio, PublicProject } from "@/lib/portfolio/types";
import type { LucideIcon } from "lucide-react";

const sectionLabel =
  "text-xs font-semibold uppercase tracking-[0.24em] text-cyan-500 dark:text-cyan-300";

const heroStats: Array<[string, string, LucideIcon]> = [
  ["Focus", "Full-stack product delivery", Rocket],
  ["Stack", "Next.js, Prisma, PostgreSQL", Code2],
  ["Mode", "Open to full-time and high-impact freelance", BriefcaseBusiness],
  ["Base", "Italy / Remote", MapPin],
];

const valueCards: Array<[string, string, LucideIcon]> = [
  [
    "Product Mindset",
    "Non costruisco solo schermate: progetto flussi che riducono attrito e aumentano fiducia.",
    Zap,
  ],
  [
    "Reliable Backend",
    "API, validazione, auth e database sono trattati come parte visibile dell'esperienza.",
    ShieldCheck,
  ],
  [
    "Premium UI",
    "Motion, layout e micro-feedback sono pensati per sembrare naturali, non decorativi.",
    Sparkles,
  ],
  [
    "Clean Delivery",
    "Codice leggibile, componenti riutilizzabili e deploy pronto per ambienti reali.",
    CheckCircle2,
  ],
];

function formatDate(value: string | null) {
  if (!value) return "Now";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ProjectCard({ project, index }: { project: PublicProject; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="h-full overflow-hidden border-white/10 bg-white/70 shadow-2xl shadow-cyan-950/5 backdrop-blur-xl transition dark:bg-white/[0.055]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="bg-cyan-300 text-cyan-950">{project.category}</Badge>
            {project.featured && (
              <Badge variant="secondary" className="bg-white/85 text-zinc-950">
                Featured
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">{project.impact}</p>
            <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
          </div>
        </div>
        <CardContent className="grid gap-5 p-5">
          <p className="text-sm leading-6 text-muted-foreground">{project.summary}</p>
          <div className="flex flex-wrap gap-2">
            {project.stack.slice(0, 5).map((item) => (
              <Badge key={item} variant="outline" className="border-white/10 bg-white/5">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="rounded-full">
              <Link href={`/projects/${project.slug}`}>
                Dettaglio <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {project.demoUrl && (
              <Button asChild size="icon" variant="outline" className="rounded-full">
                <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label="Apri demo">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild size="icon" variant="outline" className="rounded-full">
                <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label="Apri repo">
                  <GitBranch className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}

export function HomeExperience({ data }: { data: PublicPortfolio }) {
  const { settings, skillCategories, projects, experiences, notes } = data;
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory, projects],
  );

  const featuredSkills = skillCategories.flatMap((category) =>
    category.skills.filter((skill) => skill.featured).slice(0, 3),
  );

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <SiteHeader ownerName={settings.ownerName} />

      <main>
        <section className="relative isolate min-h-[92svh] overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(34,211,238,0.18),transparent_34%,rgba(168,85,247,0.14)_58%,transparent_78%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),transparent_34%)]" />
          <motion.div
            aria-hidden
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 24, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px]"
          />
          <div className="mx-auto flex min-h-[calc(92svh-7rem)] max-w-7xl flex-col justify-center py-12">
            <Reveal className="max-w-5xl">
              <Badge className="mb-6 rounded-full border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-700 dark:text-cyan-200">
                <Sparkles className="mr-2 h-4 w-4" />
                {settings.heroKicker}
              </Badge>
              <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
                <span className="block">{settings.ownerName}</span>
                <span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent dark:from-cyan-200 dark:via-white dark:to-fuchsia-200">
                  {settings.professionalTitle}
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {settings.heroDescription}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group rounded-full">
                  <Link href={settings.primaryCtaHref}>
                    {settings.primaryCtaLabel}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 bg-white/8 backdrop-blur-xl">
                  <Link href={settings.secondaryCtaHref}>
                    <Mail className="h-4 w-4" />
                    {settings.secondaryCtaLabel}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full">
                  <a href={settings.cvUrl} download>
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {heroStats
                .map(([label, value, Icon]) => [
                  label,
                  label === "Mode" ? settings.availability : label === "Base" ? settings.location : value,
                  Icon,
                ] as [string, string, LucideIcon])
                .map(([label, value, Icon]) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-lg border border-white/10 bg-white/65 p-4 shadow-xl shadow-cyan-950/5 backdrop-blur-2xl dark:bg-white/[0.055]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-500 dark:text-cyan-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-medium">{value}</p>
                </motion.div>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <p className={sectionLabel}>About Me</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                {settings.headline}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">{settings.about}</p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {valueCards.map(([title, text, Icon], index) => (
                <Reveal key={title} delay={index * 0.05}>
                  <Card className="h-full border-white/10 bg-white/70 backdrop-blur-xl dark:bg-white/[0.055]">
                    <CardContent className="p-6">
                      <Icon className="h-5 w-5 text-cyan-500 dark:text-cyan-300" />
                      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="bg-zinc-950 px-4 py-24 text-white dark:bg-black sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className={sectionLabel}>Skills</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                Skillset organizzato per costruire prodotti completi.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {skillCategories.map((category, index) => (
                <Reveal key={category.id} delay={index * 0.06}>
                  <Card className="h-full border-white/10 bg-white/[0.055] text-white backdrop-blur-xl">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="mt-2 min-h-12 text-sm leading-6 text-white/62">{category.description}</p>
                      <div className="mt-6 grid gap-5">
                        {category.skills.map((skill) => (
                          <div key={skill.id}>
                            <div className="mb-2 flex items-center justify-between gap-4">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="font-mono text-xs text-cyan-200">{skill.level}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-300"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8 flex flex-wrap gap-2">
              {featuredSkills.map((skill) => (
                <Badge key={skill.id} className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/15">
                  {skill.name}
                </Badge>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="projects" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className={sectionLabel}>Projects</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                  Progetti progettati come prodotti veri.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={activeCategory === category ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Reveal>
            <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section id="journey" className="bg-muted/40 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className={sectionLabel}>Experience / Journey</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                Una traiettoria orientata a prodotto, qualita e impatto.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5">
              {experiences.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    className="grid gap-5 rounded-lg border border-border bg-background/80 p-5 backdrop-blur-xl md:grid-cols-[220px_1fr]"
                  >
                    <div>
                      <Badge variant="outline" className="mb-4">{item.type}</Badge>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(item.startDate)} - {item.current ? "Now" : formatDate(item.endDate)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-cyan-600 dark:text-cyan-300">
                        {item.organization}{item.location ? ` / ${item.location}` : ""}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.highlights.map((highlight) => (
                          <Badge key={highlight} variant="secondary">{highlight}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="notes" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="max-w-3xl">
              <p className={sectionLabel}>Notes</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                Appunti brevi su prodotto, codice e delivery.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {notes.map((note, index) => (
                <Reveal key={note.id} delay={index * 0.05}>
                  <Card className="h-full overflow-hidden border-white/10 bg-white/70 backdrop-blur-xl dark:bg-white/[0.055]">
                    {note.imageUrl && (
                      <div className="relative aspect-[16/9]">
                        <Image src={note.imageUrl} alt={note.title} fill sizes="33vw" className="object-cover" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold">{note.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.excerpt}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-zinc-950 px-4 py-24 text-white dark:bg-black sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,.14),transparent_42%,rgba(217,70,239,.12))]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <p className={sectionLabel}>Contact</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
                Hai un prodotto serio da costruire o migliorare?
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/65">
                Scrivimi con contesto, obiettivi e timeline. Ti rispondero con domande precise e un piano chiaro.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-white/75">
                <a className="flex items-center gap-3 transition hover:text-white" href={`mailto:${settings.email}`}>
                  <Mail className="h-4 w-4 text-cyan-200" />
                  {settings.email}
                </a>
                <span className="flex items-center gap-3">
                  <MessageSquareText className="h-4 w-4 text-cyan-200" />
                  Chat widget attiva in basso
                </span>
                <span className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-cyan-200" />
                  {settings.availability}
                </span>
              </div>
              <div className="mt-8 flex gap-2">
                {settings.githubUrl && (
                  <Button asChild size="icon" variant="outline" className="rounded-full border-white/15 bg-white/8">
                    <a href={settings.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
                      <GitBranch className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {settings.linkedinUrl && (
                  <Button asChild size="icon" variant="outline" className="rounded-full border-white/15 bg-white/8">
                    <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                      <Network className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl sm:p-7">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <FloatingChatWidget online={settings.onlineStatus} />
    </div>
  );
}
