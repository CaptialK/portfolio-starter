import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideRuntime } from "@/components/guide/guide-runtime";
import { WordsDrawer } from "@/components/guide/words-drawer";
import "@/content/guide/setup-guide.css";

export const metadata: Metadata = {
  title: "Setup walkthrough",
  description:
    "Every download and every command, in order, for a designer who has never opened a terminal.",
};

/**
 * The Day 0 setup walkthrough.
 *
 * The walkthrough itself is hand-written HTML in content/guide/, not MDX and
 * not components, because it is a self-contained document with its own layout:
 * a contents list that follows you down the page, terminal windows, a progress
 * bar. It is read when the site is built and dropped in here.
 *
 * Its styling is scoped under `.guide` and takes its colours from the tokens in
 * app/globals.css, so changing the accent colour changes this page too.
 *
 * The HTML is a file in this project that we wrote ourselves. It is not
 * anything a visitor can supply, so dropping it in directly is safe here.
 */
export default function SetupGuidePage() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "content", "guide", "setup-guide.html"),
    "utf8",
  );

  return (
    <>
      <div className="mx-auto flex max-w-page items-center justify-between gap-step-3 px-step-4 pt-step-4 md:px-step-5">
        <Link href="/guide" className="font-mono text-xs text-muted no-underline hover:text-ink">
          ← Guide
        </Link>
        <WordsDrawer />
      </div>

      <div className="guide" dangerouslySetInnerHTML={{ __html: html }} />
      <GuideRuntime />
    </>
  );
}
