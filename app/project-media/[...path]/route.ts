import fs from "node:fs";
import path from "node:path";
import { PROJECTS_DIR, getProjectSlugs } from "@/lib/projects";

/**
 * Serves the images that live inside `projects/`.
 *
 * WHY THIS IS NEEDED
 * A browser can only fetch files the site actually publishes, and Next only
 * publishes what's in `public/`. Your project images live next to the words
 * that describe them, in `projects/<slug>/`, which is the right place for them
 * and the wrong place for the web. This bridges the two.
 *
 * Every image is listed at build time by `generateStaticParams`, so in a built
 * site these are ordinary files, worked out once. While `npm run dev` is
 * running, a picture you drag into a folder is served immediately — no restart,
 * which is the whole point of the "add a folder, watch it appear" loop.
 */

/** Only these leave the folder. Anything else in there stays private. */
const SERVEABLE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/** Every serveable file under one project folder, as path segments. */
function filesUnder(slug: string): string[][] {
  const root = path.join(PROJECTS_DIR, slug);
  const out: string[][] = [];

  const walk = (dir: string, trail: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const next = [...trail, entry.name];
      if (entry.isDirectory()) walk(path.join(dir, entry.name), next);
      else if (SERVEABLE[path.extname(entry.name).toLowerCase()]) out.push(next);
    }
  };

  walk(root, [slug]);
  return out;
}

export function generateStaticParams() {
  return getProjectSlugs().flatMap((slug) =>
    filesUnder(slug).map((segments) => ({ path: segments })),
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;

  // Resolve, then check the result is still inside projects/. Without this,
  // a crafted address containing ".." could walk out of the folder and read
  // anything on the machine.
  const file = path.resolve(PROJECTS_DIR, ...segments);
  const root = path.resolve(PROJECTS_DIR);
  if (file !== root && !file.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const type = SERVEABLE[path.extname(file).toLowerCase()];
  if (!type || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(fs.readFileSync(file)), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
