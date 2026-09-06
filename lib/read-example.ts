/**
 * Pulls the `@example` block out of a component's own header comment.
 *
 * The cookbook at /guide/motion shows a code snippet for every component. If
 * those snippets were typed into the cookbook page they would quietly go stale
 * the first time a component's props changed, and the page would be teaching
 * something that no longer works. So the snippet lives in the component file,
 * next to the code it describes, and this reads it out at build time.
 *
 * That means there is exactly one place to edit an example: the component.
 *
 * It throws rather than returning nothing if a component has no `@example`.
 * A missing snippet should stop the build, not produce a cookbook entry with a
 * blank box in it.
 */

import fs from "node:fs";
import path from "node:path";

const MOTION_DIR = path.join(process.cwd(), "components", "motion");

/**
 * @param fileName  e.g. "reveal.tsx"
 * @returns         the example, de-commented and trimmed, ready for a <pre>.
 */
export function readExample(fileName: string): string {
  const file = path.join(MOTION_DIR, fileName);
  const lines = fs.readFileSync(file, "utf8").split("\n");

  const start = lines.findIndex((line) => line.trim().startsWith("* @example"));
  if (start === -1) {
    throw new Error(
      `components/motion/${fileName} has no "@example" block in its header ` +
        `comment. Every component in that folder needs one — the cookbook at ` +
        `/guide/motion reads it from the file.`,
    );
  }

  const body: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("*/")) break;
    // Strip the " * " that makes it a comment, keeping any deeper indentation.
    body.push(line.replace(/^\s*\*\s?/, ""));
  }

  const example = body.join("\n").trim();
  if (!example) {
    throw new Error(
      `components/motion/${fileName} has an empty "@example" block.`,
    );
  }

  return example;
}
