import type { PublicPortfolio } from "./types";

const image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85";

export const fallbackPortfolio: PublicPortfolio = {
  settings: {
    ownerName: "Lorenzo Sciotti",
    professionalTitle: "Full Stack Developer",
    headline: "Creo prodotti web veloci, eleganti e pronti a scalare.",
    heroKicker: "Portfolio premium full-stack",
    heroDescription:
      "Sviluppo esperienze digitali complete con frontend raffinati, backend solidi e una cura ossessiva per performance, UX e affidabilita.",
    about:
      "Sono un Full Stack Developer orientato al prodotto. Trasformo problemi complessi in applicazioni chiare, sicure e piacevoli da usare, lavorando tra UI, API, database, automazioni e deploy.",
    location: "Italy / Remote",
    email: "lsdevteams@gmail.com",
    availability: "Open to full-time and high-impact freelance",
    cvUrl: "/cv.html",
    primaryCtaLabel: "View Projects",
    primaryCtaHref: "#projects",
    secondaryCtaLabel: "Contact Me",
    secondaryCtaHref: "#contact",
    githubUrl: "https://github.com/",
    linkedinUrl: "https://linkedin.com/",
    twitterUrl: "https://x.com/",
    websiteUrl: "https://lorenzoSciotti.dev",
    accentName: "Aurora Cyan",
    onlineStatus: true,
    seoTitle: "Lorenzo Sciotti - Full Stack Developer",
    seoDescription:
      "Portfolio premium full-stack con Next.js, TypeScript, Prisma, PostgreSQL e admin dashboard.",
    ogImage: image,
  },
  skillCategories: [
    {
      id: "frontend",
      name: "Frontend Engineering",
      description: "Interfacce responsive, accessibili e memorabili.",
      order: 0,
      skills: [
        { id: "next", name: "Next.js", level: 96, description: null, featured: true, order: 0 },
        { id: "react", name: "React", level: 94, description: null, featured: true, order: 1 },
        { id: "ts", name: "TypeScript", level: 92, description: null, featured: true, order: 2 },
        { id: "motion", name: "Framer Motion", level: 88, description: null, featured: false, order: 3 },
      ],
    },
    {
      id: "backend",
      name: "Backend & Data",
      description: "API, auth e database con architettura pulita.",
      order: 1,
      skills: [
        { id: "node", name: "Node.js", level: 91, description: null, featured: true, order: 0 },
        { id: "postgres", name: "PostgreSQL", level: 88, description: null, featured: true, order: 1 },
        { id: "prisma", name: "Prisma", level: 90, description: null, featured: true, order: 2 },
      ],
    },
  ],
  projects: [
    {
      id: "nebula",
      title: "Nebula Commerce OS",
      slug: "nebula-commerce-os",
      category: "SaaS",
      status: "LIVE",
      summary: "Dashboard commerce con analytics live, catalogo e workflow operativi.",
      description:
        "Piattaforma full-stack per team e-commerce con UI premium, dati strutturati e automazioni backend.",
      impact: "+38% speed-to-insight",
      role: "Lead Full Stack Developer",
      client: "Scaleup retail B2B",
      imageUrl: image,
      images: [image],
      stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/",
      featured: true,
      order: 0,
    },
  ],
  experiences: [
    {
      id: "independent",
      title: "Full Stack Developer",
      organization: "Independent / Remote",
      type: "WORK",
      location: "Remote",
      startDate: "2024-01-01T00:00:00.000Z",
      endDate: null,
      current: true,
      summary:
        "Progetto e sviluppo applicazioni full-stack con focus su UI premium, backend affidabili e performance.",
      highlights: ["Next.js App Router", "Prisma + PostgreSQL", "Design systems"],
      order: 0,
    },
  ],
  notes: [
    {
      id: "note",
      title: "Come penso una dashboard premium",
      slug: "dashboard-premium",
      excerpt: "Gerarchia visiva, densita informativa e micro-interazioni nei prodotti B2B.",
      content: "Una dashboard premium deve aiutare a decidere, non solo mostrare dati.",
      imageUrl: image,
      tags: ["UX", "Dashboard"],
      publishedAt: "2026-02-14T00:00:00.000Z",
    },
  ],
};
