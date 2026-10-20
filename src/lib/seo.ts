import type { Metadata } from "next";

export function getSiteOrigin(env: Record<string, string | undefined>): string | null {
  const candidate = env.NEXT_PUBLIC_SITE_URL
    || env.URL
    || env.DEPLOY_PRIME_URL
    || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && !["localhost", "127.0.0.1"].includes(url.hostname) ? url.origin : null;
  } catch { return null; }
}
export const siteOrigin = getSiteOrigin(process.env);
const isPreview = process.env.VERCEL_ENV === "preview"
  || ["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT || "");
export const indexable = Boolean(siteOrigin) && !isPreview;
export const absoluteUrl = (path = "/") => siteOrigin ? `${siteOrigin}${path}` : undefined;

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title, description,
    ...(siteOrigin ? { alternates: { canonical: absoluteUrl(path) } } : {}),
    openGraph: { title: `${title} — Next Krish`, description, url: absoluteUrl(path), siteName: "Next Krish", type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title: `${title} — Next Krish`, description },
  };
}

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
