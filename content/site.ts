/**
 * Everything about you, in one file.
 *
 * This is the first file to edit and the one you'll come back to most. Nothing
 * here is code you need to understand: it's a list of labelled values. Change
 * the text between the quotes, save, and the whole site updates.
 *
 * Values marked PLACEHOLDER are stand-ins. Replace every one of them before
 * you show this site to anybody.
 */

export type NavLink = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
};

export const site = {
  /** PLACEHOLDER. Your name, as you want it read. */
  name: "Your Name",

  /** PLACEHOLDER. What you are. Short. Goes under your name and in the header. */
  role: "Product Designer",

  /**
   * PLACEHOLDER. One sentence for the homepage. Say what you do and who for.
   * Not a slogan. A hiring manager should finish it knowing what you'd be
   * hired to do.
   */
  tagline:
    "I design interfaces for complicated products, and I build them well enough to prove they work.",

  /** PLACEHOLDER. The email you want in your inbox. Shown on every page. */
  email: "you@example.com",

  /** PLACEHOLDER. Where you are. Used in the footer and the about page. */
  location: "City, Country",

  /**
   * PLACEHOLDER. The live address of this site, once you have a domain.
   * Used for social sharing previews. Keep the https:// and no trailing slash.
   */
  url: "https://example.com",

  /** The pages in the header. Remove /guide once you're done with the guide. */
  nav: [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/guide", label: "Guide" },
  ] satisfies NavLink[],

  /** PLACEHOLDER. Delete any you don't have. Add any you do. */
  socials: [
    { href: "https://github.com/your-username", label: "GitHub" },
    { href: "https://www.linkedin.com/in/your-username", label: "LinkedIn" },
    { href: "https://read.cv/your-username", label: "Read.cv" },
  ] satisfies SocialLink[],
} as const;

export type Site = typeof site;
