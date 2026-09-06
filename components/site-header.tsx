import Link from "next/link";
import { site } from "@/content/site";
import { guideIsVisible } from "@/lib/guide";

/**
 * The header on every page. Edit the links in content/site.ts, not here.
 */
export function SiteHeader() {
  // The guide link disappears with the guide itself, so the nav never points at
  // a page that isn't there.
  const nav = site.nav.filter(
    (link) => guideIsVisible || !link.href.startsWith("/guide"),
  );

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page items-baseline justify-between gap-step-4 px-step-4 py-step-3 md:px-step-5">
        <Link
          href="/"
          className="font-display text-md leading-none text-ink no-underline"
        >
          {site.name}
        </Link>

        <nav aria-label="Main">
          <ul className="flex list-none items-baseline gap-step-4 p-0 text-xs">
            {nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted no-underline transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
