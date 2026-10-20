import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteOrigin, indexable } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin || !indexable) return [];
  return ["", "/work", "/about", "/services", "/contact", ...projects.map(p => `/work/${p.slug}`)].map(path => ({ url: `${siteOrigin}${path}`, changeFrequency: "monthly", priority: path ? .7 : 1 }));
}
