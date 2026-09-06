import type { Metadata } from "next";
import Link from "next/link";

import {
  getMeta,
  getSection,
  fencedBlocks,
  parseBullets,
  parseChecklist,
  parseGroups,
  parseOrdered,
  parseProse,
  parseQuotes,
  parseTable,
} from "@/lib/crash-course";

import { WordsDrawer } from "@/components/guide/words-drawer";
import { CourseRail } from "@/components/guide/course-rail";
import {
  Bullets,
  CodeBlock,
  Columns,
  NumberedCards,
  Panel,
  Quote,
  TableRows,
  stripEmphasis,
} from "@/components/guide/course/panel";
import { DayDots } from "@/components/guide/course/day-dots";
import { DevLoop } from "@/components/guide/course/dev-loop";
import { DailyLoop } from "@/components/guide/course/daily-loop";
import { Prompting } from "@/components/guide/course/prompting";
import { SevenDays } from "@/components/guide/course/seven-days";

import { ScrollProgress } from "@/components/motion/scroll-progress";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Hoverable } from "@/components/motion/hoverable";
import { Terminal } from "@/components/motion/terminal";
import { Counter } from "@/components/motion/counter";
import { Check } from "@/components/motion/check";

export const metadata: Metadata = {
  title: "The crash course",
  description:
    "Ship it in 7 days. You design. The AI builds. You decide what's good enough.",
};

/**
 * The crash course, as a page.
 *
 * Every word comes out of content/crash-course.md. That file is the only copy;
 * this one is the layout and nothing else. If a sentence is wrong, it's wrong
 * in the Markdown.
 *
 * Section ids here are the ids in that file, so `/guide#reject-list` lands on
 * the reject list.
 */
/**
 * The panels, in order, for the rail on the right. Kept beside the layout so
 * adding a panel and forgetting its dot isn't possible without noticing.
 */
const RAIL = [
  { id: "meta", title: "Ship it in 7 days" },
  { id: "deal", title: "The deal" },
  { id: "why-not-squarespace", title: "Why not Squarespace" },
  { id: "stack", title: "The stack" },
  { id: "install", title: "Install" },
  { id: "dev-server-loop", title: "The dev server" },
  { id: "content-first", title: "No case studies, no site" },
  { id: "case-study-anatomy", title: "Anatomy" },
  { id: "figma-first", title: "Figma first" },
  { id: "scaffold", title: "Take your copy" },
  { id: "git", title: "Git" },
  { id: "loop", title: "The loop" },
  { id: "prompting", title: "Prompting" },
  { id: "claude-md", title: "CLAUDE.md" },
  { id: "reject-list", title: "The reject list" },
  { id: "live-prototypes", title: "Live prototypes" },
  { id: "seven-days", title: "Seven days" },
  { id: "done", title: "Done means" },
];

