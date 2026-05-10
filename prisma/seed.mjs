import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const projectImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Lorenzo Sciotti", passwordHash },
    create: {
      email: adminEmail,
      name: "Lorenzo Sciotti",
      passwordHash,
      role: "ADMIN",
    },
  });

  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ownerName: "Lorenzo Sciotti",
        professionalTitle: "Full Stack Developer",
        headline: "Creo prodotti web veloci, eleganti e pronti a scalare.",
        heroKicker: "Disponibile per team ambiziosi e prodotti reali",
        heroDescription:
          "Sviluppo esperienze digitali complete: interfacce premium, backend robusti, automazioni e architetture pulite. Porto un approccio da product engineer, con attenzione maniacale a performance, UX e affidabilita.",
        about:
          "Sono un Full Stack Developer orientato al prodotto: trasformo idee complesse in applicazioni chiare, misurabili e piacevoli da usare. Lavoro tra frontend moderno, API, database, autenticazione e deployment, con un occhio costante alla qualita del codice e all'esperienza finale.",
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
          "Portfolio premium di Lorenzo Sciotti, Full Stack Developer specializzato in Next.js, TypeScript, backend scalabili e product design.",
        ogImage: projectImages[0],
      },
    });
  } else {
    await prisma.siteSettings.create({
      data: {
        ownerName: "Lorenzo Sciotti",
        professionalTitle: "Full Stack Developer",
        headline: "Creo prodotti web veloci, eleganti e pronti a scalare.",
        heroKicker: "Disponibile per team ambiziosi e prodotti reali",
        heroDescription:
          "Sviluppo esperienze digitali complete: interfacce premium, backend robusti, automazioni e architetture pulite. Porto un approccio da product engineer, con attenzione maniacale a performance, UX e affidabilita.",
        about:
          "Sono un Full Stack Developer orientato al prodotto: trasformo idee complesse in applicazioni chiare, misurabili e piacevoli da usare. Lavoro tra frontend moderno, API, database, autenticazione e deployment, con un occhio costante alla qualita del codice e all'esperienza finale.",
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
          "Portfolio premium di Lorenzo Sciotti, Full Stack Developer specializzato in Next.js, TypeScript, backend scalabili e product design.",
        ogImage: projectImages[0],
      },
    });
  }

  await prisma.skillCategory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.note.deleteMany();

  const categories = [
    {
      name: "Frontend Engineering",
      description: "Interfacce responsive, accessibili e performanti con animazioni curate.",
      skills: [
        ["Next.js", 96, true],
        ["React", 94, true],
        ["TypeScript", 92, true],
        ["Tailwind CSS", 90, true],
        ["Framer Motion", 88, false],
      ],
    },
    {
      name: "Backend & Data",
      description: "API, database e logica server solide, sicure e mantenibili.",
      skills: [
        ["Node.js", 91, true],
        ["PostgreSQL", 88, true],
        ["Prisma", 90, true],
        ["Server Actions", 86, false],
        ["Auth & Security", 84, false],
      ],
    },
    {
      name: "Product Delivery",
      description: "Dal concept al deploy con attenzione a UX, metriche e affidabilita.",
      skills: [
        ["System Design", 86, true],
        ["Vercel", 90, false],
        ["SEO & Performance", 87, true],
        ["Design Systems", 84, false],
        ["CI/CD", 82, false],
      ],
    },
  ];

  for (const [index, category] of categories.entries()) {
    await prisma.skillCategory.create({
      data: {
        name: category.name,
        description: category.description,
        order: index,
        skills: {
          create: category.skills.map(([name, level, featured], skillIndex) => ({
            name,
            level,
            featured,
            order: skillIndex,
            description: `${name} applicato in progetti reali con focus su qualita, scalabilita e UX.`,
          })),
        },
      },
    });
  }

  await prisma.project.createMany({
    data: [
      {
        title: "Nebula Commerce OS",
        slug: "nebula-commerce-os",
        category: "SaaS",
        status: "LIVE",
        summary: "Dashboard commerce con analytics live, gestione catalogo e automazioni operative.",
        description:
          "Una piattaforma full-stack per team e-commerce che centralizza ordini, inventario, metriche e workflow. Architettura App Router, API server-side e UI ad alta densita progettata per decisioni rapide.",
        impact: "+38% speed-to-insight per il team operations",
        role: "Lead Full Stack Developer",
        client: "Scaleup retail B2B",
        imageUrl: projectImages[0],
        images: [projectImages[0], projectImages[1]],
        stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind"],
        demoUrl: "https://example.com",
        repoUrl: "https://github.com/",
        featured: true,
        order: 0,
      },
      {
        title: "Atlas AI Workspace",
        slug: "atlas-ai-workspace",
        category: "AI Tool",
        status: "LIVE",
        summary: "Workspace AI per generare report, tracciare decisioni e collaborare su knowledge base.",
        description:
          "Applicazione product-grade con streaming responses, salvataggio generazioni, gestione team e storico conversazioni. Focus su UX, sicurezza dei dati e controllo dei costi.",
        impact: "-52% tempo medio di preparazione report",
        role: "Product Engineer",
        client: "Consulting studio",
        imageUrl: projectImages[1],
        images: [projectImages[1], projectImages[2]],
        stack: ["Next.js", "AI SDK", "PostgreSQL", "Prisma", "shadcn/ui", "Vercel"],
        demoUrl: "https://example.com",
        repoUrl: "https://github.com/",
        featured: true,
        order: 1,
      },
      {
        title: "Pulse Ops Platform",
        slug: "pulse-ops-platform",
        category: "Dashboard",
        status: "LIVE",
        summary: "Pannello operativo per monitorare incident, SLA, metriche e workflow cross-team.",
        description:
          "Dashboard responsive con viste realtime-like, filtri avanzati, autorizzazioni admin e componenti riutilizzabili per team operativi ad alta pressione.",
        impact: "99.9% uptime monitorato con flussi piu chiari",
        role: "Frontend + Backend",
        client: "Operations team",
        imageUrl: projectImages[2],
        images: [projectImages[2], projectImages[3]],
        stack: ["React", "Node.js", "Prisma", "PostgreSQL", "Framer Motion"],
        demoUrl: "https://example.com",
        repoUrl: "https://github.com/",
        featured: true,
        order: 2,
      },
      {
        title: "Signal Portfolio Engine",
        slug: "signal-portfolio-engine",
        category: "Portfolio",
        status: "IN_PROGRESS",
        summary: "CMS personale per portfolio dinamici, contatti, chat e contenuti editoriali.",
        description:
          "Un sistema single-project deployabile su Vercel che unisce esperienza pubblica, admin CRUD, chat visitor-admin e contenuti SEO-friendly.",
        impact: "Contenuti aggiornabili senza toccare codice",
        role: "Full Stack Developer",
        client: "Personal brand",
        imageUrl: projectImages[3],
        images: [projectImages[3], projectImages[0]],
        stack: ["Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
        demoUrl: "https://example.com",
        repoUrl: "https://github.com/",
        featured: false,
        order: 3,
      },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        title: "Full Stack Developer",
        organization: "Independent / Remote",
        type: "WORK",
        location: "Remote",
        startDate: new Date("2024-01-01"),
        current: true,
        summary:
          "Progetto e sviluppo applicazioni full-stack per startup, creator e team prodotto con focus su velocita, UI premium e backend affidabili.",
        highlights: [
          "Delivery end-to-end di dashboard SaaS, landing dinamiche e strumenti interni",
          "Stack moderno con Next.js, Prisma, PostgreSQL, Vercel e design system",
          "Ottimizzazione performance, accessibilita e conversione",
        ],
        order: 0,
      },
      {
        title: "Frontend Engineer",
        organization: "Product Studio",
        type: "WORK",
        location: "Milan / Hybrid",
        startDate: new Date("2022-04-01"),
        endDate: new Date("2023-12-31"),
        summary:
          "Ho costruito interfacce web per prodotti B2B, contribuendo a component library, flussi onboarding e dashboard analytics.",
        highlights: [
          "Riduzione del time-to-ship grazie a componenti riutilizzabili",
          "Collaborazione stretta con designer e stakeholder business",
          "Standardizzazione di pattern accessibili e responsive",
        ],
        order: 1,
      },
      {
        title: "Advanced TypeScript & Cloud Apps",
        organization: "Professional Certification",
        type: "CERTIFICATION",
        location: "Online",
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-09-01"),
        summary:
          "Percorso focalizzato su TypeScript avanzato, architetture serverless, database relazionali e deployment cloud.",
        highlights: ["Type-safe APIs", "Serverless deployments", "Data modeling"],
        order: 2,
      },
    ],
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Giulia Bianchi",
        email: "giulia@example.com",
        company: "Northstar Labs",
        subject: "Collaborazione su dashboard SaaS",
        message:
          "Ciao Lorenzo, stiamo cercando un full stack developer per rifinire una dashboard B2B. Il tuo portfolio sembra molto in linea.",
        status: "UNREAD",
      },
      {
        name: "Marco Verdi",
        email: "marco@example.com",
        company: "Studio Venture",
        subject: "Audit performance Next.js",
        message:
          "Vorremmo migliorare Lighthouse e UX mobile di un prodotto gia online. Possiamo sentirci questa settimana?",
        status: "READ",
      },
    ],
  });

  const conversation = await prisma.chatConversation.create({
    data: {
      visitorId: "demo-visitor",
      visitorName: "Demo Visitor",
      visitorEmail: "demo@example.com",
      unreadAdmin: 1,
      messages: {
        create: [
          {
            sender: "VISITOR",
            body: "Ciao, mi interessa capire se sei disponibile per un progetto full-stack.",
          },
          {
            sender: "ADMIN",
            body: "Ciao! Si, raccontami pure obiettivi, timeline e stack attuale.",
          },
        ],
      },
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  await prisma.note.createMany({
    data: [
      {
        title: "Come penso una dashboard premium",
        slug: "dashboard-premium",
        excerpt:
          "Una breve nota su gerarchia visiva, densita informativa e micro-interazioni nei prodotti B2B.",
        content:
          "Una dashboard premium non e una collezione di card: e un sistema per prendere decisioni. La priorita e ridurre attrito cognitivo, rendere leggibili i cambiamenti e progettare stati vuoti, loading ed errori come parti reali del prodotto.",
        imageUrl:
          "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1400&q=85",
        tags: ["UX", "Dashboard", "Product"],
        published: true,
        publishedAt: new Date("2026-02-14"),
      },
      {
        title: "Perche scelgo Next.js per portfolio dinamici",
        slug: "nextjs-portfolio-dinamici",
        excerpt:
          "App Router, Server Actions e database in un unico progetto rendono il portfolio un prodotto vivo.",
        content:
          "Un portfolio moderno deve poter cambiare senza deploy continui. Next.js permette di unire UI, API, server actions, SEO e admin in una sola codebase deployabile su Vercel.",
        imageUrl:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85",
        tags: ["Next.js", "Architecture", "Portfolio"],
        published: true,
        publishedAt: new Date("2026-03-21"),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
