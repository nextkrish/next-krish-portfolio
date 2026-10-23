import type { Metadata, Viewport } from "next";
import { siteOrigin, indexable } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { profile, socials } from "@/lib/content";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MotionProvider, MotionToggle } from "@/components/motion-provider";
import { MotionRuntime } from "@/components/motion-runtime";
import { TransitionProvider } from "@/components/transition-link";

const sans = localFont({ src: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", variable: "--type-sans", display: "swap", weight: "100 1000" });
const serif = localFont({ src: [
  { path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
  { path: "../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
], variable: "--type-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin || "http://127.0.0.1:3000"),
  title: { default: "Next Krish — I cook Projects!", template: "%s — Next Krish" },
  description: "Krish Kumar — BCA student and website developer. Thoughtful websites, expressive interactions, and a little curiosity. Open to projects and opportunities.",
  authors: [{ name: "Krish Kumar" }],
  openGraph: { title: "Next Krish — I cook Projects!", description: "Thoughtful websites. Expressive interactions. Explore the work of Krish Kumar.", type: "website", locale: "en_IN", siteName: "Next Krish" },
  twitter: { card: "summary_large_image" },
  creator: "Krish Kumar",
  applicationName: "Next Krish",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  category: "technology",
  robots: { index: indexable, follow: true, googleBot: { index: indexable, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};
export const viewport: Viewport = { themeColor: "#080808", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable} is-loading`}><body id="top"><StructuredData data={{ "@context": "https://schema.org", "@graph": [{ "@type": "Person", "@id": siteOrigin ? `${siteOrigin}/#krish` : undefined, name: "Krish Kumar", alternateName: ["Next Krish", "NextKrish", "nextkrish"], url: siteOrigin || undefined, image: siteOrigin ? `${siteOrigin}/images/portrait-warm.webp` : undefined, description: profile.copy.about, jobTitle: "Website developer and BCA student", knowsAbout: ["website development", "landing pages", "business websites", "web design"], sameAs: socials.map(link => link.href), email: profile.contact.publicEmail, affiliation: { "@type": "CollegeOrUniversity", name: "St. Johns College, Agra" } }, ...(siteOrigin ? [{ "@type": "WebSite", "@id": `${siteOrigin}/#website`, name: "Next Krish", alternateName: ["NextKrish", "Krish Kumar Portfolio"], url: siteOrigin, inLanguage: "en-IN", publisher: { "@id": `${siteOrigin}/#krish` } }, { "@type": "ProfilePage", "@id": `${siteOrigin}/#profile`, name: "Next Krish — Krish Kumar", url: siteOrigin, inLanguage: "en-IN", mainEntity: { "@id": `${siteOrigin}/#krish` }, isPartOf: { "@id": `${siteOrigin}/#website` } }] : [])] }} /><noscript><style>{`html.is-loading{overflow:auto!important}.site-loader{display:none!important}[data-reveal="hero"]{opacity:1!important}`}</style></noscript><MotionProvider><TransitionProvider><a href="#main-content" className="skip-link">Skip to content</a><Navbar /><div id="page-content"><main id="main-content" tabIndex={-1}>{children}</main><Footer /></div><MotionRuntime /><MotionToggle /></TransitionProvider></MotionProvider></body></html>;
}
