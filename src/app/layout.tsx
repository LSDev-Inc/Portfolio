import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Premium Full Stack Portfolio",
    template: "%s | Premium Full Stack Portfolio",
  },
  description:
    "Portfolio full-stack premium con Next.js, TypeScript, Prisma, PostgreSQL e dashboard admin.",
  openGraph: {
    type: "website",
    title: "Premium Full Stack Portfolio",
    description:
      "Portfolio full-stack premium con Next.js, TypeScript, Prisma, PostgreSQL e dashboard admin.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Full Stack Portfolio",
    description:
      "Portfolio full-stack premium con Next.js, TypeScript, Prisma, PostgreSQL e dashboard admin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
