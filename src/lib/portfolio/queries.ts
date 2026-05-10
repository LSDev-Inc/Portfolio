import "server-only";

import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { fallbackPortfolio } from "./fallback";
import type { PublicPortfolio } from "./types";

function normalizeDate(date?: Date | null) {
  return date ? date.toISOString() : null;
}

export async function getPortfolioData(): Promise<PublicPortfolio> {
  if (!hasDatabaseUrl()) {
    return fallbackPortfolio;
  }

  try {
    const prisma = getPrisma();
    const [settings, skillCategories, projects, experiences, notes] =
      await Promise.all([
        prisma.siteSettings.findFirst(),
        prisma.skillCategory.findMany({
          orderBy: { order: "asc" },
          include: { skills: { orderBy: { order: "asc" } } },
        }),
        prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] }),
        prisma.experience.findMany({ orderBy: { order: "asc" } }),
        prisma.note.findMany({
          where: { published: true },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: 3,
        }),
      ]);

    if (!settings) return fallbackPortfolio;

    return {
      settings: {
        ownerName: settings.ownerName,
        professionalTitle: settings.professionalTitle,
        headline: settings.headline,
        heroKicker: settings.heroKicker,
        heroDescription: settings.heroDescription,
        about: settings.about,
        location: settings.location,
        email: settings.email,
        availability: settings.availability,
        cvUrl: settings.cvUrl,
        primaryCtaLabel: settings.primaryCtaLabel,
        primaryCtaHref: settings.primaryCtaHref,
        secondaryCtaLabel: settings.secondaryCtaLabel,
        secondaryCtaHref: settings.secondaryCtaHref,
        githubUrl: settings.githubUrl,
        linkedinUrl: settings.linkedinUrl,
        twitterUrl: settings.twitterUrl,
        websiteUrl: settings.websiteUrl,
        accentName: settings.accentName,
        onlineStatus: settings.onlineStatus,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        ogImage: settings.ogImage,
      },
      skillCategories: skillCategories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        order: category.order,
        skills: category.skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          description: skill.description,
          featured: skill.featured,
          order: skill.order,
        })),
      })),
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        category: project.category,
        status: project.status,
        summary: project.summary,
        description: project.description,
        impact: project.impact,
        role: project.role,
        client: project.client,
        imageUrl: project.imageUrl,
        images: project.images,
        stack: project.stack,
        demoUrl: project.demoUrl,
        repoUrl: project.repoUrl,
        featured: project.featured,
        order: project.order,
      })),
      experiences: experiences.map((item) => ({
        id: item.id,
        title: item.title,
        organization: item.organization,
        type: item.type,
        location: item.location,
        startDate: item.startDate.toISOString(),
        endDate: normalizeDate(item.endDate),
        current: item.current,
        summary: item.summary,
        highlights: item.highlights,
        order: item.order,
      })),
      notes: notes.map((note) => ({
        id: note.id,
        title: note.title,
        slug: note.slug,
        excerpt: note.excerpt,
        content: note.content,
        imageUrl: note.imageUrl,
        tags: note.tags,
        publishedAt: normalizeDate(note.publishedAt),
      })),
    };
  } catch (error) {
    console.error("Failed to load portfolio data", error);
    return fallbackPortfolio;
  }
}

export async function getProjectBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return fallbackPortfolio.projects.find((project) => project.slug === slug) ?? null;
  }

  const project = await getPrisma().project.findUnique({ where: { slug } });
  return project;
}

export async function getAdminData() {
  const prisma = getPrisma();

  const [
    settings,
    projects,
    skillCategories,
    skills,
    experiences,
    contacts,
    conversations,
    notes,
  ] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.skillCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" }, include: { category: true } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.chatConversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    }),
    prisma.note.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return {
    settings,
    projects,
    skillCategories,
    skills,
    experiences,
    contacts,
    conversations,
    notes,
  };
}
