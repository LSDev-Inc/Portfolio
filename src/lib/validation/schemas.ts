import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Inserisci una email valida.").trim().toLowerCase(),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri."),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Il nome e troppo corto."),
  email: z.email("Inserisci una email valida.").trim().toLowerCase(),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(4, "Oggetto troppo corto."),
  message: z.string().trim().min(12, "Scrivi almeno 12 caratteri."),
});

export const chatMessageSchema = z.object({
  visitorId: z.string().trim().min(8),
  visitorName: z.string().trim().max(120).optional().or(z.literal("")),
  visitorEmail: z.email().optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2),
  status: z.enum(["LIVE", "IN_PROGRESS", "ARCHIVED"]),
  summary: z.string().trim().min(10),
  description: z.string().trim().min(20),
  impact: z.string().trim().min(3),
  role: z.string().trim().min(2),
  client: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.url(),
  stack: z.string().trim().min(2),
  demoUrl: z.url().optional().or(z.literal("")),
  repoUrl: z.url().optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const skillCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2),
  description: z.string().trim().min(8),
  order: z.coerce.number().int().default(0),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2),
  level: z.coerce.number().int().min(0).max(100),
  description: z.string().trim().optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  categoryId: z.string().min(1),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2),
  organization: z.string().trim().min(2),
  type: z.enum(["WORK", "EDUCATION", "CERTIFICATION", "MILESTONE"]),
  location: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().min(4),
  endDate: z.string().optional().or(z.literal("")),
  current: z.coerce.boolean().default(false),
  summary: z.string().trim().min(10),
  highlights: z.string().trim().min(3),
  order: z.coerce.number().int().default(0),
});

export const settingsSchema = z.object({
  ownerName: z.string().trim().min(2),
  professionalTitle: z.string().trim().min(2),
  headline: z.string().trim().min(8),
  heroKicker: z.string().trim().min(3),
  heroDescription: z.string().trim().min(20),
  about: z.string().trim().min(30),
  location: z.string().trim().min(2),
  email: z.email(),
  availability: z.string().trim().min(2),
  cvUrl: z.string().trim().min(1),
  primaryCtaLabel: z.string().trim().min(2),
  primaryCtaHref: z.string().trim().min(1),
  secondaryCtaLabel: z.string().trim().min(2),
  secondaryCtaHref: z.string().trim().min(1),
  githubUrl: z.url().optional().or(z.literal("")),
  linkedinUrl: z.url().optional().or(z.literal("")),
  twitterUrl: z.url().optional().or(z.literal("")),
  websiteUrl: z.url().optional().or(z.literal("")),
  accentName: z.string().trim().min(2),
  onlineStatus: z.coerce.boolean().default(true),
  seoTitle: z.string().trim().min(2),
  seoDescription: z.string().trim().min(20),
  ogImage: z.url().optional().or(z.literal("")),
});

export const adminChatReplySchema = z.object({
  conversationId: z.string().min(1),
  message: z.string().trim().min(1).max(2000),
});

export const noteSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().min(10),
  content: z.string().trim().min(20),
  imageUrl: z.url().optional().or(z.literal("")),
  tags: z.string().trim().min(2),
  published: z.coerce.boolean().default(false),
  publishedAt: z.string().optional().or(z.literal("")),
});