export default function CoursePage() {
  const meta = getMeta();
  const s = (id: string) => getSection("section", id);

  const deal = s("deal");
  const why = s("why-not-squarespace");
  const stack = s("stack");
  const install = s("install");
  const devLoop = s("dev-server-loop");
  const contentFirst = s("content-first");
  const anatomy = s("case-study-anatomy");
  const figma = s("figma-first");
  const scaffold = s("scaffold");
  const git = s("git");
  const loop = s("loop");
  const prompting = s("prompting");
  const claudeMd = s("claude-md");
  const reject = s("reject-list");
  const prototypes = s("live-prototypes");
  const sevenDays = s("seven-days");
  const done = s("done");

  const promptQuotes = parseQuotes(prompting.body);

  return (
    <>
      <ScrollProgress />
      <CourseRail sections={RAIL} />

      {/* ------------------------------------------------------------ meta */}
      <section
        id="meta"
        data-course-panel
        data-course-title="Ship it in 7 days"
        className="course-panel flex min-h-svh items-center py-step-6"
      >
        <div className="mx-auto w-full max-w-page px-step-4 md:px-step-5">
          <div className="mb-step-5 flex items-center justify-between gap-step-3">
            <p className="font-mono text-xs tracking-[0.12em] text-accent uppercase">
              Day 0 → Day 7
            </p>
            <WordsDrawer />
          </div>

          <Reveal mode="settle">
            <h1 className="mb-step-4 max-w-measure text-2xl text-ink">
              {meta.title}
            </h1>
          </Reveal>
          <Reveal mode="settle" delay={0.08}>
            <p className="mb-step-6 max-w-measure text-md text-ink/85">
              {meta.subtitle}
            </p>
          </Reveal>

          <DayDots />

          <p className="mt-step-5 font-mono text-xs text-muted">
            Scroll, or press ↓. The dots fill as you go.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ deal */}
      <Panel id="deal" n={1} eyebrow="Ground rules" heading={deal.heading}>
        <Columns groups={parseGroups(deal.body)} strikeSecond />
        <Quote>{parseQuotes(deal.body)[0]}</Quote>
      </Panel>

      {/* --------------------------------------------- why-not-squarespace */}
      <Panel
        id="why-not-squarespace"
        n={2}
        eyebrow="The argument"
        heading={why.heading}
      >
        <NumberedCards items={parseOrdered(why.body)} />
      </Panel>

      {/* ----------------------------------------------------------- stack */}
      <Panel id="stack" n={3} eyebrow="Vocabulary" heading={stack.heading}>
        <Stagger
          as="ul"
          className="m-0 grid list-none gap-step-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {parseTable(stack.body).rows.map((row) => (
            <StaggerItem as="li" key={row.cells[0]} className="min-w-0">
              <Hoverable className="h-full rounded-lg border border-line bg-panel p-step-4">
                <h3 className="mb-step-2 font-mono text-sm text-accent">
                  {row.cells[0]}
                </h3>
                <p className="text-xs text-muted">{row.cells[1]}</p>
              </Hoverable>
            </StaggerItem>
          ))}
        </Stagger>
      </Panel>

      {/* --------------------------------------------------------- install */}
      <Panel id="install" n={4} eyebrow="Day 0" heading={install.heading}>
        <div className="grid gap-step-4 lg:grid-cols-2">
          <div className="min-w-0">
            <TableRows rows={parseTable(install.body).rows} />
          </div>
          <div className="min-w-0">
            <p className="mb-step-3 text-sm text-ink/85">
              {stripEmphasis(parseProse(install.body).slice(-1)[0] ?? "")}
            </p>
            <Terminal
              lines={(fencedBlocks(install.body)[0] ?? "")
                .split("\n")
                .filter(Boolean)
                .map((text) => ({ type: "cmd" as const, text }))}
            />
          </div>
        </div>
      </Panel>

      {/* ------------------------------------------------- dev-server-loop */}
      <Panel
        id="dev-server-loop"
        n={5}
        eyebrow="The method"
        heading={devLoop.heading}
      >
        <DevLoop
          steps={parseOrdered(devLoop.body)}
          after={parseProse(devLoop.body)[0] ?? ""}
        />
        <Quote>{parseQuotes(devLoop.body)[0]}</Quote>
      </Panel>

      {/* --------------------------------------------------- content-first */}
      <Panel
        id="content-first"
        n={6}
        eyebrow="Before any code"
        heading={contentFirst.heading}
      >
        <Reveal>
          <p className="mb-step-5 max-w-measure text-md text-ink">
            <Counter to={3} /> case studies. Not 6. Three great ones,{" "}
            <span className="whitespace-nowrap">
              <Counter to={500} />–<Counter to={800} />
            </span>{" "}
            words each, written in a doc first. Not in the site.
          </p>
        </Reveal>
        <NumberedCards items={parseOrdered(contentFirst.body)} />
        <Quote>{parseQuotes(contentFirst.body)[0]}</Quote>
      </Panel>

      {/* ---------------------------------------------- case-study-anatomy */}
      <Panel
        id="case-study-anatomy"
        n={7}
        eyebrow="Template"
        heading={anatomy.heading}
      >
        <NumberedCards items={parseOrdered(anatomy.body)} emphasise={4} />
        <p className="mt-step-3 font-mono text-xs text-muted">
          Four is the one that gets you hired.
        </p>
      </Panel>

      {/* ----------------------------------------------------- figma-first */}
      <Panel id="figma-first" n={8} eyebrow="Day 3" heading={figma.heading}>
        <Bullets items={parseBullets(figma.body)} />
        <Reveal>
          <p className="mt-step-4 max-w-measure text-sm text-ink/85">
            {stripEmphasis(parseProse(figma.body).slice(-1)[0] ?? "")}
          </p>
        </Reveal>
      </Panel>

      {/* -------------------------------------------------------- scaffold */}
      <Panel id="scaffold" n={9} eyebrow="Day 1" heading={scaffold.heading}>
        <Reveal>
          <p className="mb-step-4 max-w-measure text-sm text-ink/85">
            {parseProse(scaffold.body)[0]}
          </p>
        </Reveal>
        <div className="grid gap-step-4 lg:grid-cols-2">
          <div className="min-w-0">
            <Terminal
              title="zsh"
              lines={(fencedBlocks(scaffold.body)[0] ?? "")
                .split("\n")
                .filter(Boolean)
                .map((text) => ({
                  type: text.trim().startsWith("#")
                    ? ("comment" as const)
                    : ("cmd" as const),
                  text,
                }))}
            />
          </div>
          <div className="min-w-0">
            <NumberedCards items={parseOrdered(scaffold.body)} columns={2} />
          </div>
        </div>
      </Panel>

      {/* ------------------------------------------------------------- git */}
      <Panel id="git" n={10} eyebrow="Plumbing" heading={git.heading}>
        <div className="grid gap-step-4 lg:grid-cols-2">
          <div className="min-w-0">
            <TableRows rows={parseTable(git.body).rows} mono />
          </div>
          <div className="min-w-0">
            <h3 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
              Rules
            </h3>
            <Stagger as="ul" className="m-0 list-none space-y-step-2 p-0">
              {parseBullets(git.body).map((rule) => (
                <StaggerItem as="li" key={rule} className="text-sm text-ink/85">
                  {stripEmphasis(rule)}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
        <Quote>{parseQuotes(git.body)[0]}</Quote>
      </Panel>

      {/* ------------------------------------------------------------ loop */}
      <Panel id="loop" n={11} eyebrow="The method" heading={loop.heading}>
        <DailyLoop steps={parseOrdered(loop.body)} />
        <Quote>{parseQuotes(loop.body)[0]}</Quote>
      </Panel>

      {/* ------------------------------------------------------- prompting */}
      <Panel
        id="prompting"
        n={12}
        eyebrow="Directing"
        heading={prompting.heading}
      >
        <div className="grid gap-step-4 lg:grid-cols-2">
          <div className="min-w-0">
            <Prompting bad={promptQuotes[0] ?? ""} good={promptQuotes[1] ?? ""} />
          </div>
          <div className="min-w-0">
            <h3 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
              Habits
            </h3>
            <Stagger as="ul" className="m-0 list-none space-y-step-2 p-0">
              {parseBullets(prompting.body).map((habit) => (
                <StaggerItem as="li" key={habit} className="text-sm text-ink/85">
                  {stripEmphasis(habit)}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
        <Quote>{promptQuotes[2] ?? ""}</Quote>
      </Panel>

      {/* ------------------------------------------------------- claude-md */}
      <Panel id="claude-md" n={13} eyebrow="Day 1" heading={claudeMd.heading}>
        <div className="grid gap-step-4 lg:grid-cols-2">
          <div className="min-w-0">
            <Reveal>
              <p className="mb-step-4 max-w-measure text-sm text-ink/85">
                {parseProse(claudeMd.body)[0]}
              </p>
            </Reveal>
            <Stagger as="ul" className="m-0 list-none space-y-step-2 p-0">
              {parseBullets(claudeMd.body).map((item) => (
                <StaggerItem as="li" key={item} className="text-sm text-ink/85">
                  {stripEmphasis(item)}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="min-w-0">
            <Reveal>
              <CodeBlock title="CLAUDE.md">
                {fencedBlocks(claudeMd.body)[0] ?? ""}
              </CodeBlock>
            </Reveal>
          </div>
        </div>
      </Panel>

      {/* ----------------------------------------------------- reject-list */}
      <Panel id="reject-list" n={14} eyebrow="Day 6" heading={reject.heading}>
        <div className="grid max-w-measure gap-step-3">
          {parseChecklist(reject.body).map((item, i) => (
            <Check
              key={item.label}
              storageKey={`reject-list:${i}`}
              label={item.label}
              hint={item.body}
            />
          ))}
        </div>
        <Quote>{parseQuotes(reject.body)[0]}</Quote>
      </Panel>

      {/* ------------------------------------------------- live-prototypes */}
      <Panel
        id="live-prototypes"
        n={15}
        eyebrow="After launch"
        heading={prototypes.heading}
      >
        <div className="grid gap-step-4 lg:grid-cols-2">
          <div className="min-w-0">
            <Reveal>
              <p className="mb-step-4 max-w-measure text-sm text-ink/85">
                {parseProse(prototypes.body)[0]}
              </p>
            </Reveal>
            <Reveal>
              <CodeBlock title="Tell Claude Code">
                {parseQuotes(prototypes.body)[0] ?? ""}
              </CodeBlock>
            </Reveal>
          </div>
          <div className="min-w-0">
            <h3 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
              Why it works
            </h3>
            <Stagger as="ul" className="m-0 list-none space-y-step-2 p-0">
              {parseBullets(prototypes.body).map((item) => (
                <StaggerItem as="li" key={item} className="text-sm text-ink/85">
                  {stripEmphasis(item)}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Panel>

      {/* ------------------------------------------------------ seven-days */}
      <Panel
        id="seven-days"
        n={16}
        eyebrow="The calendar"
        heading={sevenDays.heading}
      >
        <SevenDays rows={parseTable(sevenDays.body).rows} />
        <p className="mt-step-3 font-mono text-xs text-muted">
          Pick a day to open it. Drag the row sideways on a phone.
        </p>
      </Panel>

      {/* ------------------------------------------------------------ done */}
      <Panel id="done" n={17} eyebrow="Finish line" heading={done.heading}>
        <Columns groups={parseGroups(done.body)} />
        <Reveal delay={0.2}>
          <p className="mt-step-5 max-w-measure font-display text-md text-accent">
            Refine for months. Ship in a week.
          </p>
        </Reveal>
      </Panel>

      {/* ------------------------------------------------------- where next */}
      <section className="border-t border-line py-step-6">
        <div className="mx-auto w-full max-w-page px-step-4 md:px-step-5">
          <h2 className="mb-step-4 text-lg text-ink">Where to go next</h2>
          <ul className="m-0 grid list-none gap-step-3 p-0 md:grid-cols-3">
            {[
              {
                href: "/guide/setup",
                title: "The setup walkthrough",
                blurb:
                  "Every download and every command, in order. Start here if nothing is installed yet.",
              },
              {
                href: "/guide/start",
                title: "Quick start",
                blurb:
                  "How your own projects get onto the site: add a folder, get a page.",
              },
              {
                href: "/guide/motion",
                title: "The motion cookbook",
                blurb:
                  "Every bit of movement on this site, running, with the words that ask for it.",
              },
            ].map((next) => (
              <li key={next.href}>
                <Link
                  href={next.href}
                  className="group flex h-full flex-col rounded-lg border border-line bg-panel p-step-4 no-underline"
                >
                  <h3 className="mb-step-2 font-display text-lg text-ink transition-colors group-hover:text-accent">
                    {next.title}
                  </h3>
                  <p className="text-sm text-ink/85">{next.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-step-5 font-mono text-xs">
            <a
              href="/downloads/portfolio-crash-course.pptx"
              className="text-accent"
              download
            >
              Download the deck (.pptx) ↓
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
