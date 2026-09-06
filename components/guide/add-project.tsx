"use client";

/**
 * Putting a project in, shown rather than described.
 *
 * Five steps down the side; the screen on the left shows what each one looks
 * like: VS Code's file tree with the right-click menu open, the rename box,
 * Finder beside the tree with the drop targets marked, the top of project.md,
 * and finally the browser with the new card on it. Click a step, the screen
 * changes.
 *
 * The words for each step come from content/crash-course.md and arrive here
 * already rendered. What lives in this file is the pictures: mock windows built
 * out of the design tokens, with one illustrative project name running through
 * all five so the reader can follow the same folder from copy to card.
 *
 * Swap does the switching, so the screen is as tall as its tallest scene from
 * the start and the page never jumps when a step is picked. Under
 * prefers-reduced-motion it cuts instead of fading.
 */

import { useState } from "react";
import { Swap } from "@/components/motion/swap";

/** The example that runs through every scene. Any name would do. */
const SLUG = "checkout-redesign";
const TITLE = "Checkout redesign";

export type WalkthroughStep = {
  label: string;
  body: React.ReactNode;
};

export function AddProject({ steps }: { steps: WalkthroughStep[] }) {
  const [active, setActive] = useState(0);

  const scenes: Record<string, React.ReactNode> = {
    "0": <SceneCopy />,
    "1": <SceneRename />,
    "2": <SceneDrop />,
    "3": <SceneFill />,
    "4": <SceneLook />,
  };

  return (
    <div className="grid gap-step-4 lg:grid-cols-5">
      <div className="min-w-0 lg:sticky lg:top-step-4 lg:col-span-3 lg:self-start">
        <Swap active={String(active)} items={scenes} />
      </div>

      <ol className="m-0 grid list-none content-start gap-step-2 p-0 lg:col-span-2">
        {steps.map((step, i) => {
          const on = i === active;
          return (
            <li
              key={step.label}
              className={`rounded-lg border ${on ? "border-accent bg-panel" : "border-line"}`}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={on ? "step" : undefined}
                aria-expanded={on}
                className={`flex w-full cursor-pointer items-baseline gap-step-3 rounded-lg p-step-3 text-left ${
                  on ? "" : "hover:bg-panel"
                }`}
              >
                <span
                  className={`font-mono text-xs ${on ? "text-accent" : "text-muted"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-sans text-sm font-semibold tracking-normal ${
                    on ? "text-ink" : "text-ink/85"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {on && (
                <div className="px-step-3 pb-step-3 pl-step-5 text-sm text-ink/85 [&_p]:mb-0">
                  {step.body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------------------------------------------------------- frames */

/** A window: three dots and a title, like the terminal blocks elsewhere. */
function Screen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-black">
      <div className="flex items-center gap-step-2 border-b border-line px-step-3 py-step-2">
        <span aria-hidden className="flex gap-step-1">
          <span className="block size-step-2 rounded-full bg-line" />
          <span className="block size-step-2 rounded-full bg-line" />
          <span className="block size-step-2 rounded-full bg-line" />
        </span>
        <span className="font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="p-step-3">{children}</div>
    </div>
  );
}

/** The one-line note under a scene: what you're looking at. */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-step-3 border-t border-line pt-step-3 font-mono text-xs text-muted">
      {children}
    </p>
  );
}

/** A small pill in the accent, for the one thing in a scene that matters. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto shrink-0 rounded bg-accent px-step-1 font-mono text-xs text-accent-ink">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- file tree */

type RowState = "plain" | "muted" | "selected" | "new" | "target" | "editing";

const INDENT = ["pl-step-2", "pl-step-4", "pl-step-5"];

const ROW_TONE: Record<RowState, string> = {
  plain: "text-ink",
  muted: "text-muted",
  selected: "bg-panel text-ink",
  new: "border border-dashed border-accent text-accent",
  target: "border border-dashed border-accent bg-panel text-ink",
  editing: "border border-accent bg-panel text-ink",
};

/** One line of VS Code's Explorer. */
function Row({
  depth,
  name,
  folder,
  open,
  state = "plain",
  tag,
}: {
  depth: 0 | 1 | 2;
  name: string;
  folder?: boolean;
  open?: boolean;
  state?: RowState;
  tag?: string;
}) {
  return (
    <div
      className={`flex items-center gap-step-2 rounded py-step-1 pr-step-2 font-mono text-xs ${INDENT[depth]} ${ROW_TONE[state]}`}
    >
      <span aria-hidden className="w-step-3 shrink-0 text-muted">
        {folder ? (open ? "▾" : "▸") : ""}
      </span>
      <span className="min-w-0 truncate">
        {name}
        {state === "editing" && (
          <span aria-hidden className="text-accent">
            ▍
          </span>
        )}
      </span>
      {tag && <Tag>{tag}</Tag>}
    </div>
  );
}

/** The Explorer panel's header. */
function Explorer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-step-2 font-mono text-xs tracking-[0.12em] text-muted uppercase">
        Explorer
      </p>
      <div className="grid gap-step-1">{children}</div>
    </div>
  );
}

/** A right-click menu, with one item under the cursor. */
function ContextMenu({ items, active }: { items: string[]; active: string }) {
  return (
    <ul className="m-0 w-full list-none rounded border border-line bg-panel p-step-1 font-mono text-xs shadow-lift sm:w-40">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded px-step-2 py-step-1 ${
            item === active ? "bg-accent text-accent-ink" : "text-ink/85"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- scenes */

function SceneCopy() {
  return (
    <Screen title="VS Code">
      <div className="grid gap-step-3 sm:flex sm:items-start">
        <Explorer>
          <Row depth={0} name="projects/" folder open />
          <Row depth={1} name="README.md" state="muted" />
          <Row depth={1} name="_template/" folder state="selected" />
          <Row depth={1} name="onboarding-redesign/" folder state="muted" />
          <Row depth={1} name="_template copy/" folder state="new" tag="appears" />
        </Explorer>
        <ContextMenu
          items={["Cut", "Copy", "Paste", "Rename…", "Delete"]}
          active="Copy"
        />
      </div>
      <Caption>
        Right-click _template → Copy. Then right-click projects → Paste.
      </Caption>
    </Screen>
  );
}

function SceneRename() {
  return (
    <Screen title="VS Code">
      <Explorer>
        <Row depth={0} name="projects/" folder open />
        <Row depth={1} name="README.md" state="muted" />
        <Row depth={1} name="_template/" folder state="muted" />
        <Row depth={1} name="onboarding-redesign/" folder state="muted" />
        <Row depth={1} name={SLUG} folder state="editing" tag="typing" />
      </Explorer>
      <div className="mt-step-3 grid gap-step-1 font-mono text-xs">
        <p className="m-0 flex flex-wrap items-baseline gap-x-step-2 text-ink">
          <span className="text-muted">projects/</span>
          <span className="text-accent">{SLUG}</span>
          <span className="text-muted">→</span>
          <span className="text-muted">localhost:3000/work/</span>
          <span className="text-accent">{SLUG}</span>
        </p>
        <p className="m-0 flex flex-wrap gap-x-step-3 text-muted">
          <span className="line-through decoration-accent/60">
            Checkout Redesign v2
          </span>
          <span className="text-ink">{SLUG}</span>
        </p>
      </div>
      <Caption>
        Right-click the copy → Rename, or select it and press Enter. The name is
        the address.
      </Caption>
    </Screen>
  );
}

function SceneDrop() {
  const files = [
    { name: "cover.jpg", wide: true },
    { name: "01-flow.png" },
    { name: "02-wires.png" },
    { name: "03-final.png" },
    { name: "notes.pdf", doc: true },
  ];

  return (
    <Screen title="Finder  ·  VS Code">
      <div className="grid gap-step-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        {/* Finder */}
        <div className="min-w-0 rounded border border-line p-step-2">
          <p className="mb-step-2 font-mono text-xs text-muted">Desktop › checkout</p>
          <ul className="m-0 grid list-none grid-cols-3 gap-step-2 p-0">
            {files.map((file) => (
              <li key={file.name} className="min-w-0">
                <div
                  className={`mb-step-1 rounded border border-line ${
                    file.doc ? "aspect-[3/4] w-2/3 bg-black" : "aspect-[4/3] bg-panel"
                  }`}
                />
                <p className="m-0 truncate font-mono text-xs text-ink/85">
                  {file.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p
          aria-hidden
          className="m-0 text-center font-mono text-md text-accent sm:px-step-1"
        >
          <span className="sm:hidden">↓</span>
          <span className="hidden sm:inline">→</span>
        </p>

        {/* VS Code */}
        <Explorer>
          <Row depth={0} name="projects/" folder open />
          <Row depth={1} name={`${SLUG}/`} folder open />
          <Row depth={2} name="project.md" />
          <Row depth={2} name="cover.jpg" state="target" tag="cover" />
          <Row depth={2} name="images/" folder open state="target" tag="screenshots" />
          <Row depth={2} name="prototype/" folder state="target" tag="the rest" />
          <Row depth={1} name="_template/" folder state="muted" />
          <Row depth={1} name="onboarding-redesign/" folder state="muted" />
        </Explorer>
      </div>
      <Caption>
        Drag from Finder and let go on the folder&apos;s name. It copies in; the
        original stays where it was.
      </Caption>
    </Screen>
  );
}

function SceneFill() {
  const lines: { text: string; tone: "muted" | "ink" | "accent" }[] = [
    { text: "---", tone: "muted" },
    { text: `title: ${TITLE}`, tone: "accent" },
    { text: "role: Product designer", tone: "accent" },
    { text: "year: 2026", tone: "accent" },
    { text: "tools: Figma, Maze", tone: "accent" },
    { text: "summary: One sentence. What it was and what changed.", tone: "accent" },
    { text: "cover: cover.jpg", tone: "ink" },
    { text: "---", tone: "muted" },
    { text: "", tone: "muted" },
    { text: "## Problem", tone: "muted" },
    { text: "## Constraints", tone: "muted" },
    { text: "## What I did", tone: "muted" },
    { text: "…", tone: "muted" },
  ];

  return (
    <Screen title={`VS Code  ·  projects/${SLUG}/project.md`}>
      <div className="flex items-start gap-step-3">
        <ol className="m-0 min-w-0 flex-1 list-none p-0 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-step-3">
              <span aria-hidden className="w-step-4 shrink-0 text-right text-muted">
                {i + 1}
              </span>
              <span
                className={`min-w-0 truncate ${
                  line.tone === "accent"
                    ? "text-accent"
                    : line.tone === "ink"
                      ? "text-ink"
                      : "text-muted"
                }`}
              >
                {line.text || " "}
              </span>
            </li>
          ))}
        </ol>
        <span className="shrink-0 rounded border border-line px-step-2 py-step-1 font-mono text-xs text-muted">
          ⌘S
        </span>
      </div>
      <Caption>
        Only the lines between the two --- for now. The headings can wait until
        the words are written.
      </Caption>
    </Screen>
  );
}

function SceneLook() {
  return (
    <Screen title="Chrome">
      <div className="mb-step-3 rounded border border-line px-step-2 py-step-1 font-mono text-xs text-muted">
        localhost:3000<span className="text-ink">/work</span>
      </div>
      <ul className="m-0 grid list-none gap-step-2 p-0 sm:grid-cols-2">
        <li className="rounded-lg border border-line bg-panel p-step-2 text-muted">
          <div className="mb-step-2 aspect-[16/10] rounded bg-bg" />
          <p className="m-0 mb-step-1 font-display text-sm">Onboarding redesign</p>
          <p className="m-0 font-mono text-xs">EXAMPLE PROJECT · delete it later</p>
        </li>
        <li className="rounded-lg border border-accent bg-panel p-step-2">
          <div className="mb-step-2 flex aspect-[16/10] items-center justify-center rounded bg-bg font-mono text-xs text-muted">
            cover.jpg
          </div>
          <p className="m-0 mb-step-1 flex items-baseline font-display text-sm text-ink">
            {TITLE}
            <Tag>yours</Tag>
          </p>
          <p className="m-0 mb-step-1 text-xs text-muted">
            One sentence. What it was and what changed.
          </p>
          <p className="m-0 font-mono text-xs text-muted">Product designer · 2026</p>
        </li>
      </ul>
      <Caption>
        Nothing was registered anywhere. The folder existed, so the card does.
      </Caption>
    </Screen>
  );
}
