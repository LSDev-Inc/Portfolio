import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPortfolioData, getProjectBySlug } from "@/lib/portfolio/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, portfolio] = await Promise.all([
    getProjectBySlug(slug),
    getPortfolioData(),
  ]);

  if (!project) notFound();

  return (
    <main className="min-h-dvh bg-background">
      <section className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(130deg,rgba(34,211,238,.15),transparent_42%,rgba(217,70,239,.12))]" />
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/#projects">
                <ArrowLeft className="h-4 w-4" />
                Projects
              </Link>
            </Button>
            <Link href="/" className="text-sm font-semibold">
              {portfolio.settings.ownerName}
            </Link>
          </div>

          <div className="grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge>{project.category}</Badge>
                <Badge variant="outline">{project.status.replace("_", " ")}</Badge>
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-normal sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.demoUrl && (
                  <Button asChild className="rounded-full">
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Live demo
                    </a>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button asChild variant="outline" className="rounded-full">
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                      <GitBranch className="h-4 w-4" />
                      Repository
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 shadow-2xl">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["Impact", project.impact],
            ["Role", project.role],
            ["Client", project.client || "Internal / personal"],
          ].map(([label, value]) => (
            <Card key={label} className="border-white/10 bg-white/70 backdrop-blur-xl dark:bg-white/[0.055]">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500 dark:text-cyan-300">
                  {label}
                </p>
                <p className="mt-3 text-xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-7xl rounded-lg border border-border bg-muted/35 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Stack
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Badge key={item} variant="secondary" className="rounded-full px-4 py-2">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
