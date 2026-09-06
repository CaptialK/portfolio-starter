import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getProjectSlugs } from "@/lib/projects";

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
    "/guide/setup",
    ...getProjectSlugs().map((slug) => `/work/${slug}`),
  ];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));
}
