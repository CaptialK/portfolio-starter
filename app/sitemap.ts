import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getProjectSlugs } from "@/lib/projects";
import { guideIsVisible } from "@/lib/guide";

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
    ...(guideIsVisible ? ["/guide", "/guide/setup", "/guide/start", "/guide/motion"] : []),
    ...getProjectSlugs().map((slug) => `/work/${slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl()}${route}`,
    lastModified: new Date(),
  }));
}
