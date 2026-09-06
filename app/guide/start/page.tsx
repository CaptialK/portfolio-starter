import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import {
  fencedBlocks,
  getPromptsIntro,
  getQuickstartPrompts,
  getSection,
  withoutFences,
} from "@/lib/crash-course";
import { mdxComponents } from "@/components/mdx-components";
import { WordsDrawer } from "@/components/guide/words-drawer";
import { FolderTree } from "@/components/guide/folder-tree";
import { CopyButton } from "@/components/guide/copy-button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Hoverable } from "@/components/motion/hoverable";

export const metadata: Metadata = {
  title: "Quick start",
  description:
    "Add a folder, get a page. How to put your first project into the site.",
};

/**
 * Quick start: putting your first project in.
 *
 * Every word of the course text comes from content/crash-course.md, rendered as
 * written. The four prompts especially — they're meant to be pasted exactly,
 * so they're read from the file rather than retyped here.
 *
 * A working page, not a show: Reveal and Stagger only, plus Hoverable on the
 * prompt cards because they're the thing you click.
 */

/** A static block styled like a terminal window. Nothing types itself. */
function TerminalBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-black">
      <div className="flex items-center gap-step-2 border-b border-line px-step-3 py-step-2">
        <span aria-hidden className="flex gap-step-1">
          <span className="block size-step-2 rounded-full bg-line" />
          <span className="block size-step-2 rounded-full bg-line" />
          <span className="block size-step-2 rounded-full bg-line" />
        </span>
        <span className="flex-1 font-mono text-xs text-muted">{title}</span>
      </div>
      <pre className="m-0 overflow-x-auto p-step-4 font-mono text-xs leading-relaxed text-ink/85">
        {children}
      </pre>
    </div>
  );
}

