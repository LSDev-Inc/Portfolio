import type { Metadata } from "next";

import { HomeExperience } from "@/components/landing/home-experience";
import { getPortfolioData } from "@/lib/portfolio/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPortfolioData();

  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      type: "profile",
      images: settings.ogImage ? [settings.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: settings.ogImage ? [settings.ogImage] : undefined,
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function Home() {
  const data = await getPortfolioData();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.settings.ownerName,
    jobTitle: data.settings.professionalTitle,
    email: data.settings.email,
    url: data.settings.websiteUrl,
    sameAs: [
      data.settings.githubUrl,
      data.settings.linkedinUrl,
      data.settings.twitterUrl,
    ].filter(Boolean),
    knowsAbout: data.skillCategories.flatMap((category) =>
      category.skills.map((skill) => skill.name),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeExperience data={data} />
    </>
  );
}
