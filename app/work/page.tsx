import type { Metadata } from "next";
import { getCaseStudies, type CaseStudy } from "@/lib/content";
import { CaseCard } from "@/components/case-card";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies: how the work was decided, not just how it turned out.",
};

/**
 * The work index.
 *
 * Grouped by what each case study is there to prove — process, craft, outcome —
 * because the course's rule is one of each, and a hiring manager reading for
 * ninety seconds should be able to see which is which without opening them.
 */
const GROUPS = [
  {
    emphasis: "process" as const,
    title: "Process",
    blurb: "The one where the research changed the design.",
  },
  {
    emphasis: "craft" as const,
    title: "Craft",
    blurb: "The one that looks the best. Pixel-level care.",
  },
  {
    emphasis: "outcome" as const,
    title: "Outcome",
    blurb: "The one that shipped, or had a result worth naming.",
  },
];

export default function WorkPage() {
  const studies = getCaseStudies();

  const byEmphasis = (emphasis: CaseStudy["emphasis"]) =>
    studies.filter((study) => study.emphasis === emphasis);

  return (
    <div className="mx-auto max-w-page px-step-4 md:px-step-5">
      <header className="py-step-5">
        <h1 className="mb-step-3 max-w-measure text-xl text-ink">Work</h1>
        <p className="max-w-measure text-md text-ink/85">
          Three projects, each doing a different job. Every one has a decisions
          section, because that is the part worth reading.
        </p>
      </header>

      {studies.length === 0 && (
        <p className="mb-step-6 max-w-measure rounded-lg border border-line bg-panel p-step-4 text-sm text-muted">
          No case studies yet. Copy{" "}
          <code className="font-mono text-accent">
            content/work/_TEMPLATE.mdx
          </code>{" "}
          to a new file and it appears here.
        </p>
      )}

      {GROUPS.map((group) => {
        const groupStudies = byEmphasis(group.emphasis);
        if (groupStudies.length === 0) return null;

        return (
          <section key={group.emphasis} className="mb-step-5">
            <div className="mb-step-2">
              <h2 className="font-mono text-xs tracking-[0.12em] text-accent uppercase">
                {group.title}
              </h2>
              <p className="max-w-measure text-xs text-muted">{group.blurb}</p>
            </div>
            <ul className="m-0 list-none border-b border-line p-0">
              {groupStudies.map((study) => (
                <CaseCard key={study.slug} study={study} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
