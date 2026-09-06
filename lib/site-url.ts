import { site } from "@/content/site";

/**
 * The address this site lives at.
 *
 * Used for the sharing previews, `sitemap.xml` and `robots.txt` — all of which
 * need the full address, not just `/about`.
 *
 * Set `url` in content/site.ts once you have a domain. Until you do, this falls
 * back to whatever address the host gave the deploy, so the first push is
 * already correct and there's nothing to configure. Locally it's just
 * localhost.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is set by Vercel itself — it isn't something
 * you add anywhere. It's the stable `your-project.vercel.app` address rather
 * than the one-off address each individual deploy gets, which is what a sitemap
 * wants.
 */

/** The value shipped in the template, which means "not set yet". */
const PLACEHOLDER = "https://example.com";

export function siteUrl(): string {
  // Widened to string on purpose. `site` is declared `as const`, so while the
  // placeholder is still in there TypeScript knows `site.url` can only ever be
  // that exact text — and would narrow the check below to "impossible" and
  // complain. Widening keeps this working whatever you set it to.
  const configured: string = site.url;

  if (configured && configured !== PLACEHOLDER) {
    return configured.replace(/\/$/, "");
  }

  const fromHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (fromHost) return `https://${fromHost}`;

  return "http://localhost:3000";
}
