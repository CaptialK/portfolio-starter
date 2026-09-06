import type { DeckBlock, DeckSlide } from "@/content/decks/portfolio-crash-course";

/**
 * Renders one slide of the crash course as a page section.
 *
 * Slides are data (content/decks/), not markup, so the same deck can be a .pptx
 * you hand someone and a page they can read on a phone. Every block type in
 * DeckBlock has a case here; adding a new one is a compile error until it does.
 */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-step-2 font-mono text-xs tracking-[0.12em] text-accent uppercase">
      {children}
    </p>
  );
}

function Block({ block }: { block: DeckBlock }) {
  switch (block.kind) {
    case "lede":
      return (
        <p className="max-w-measure text-md text-ink/85">{block.text}</p>
      );

    case "grid": {
      const variant = block.variant ?? "plain";
      return (
        // Each cell carries its own border rather than showing through a
        // gap-px parent: a row that doesn't divide evenly would otherwise leave
        // a solid block where the missing cells are.
        <ul className="grid list-none grid-cols-1 gap-step-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) => (
            <li
              key={item.label}
              className="rounded-lg border border-line bg-panel p-step-4"
            >
              <div className="mb-step-2 flex items-baseline gap-step-2">
                {variant === "numbered" && (
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                {variant === "check" && (
                  <span aria-hidden className="font-mono text-xs text-accent">
                    ✓
                  </span>
                )}
                <h3 className="font-sans text-sm font-semibold tracking-normal text-ink">
                  {item.label}
                </h3>
              </div>
              <p className="text-xs text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      );
    }

    case "flow":
      return (
        <ol className="grid list-none grid-cols-1 gap-step-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item, i) => (
            <li
              key={item.label}
              className="relative rounded-lg border border-line bg-panel p-step-4"
            >
              <span className="mb-step-2 block font-mono text-xs text-accent">
                {i + 1}
              </span>
              <h3 className="mb-step-1 font-sans text-sm font-semibold tracking-normal text-ink">
                {item.label}
              </h3>
              <p className="text-xs text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      );

    case "split":
      return (
        <div className="grid grid-cols-1 gap-step-3 md:grid-cols-2">
          {block.columns.map((column) => (
            <div
              key={column.title}
              className="rounded-lg border border-line bg-panel p-step-4"
            >
              <h3 className="mb-step-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">
                {column.title}
              </h3>
              <ul className="m-0 list-none space-y-step-2 p-0">
                {column.items.map((line) => (
                  <li key={line} className="text-xs text-ink/85">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "code":
      return (
        <figure className="m-0 overflow-hidden rounded-lg border border-line bg-black">
          {block.caption && (
            <figcaption className="border-b border-line px-step-4 py-step-2 font-mono text-xs text-muted">
              {block.caption}
            </figcaption>
          )}
          <pre className="m-0 overflow-x-auto p-step-4 font-mono text-xs leading-relaxed">
            {block.lines.map((line) => (
              <span
                key={line}
                className={
                  line.startsWith("#")
                    ? "block text-muted italic"
                    : "block text-accent"
                }
              >
                {line}
              </span>
            ))}
          </pre>
        </figure>
      );

    case "calendar":
      return (
        <ol className="m-0 list-none p-0">
          {block.items.map((item) => (
            <li
              key={item.day}
              className="flex flex-col gap-step-1 border-b border-line py-step-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-step-4"
            >
              <span className="font-mono text-xs text-accent sm:w-16 sm:shrink-0">
                Day {item.day}
              </span>
              <span className="font-sans text-sm font-semibold text-ink sm:w-48 sm:shrink-0">
                {item.label}
              </span>
              <span className="text-xs text-muted">{item.body}</span>
            </li>
          ))}
        </ol>
      );

    case "note":
      return (
        <p className="max-w-measure border-l-2 border-accent pl-step-3 font-display text-md text-ink">
          {block.text}
        </p>
      );
  }
}

export function Slide({ slide }: { slide: DeckSlide }) {
  return (
    <section
      id={slide.id}
      className="scroll-mt-step-4 border-t border-line py-step-5"
    >
      <Eyebrow>
        <span className="text-muted">{String(slide.n).padStart(2, "0")}</span>{" "}
        {slide.eyebrow}
      </Eyebrow>
      <h2 className="mb-step-4 max-w-measure text-lg text-ink">{slide.title}</h2>

      <div className="flex flex-col gap-step-4">
        {slide.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </section>
  );
}
