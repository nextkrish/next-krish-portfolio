import type { MetadataRoute } from "next";
import { siteOrigin, indexable } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", ...(indexable ? { allow: "/", disallow: "/api/" } : { disallow: "/" }) }, ...(siteOrigin && indexable ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}) };
}
