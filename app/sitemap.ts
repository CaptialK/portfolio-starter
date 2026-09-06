import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getCaseStudySlugs } from "@/lib/content";

/**
 * The list of pages search engines should know about.
 *
 * Generated from the same content the site is, so a new case study is in the
 * sitemap the moment its file exists. Set `url` in content/site.ts first, or
 * every entry here points at example.com.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/work",
    "/about",
    "/guide",
    "/guide/course",
    "/guide/setup",
    ...getCaseStudySlugs().map((slug) => `/work/${slug}`),
  ];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));
}
