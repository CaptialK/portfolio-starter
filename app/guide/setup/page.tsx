import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { GuideRuntime } from "@/components/guide/guide-runtime";
import "@/content/guide/setup-guide.css";

export const metadata: Metadata = {
  title: "Setup guide",
  description:
    "Every download and every command, in order, for a designer who has never opened a terminal.",
};

/**
 * The Day 0 setup guide.
 *
 * The guide is hand-written HTML in content/guide/, not MDX and not components,
 * because it is a self-contained document with its own layout: a sticky contents
 * rail, terminal windows, a progress bar. Read at build time and injected here.
 *
 * Its CSS is scoped under `.guide` and takes its palette from the design tokens
 * in app/globals.css, so changing the accent colour changes the guide too.
 *
 * The HTML is a file in this repo that we wrote. It is not user input, so
 * dangerouslySetInnerHTML is the right tool and not a risk here.
 */
export default function SetupGuidePage() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "content", "guide", "setup-guide.html"),
    "utf8",
  );

  return (
    <>
      <div className="guide" dangerouslySetInnerHTML={{ __html: html }} />
      <GuideRuntime />
    </>
  );
}
