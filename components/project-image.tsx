import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { PROJECTS_DIR, mediaUrl } from "@/lib/projects";
import { imageSize } from "@/lib/image-size";

/**
 * An image written into a project.md, shown at its real proportions.
 *
 * In the Markdown you write the normal thing, with a path relative to the
 * project's own folder:
 *
 *     ![What this screen shows](images/02-wireframes.png)
 *
 * This turns that into a served address, reads the file's true width and height
 * so the space is held before it loads, and uses the square-bracket text as the
 * caption underneath. Which is why that text should be a sentence about what
 * the picture shows, and not a file name.
 *
 * If the file is missing it says so on the page rather than leaving a gap, so a
 * typo in a path is obvious the moment you look.
 */
export function ProjectImage({
  slug,
  src = "",
  alt = "",
}: {
  slug: string;
  src?: string;
  alt?: string;
}) {
  const relative = src.replace(/^\.?\//, "");
  const file = path.resolve(PROJECTS_DIR, slug, relative);
  const root = path.resolve(PROJECTS_DIR, slug);
  const inside = file === root || file.startsWith(root + path.sep);

  if (!inside || !fs.existsSync(file)) {
    return (
      <p className="my-step-4 max-w-measure rounded-lg border border-line bg-panel p-step-4 text-xs text-muted">
        No image at{" "}
        <code className="font-mono text-accent">
          projects/{slug}/{relative || "(no path given)"}
        </code>
        . Check the file name matches exactly, including capitals.
      </p>
    );
  }

  const { width, height } = imageSize(file);

  return (
    <figure className="my-step-4">
      <Image
        src={mediaUrl(slug, relative)}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 64rem, 100vw"
        className="h-auto w-full rounded-lg border border-line bg-panel"
      />
      {alt && (
        <figcaption className="mt-step-2 text-xs text-muted">{alt}</figcaption>
      )}
    </figure>
  );
}
