import { site } from "@/content/site";

/**
 * The footer on every page. Edit the email and links in content/site.ts.
 */
export function SiteFooter() {
  return (
    <footer className="mt-step-6 border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-step-4 px-step-4 py-step-5 text-xs md:flex-row md:items-end md:justify-between md:px-step-5">
        <div>
          <p className="mb-step-2 text-muted">Open to work and conversation.</p>
          <a
            href={`mailto:${site.email}`}
            className="font-display text-lg text-ink no-underline hover:text-accent"
          >
            {site.email}
          </a>
        </div>

        <div className="flex flex-col gap-step-2 md:items-end">
          <ul className="flex list-none flex-wrap gap-step-3 p-0">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  className="text-muted no-underline hover:text-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-muted">
            {site.location} · © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
