import { siteConfig } from "@/site.config";

/**
 * Whether the guide shows.
 *
 * Two things can switch it on, and only one of them needs to be true:
 *
 * - You're running `npm run dev`. The guide is always there on your own
 *   machine, whatever the setting says, because that's where you read it.
 * - `showGuide` is true in site.config.ts. That's the one that decides whether
 *   strangers can see it.
 *
 * So flipping `showGuide` to false takes the guide off your live site and
 * changes nothing at localhost:3000.
 *
 * Both the pages and the nav link read this one value, so they can't disagree
 * about it — no "the link is there but the page 404s".
 */
export const guideIsVisible =
  process.env.NODE_ENV === "development" || siteConfig.showGuide;
