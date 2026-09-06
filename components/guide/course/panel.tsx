import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Hoverable } from "@/components/motion/hoverable";
import type { Labelled, Row } from "@/lib/crash-course";

/**
 * The frame every section of the course sits in.
 *
 * On a wide screen each one fills the height of the window and the page snaps
 * gently between them, so the course reads as a sequence of slides. On a phone
 * they're just sections, stacked, because a full-height panel on a small screen
 * is a lot of scrolling for very little.
 *
 * `data-course-panel` is how the rail on the right finds them and counts them.
 */
export function Panel({
  id,
  n,
  eyebrow,
  heading,
  children,
}: {
  id: string;
  n: number;
  eyebrow?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-course-panel
      data-course-title={heading}
      className="course-panel scroll-mt-step-4 border-t border-line py-step-6 md:flex md:min-h-svh md:items-center"
    >
      <div className="mx-auto w-full max-w-page px-step-4 md:px-step-5">
        <Reveal>
          <p className="mb-step-2 font-mono text-xs tracking-[0.12em] text-accent uppercase">
            <span className="text-muted">{String(n).padStart(2, "0")}</span>
            {eyebrow ? ` ${eyebrow}` : ""}
          </p>
          <h2 className="mb-step-4 max-w-measure text-lg text-ink md:text-xl">
            {heading}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** The one line on a panel that matters most. */
export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="mt-step-4 max-w-measure border-l-2 border-accent pl-step-3 font-display text-md text-ink">
        {children}
      </p>
    </Reveal>
  );
}

/**
 * A table as a set of rows you can read down.
 *
 * Two columns: a label and its meaning. Three columns: a label, the command
 * underneath it in monospace, and the meaning — the shape of the Git table,
 * where the thing you say to Claude sits beside the thing it runs.
 */
export function TableRows({
  rows,
  mono,
}: {
  rows: Row[];
  /** Render the left column in monospace — for commands. */
  mono?: boolean;
}) {
  return (
    <Stagger as="ul" className="m-0 list-none border-t border-line p-0">
      {rows.map((row) => {
        const three = row.cells.length >= 3;
        const last = stripCode(row.cells[row.cells.length - 1] ?? "");
        return (
          <StaggerItem
            as="li"
            key={row.cells[0]}
            className="flex flex-col gap-step-1 border-b border-line py-step-3 sm:flex-row sm:gap-step-4"
          >
            <span
              className={`shrink-0 text-sm text-ink sm:w-56 ${mono ? "font-mono text-xs text-accent" : ""}`}
            >
              {stripCode(row.cells[0])}
            </span>
            {three && (
              <span className="shrink-0 font-mono text-xs text-accent sm:w-56">
                {stripCode(row.cells[1])}
              </span>
            )}
            <span className="text-sm text-muted">{last}</span>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/** Markdown backticks, removed. The rows style their own code. */
function stripCode(text: string): string {
  return text.replace(/`/g, "");
}

/** Numbered cards. `emphasise` gives one of them the accent treatment. */
export function NumberedCards({
  items,
  columns = 3,
  emphasise,
}: {
  items: Labelled[];
  columns?: 2 | 3;
  /** 1-based index of the one that matters most. */
  emphasise?: number;
}) {
  const grid = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <Stagger as="ol" className={`m-0 grid list-none gap-step-3 p-0 ${grid}`}>
      {items.map((item, i) => {
        const lead = emphasise === i + 1;
        return (
          <StaggerItem as="li" key={item.label} className="min-w-0">
            <Hoverable
              className={`flex h-full flex-col rounded-lg border bg-panel p-step-4 ${
                lead ? "border-accent" : "border-line"
              }`}
            >
              <span
                className={`mb-step-2 font-mono text-xs ${lead ? "text-accent" : "text-muted"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-step-2 font-sans text-sm font-semibold tracking-normal text-ink">
                {item.label}
              </h3>
              {item.body && (
                <p className="text-xs text-muted">{stripEmphasis(item.body)}</p>
              )}
            </Hoverable>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

/** Two labelled lists side by side. */
export function Columns({
  groups,
  strikeSecond,
}: {
  groups: { title: string; items: string[] }[];
  /** Draw a line through the second column's items — for a "you will not" list. */
  strikeSecond?: boolean;
}) {
  return (
    <div className="grid gap-step-3 md:grid-cols-2">
      {groups.map((group, index) => (
        <Reveal key={group.title} delay={index * 0.08}>
          <div className="h-full rounded-lg border border-line bg-panel p-step-4">
            <h3 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
              {group.title}
            </h3>
            <Stagger as="ul" className="m-0 list-none space-y-step-2 p-0">
              {group.items.map((item) => (
                <StaggerItem
                  as="li"
                  key={item}
                  className={`text-sm ${
                    strikeSecond && index === 1
                      ? "text-muted line-through decoration-accent/60"
                      : "text-ink/85"
                  }`}
                >
                  {item}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Plain bullets as a staggered list. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <Stagger as="ul" className="m-0 grid list-none gap-step-2 p-0 md:grid-cols-2">
      {items.map((item) => (
        <StaggerItem
          as="li"
          key={item}
          className="flex gap-step-2 text-sm text-ink/85"
        >
          <span aria-hidden className="font-mono text-xs text-accent">
            ·
          </span>
          <span>{stripEmphasis(item)}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** A static, terminal-looking block. Nothing types itself. */
export function CodeBlock({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
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

/**
 * Markdown emphasis marks, removed.
 *
 * The course text is written as Markdown, and these snippets are pulled out of
 * it as plain strings for layouts that style their own emphasis. Leaving the
 * asterisks in would show them on the page.
 */
export function stripEmphasis(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}