/** Renders a chunk of the course text as written. */
async function Prose({ markdown }: { markdown: string }) {
  const { content } = await compileMDX({
    source: markdown,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  return <>{content}</>;
}

export default async function QuickStartPage() {
  const intro = getSection("quickstart", "intro");
  const folder = getSection("quickstart", "folder");
  const steps = getSection("quickstart", "steps");
  const template = getSection("quickstart", "template");
  const rules = getSection("quickstart", "rules");
  const hideGuide = getSection("quickstart", "hide-guide");
  const explore = getSection("explore", "explore");

  const prompts = getQuickstartPrompts();
  const tree = fencedBlocks(folder.body)[0] ?? "";
  const templateFile = fencedBlocks(template.body)[0] ?? "";
  const hideGuideLine = fencedBlocks(hideGuide.body)[0] ?? "";

  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="py-step-5">
        <div className="mb-step-3 flex items-center justify-between gap-step-3">
          <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">
            Quick start
          </p>
          <WordsDrawer />
        </div>

        <Reveal mode="settle">
          <h1 className="mb-step-3 max-w-measure text-xl text-ink">
            {intro.heading}
          </h1>
        </Reveal>
        <div className="max-w-measure text-md text-ink/85">
          <Prose markdown={intro.body} />
        </div>
      </header>

      {/* ---------------------------------------------------------- folder */}
      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-4 text-lg text-ink">{folder.heading}</h2>
        <Reveal>
          <FolderTree tree={tree} />
        </Reveal>
        <div className="mt-step-4 max-w-measure text-sm text-ink/85">
          <Prose markdown={withoutFences(folder.body)} />
        </div>
      </section>

      {/* ----------------------------------------------------------- steps */}
      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-4 text-lg text-ink">{steps.heading}</h2>
        <Stagger as="ol" className="m-0 grid list-none gap-step-3 p-0">
          {steps.body
            .split("\n")
            .filter((line) => /^\d+\.\s/.test(line.trim()))
            .map((line, i) => (
              <StaggerItem
                as="li"
                key={i}
                className="flex gap-step-3 rounded-lg border border-line bg-panel p-step-4"
              >
                <span className="font-mono text-xs text-accent">{i + 1}</span>
                <div className="min-w-0 max-w-measure text-sm text-ink/85 [&_p]:mb-0">
                  <Prose markdown={line.replace(/^\s*\d+\.\s*/, "")} />
                </div>
              </StaggerItem>
            ))}
        </Stagger>
      </section>

      {/* -------------------------------------------------------- template */}
      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-2 text-lg text-ink">{template.heading}</h2>
        <p className="mb-step-4 max-w-measure text-sm text-muted">
          This is what you get when you duplicate the template. Fill in the top
          six lines; leave the rest until you have the words.
        </p>
        <Reveal>
          <TerminalBlock title="projects/_template/project.md">
            {templateFile}
          </TerminalBlock>
        </Reveal>
      </section>

      {/* --------------------------------------------------------- prompts */}
      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-3 text-lg text-ink">
          Prompts you can paste right now
        </h2>
        <div className="mb-step-4 max-w-measure text-sm text-ink/85">
          <Prose markdown={getPromptsIntro()} />
        </div>

        <Stagger as="ul" className="m-0 grid list-none gap-step-3 p-0 lg:grid-cols-2">
          {prompts.map((prompt) => (
            <StaggerItem as="li" key={prompt.letter} className="min-w-0">
              <Hoverable className="flex h-full min-w-0 flex-col rounded-lg border border-line bg-panel p-step-4">
                <div className="mb-step-2 flex items-baseline justify-between gap-step-3">
                  <h3 className="font-sans text-sm font-semibold tracking-normal text-ink">
                    <span className="font-mono text-accent">{prompt.letter}</span>{" "}
                    {prompt.title}
                  </h3>
                  <CopyButton text={prompt.text} />
                </div>
                <p className="mb-step-3 text-xs text-muted">{prompt.when}</p>
                <pre className="m-0 flex-1 overflow-x-auto rounded border border-line bg-black p-step-3 font-mono text-xs whitespace-pre-wrap text-ink/85">
                  {prompt.text}
                </pre>
              </Hoverable>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ----------------------------------------------------------- rules */}
      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-4 text-lg text-ink">{rules.heading}</h2>
        <Stagger as="ul" className="m-0 grid list-none gap-step-3 p-0 md:grid-cols-3">
          {rules.body
            .split("\n")
            .filter((line) => line.trim().startsWith("- "))
            .map((line, i) => (
              <StaggerItem
                as="li"
                key={i}
                className="rounded-lg border border-line bg-panel p-step-4 text-sm text-ink/85 [&_p]:mb-0"
              >
                <Prose markdown={line.replace(/^\s*-\s*/, "")} />
              </StaggerItem>
            ))}
        </Stagger>
      </section>

      {/* ------------------------------------------------------ hide-guide */}
      <section className="border-t border-line py-step-5">
        <h2 className="mb-step-3 text-lg text-ink">{hideGuide.heading}</h2>
        <div className="mb-step-4 max-w-measure text-sm text-ink/85">
          <Prose markdown={withoutFences(hideGuide.body)} />
        </div>
        <Reveal>
          <div className="max-w-measure">
            <TerminalBlock title="site.config.ts">{hideGuideLine}</TerminalBlock>
          </div>
        </Reveal>
      </section>

      {/* --------------------------------------------------------- explore */}
      <section className="border-t border-line py-step-5">
        <Reveal>
          <div className="rounded-lg border border-line bg-panel p-step-5">
            <p className="mb-step-3 font-mono text-xs tracking-[0.12em] text-accent uppercase">
              Last page
            </p>
            <h2 className="mb-step-4 max-w-measure text-lg text-ink">
              {explore.heading}
            </h2>
            <div className="max-w-measure text-sm text-ink/85">
              <Prose markdown={explore.body} />
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-line py-step-5">
        <Link href="/guide/motion" className="font-mono text-xs text-accent no-underline">
          Next: the motion cookbook →
        </Link>
      </footer>
    </div>
  );
}
