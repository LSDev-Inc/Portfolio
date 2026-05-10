export type PublicSettings = {
  ownerName: string;
  professionalTitle: string;
  headline: string;
  heroKicker: string;
  heroDescription: string;
  about: string;
  location: string;
  email: string;
  availability: string;
  cvUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  accentName: string;
  onlineStatus: boolean;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
};

export type PublicSkill = {
  id: string;
  name: string;
  level: number;
  description: string | null;
  featured: boolean;
  order: number;
};

export type PublicSkillCategory = {
  id: string;
  name: string;
  description: string;
  order: number;
  skills: PublicSkill[];
};

export type PublicProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "LIVE" | "IN_PROGRESS" | "ARCHIVED";
  summary: string;
  description: string;
  impact: string;
  role: string;
  client: string | null;
  imageUrl: string;
  images: string[];
  stack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number;
};

export type PublicExperience = {
  id: string;
  title: string;
  organization: string;
  type: "WORK" | "EDUCATION" | "CERTIFICATION" | "MILESTONE";
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string;
  highlights: string[];
  order: number;
};

export type PublicNote = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
};

export type PublicPortfolio = {
  settings: PublicSettings;
  skillCategories: PublicSkillCategory[];
  projects: PublicProject[];
  experiences: PublicExperience[];
  notes: PublicNote[];
};
