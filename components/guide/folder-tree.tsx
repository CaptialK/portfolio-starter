/**
 * A folder tree with its comments lined up in a column.
 *
 * The tree is written in content/crash-course.md with `←` notes after some of
 * the lines. Those notes are the useful half, so this pads every line out to the
 * same width and greys the notes, which turns a wall of monospace into two
 * columns you can read down.
 *
 * Padding is worked out here rather than typed into the Markdown, so the
 * alignment survives someone editing a folder name in the source.
 */
export function FolderTree({ tree }: { tree: string }) {
  const rows = tree.split("\n").map((line) => {
    const at = line.indexOf("←");
    return at === -1
      ? { path: line, note: "" }
      : { path: line.slice(0, at).trimEnd(), note: line.slice(at + 1).trim() };
  });

  const widest = Math.max(...rows.map((r) => (r.note ? r.path.length : 0)));

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-black p-step-4">
      <pre className="m-0 font-mono text-xs leading-relaxed">
        {rows.map((row, i) => (
          // Inline spans with a real newline after each, rather than block
          // spans: this way the tree still copies out of the page as a tree.
          <span key={i}>
            <span className="text-ink">
              {row.note ? row.path.padEnd(widest + 2, " ") : row.path}
            </span>
            {row.note && <span className="text-muted">← {row.note}</span>}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}
