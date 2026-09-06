import { CopyButton } from "@/components/guide/copy-button";
import { Terminal } from "@/components/motion/terminal";
import { Reveal } from "@/components/motion/reveal";

/** The sentence to say, in a window, with a button that copies exactly it. */
export function SayToClaude({ prompt }: { prompt: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-accent/40 bg-black">
      <div className="flex items-center gap-step-2 border-b border-line px-step-3 py-step-2">
        <span className="flex-1 font-mono text-xs text-accent">
          Say to Claude Code
        </span>
        <CopyButton text={prompt} />
      </div>
      <pre className="m-0 p-step-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink/85">
        {prompt}
      </pre>
    </div>
  );
}

/**
 * A step that has two ways to do it.
 *
 * The sentence to say to Claude comes first and is the one to use. The commands
 * it runs underneath sit behind a disclosure, closed by default, for anyone who
 * wants to see them or type them. Both come out of content/crash-course.md: the
 * prompt is the section's `>` quote, the commands are its fenced block.
 *
 * The disclosure is a plain <details>, so it works without JavaScript and is
 * reachable by keyboard. The Terminal inside only starts typing once it's open
 * and on screen, which is when someone has asked to see it.
 */
export function AskOrType({
  lead,
  prompt,
  alternative,
  commands,
}: {
  /** The sentence above the prompt. */
  lead?: string;
  /** What to say to Claude, verbatim. The Copy button copies exactly this. */
  prompt: string;
  /** The sentence introducing the typed version. */
  alternative?: string;
  /** The commands, one per line. Lines starting with # are comments. */
  commands: string;
}) {
  const lines = commands
    .split("\n")
    .filter(Boolean)
    .map((text) => ({
      type: text.trim().startsWith("#") ? ("comment" as const) : ("cmd" as const),
      text,
    }));

  return (
    <div className="grid gap-step-3">
      {lead && (
        <Reveal>
          <p className="max-w-measure text-sm text-ink/85">{lead}</p>
        </Reveal>
      )}

      <Reveal>
        <SayToClaude prompt={prompt} />
      </Reveal>

      <details className="group rounded-lg border border-dashed border-line">
        <summary className="cursor-pointer list-none px-step-3 py-step-2 font-mono text-xs text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="text-accent group-open:hidden">
            +{" "}
          </span>
          <span aria-hidden className="hidden text-accent group-open:inline">
            −{" "}
          </span>
          Or type it yourself
        </summary>
        <div className="grid gap-step-3 px-step-3 pb-step-3">
          {alternative && (
            <p className="max-w-measure text-sm text-ink/85">{alternative}</p>
          )}
          <Terminal title="zsh" lines={lines} />
        </div>
      </details>
    </div>
  );
}
