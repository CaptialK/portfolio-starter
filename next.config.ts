import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Ship the content folders with the site when it's deployed.
   *
   * This site reads its words off disk: `projects/` for your projects,
   * `content/` for the course text and the about page. Almost all of that
   * happens while the site is being built, so the pages come out as plain HTML
   * and never touch the disk again.
   *
   * The exception is `/project-media`, which serves the images inside
   * `projects/`. Every image that exists at build time is worked out then, but
   * if anything ever asks for one that wasn't, that request runs on the server
   * and needs the folder to actually be there.
   *
   * Hosts like Vercel only upload the files they can see being imported, and
   * a folder read by name at runtime isn't one of them. This tells them to
   * include it anyway. Without it, a project image can 404 in production while
   * working perfectly on your own machine — the worst kind of bug to find.
   */
  outputFileTracingIncludes: {
    "/project-media/*": ["./projects/**/*"],
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
