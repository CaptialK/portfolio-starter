/**
 * Wraps the guide section, and adds one thing: a way to test reduced motion
 * without changing your computer's settings.
 *
 * WHY THIS EXISTS
 * Every component in components/motion/ is supposed to render its content
 * plainly when someone has Reduce Motion switched on. That promise is easy to
 * make and easy to break, and the only way to know it still holds is to look
 * at the page with the setting on.
 *
 * Turning it on for real means changing a system accessibility setting, which
 * is a slow thing to toggle and a rude thing to leave switched on. So in
 * development only, adding `?reduce-motion=1` to any /guide URL makes the page
 * behave exactly as if you had:
 *
 *     http://localhost:3000/guide/motion?reduce-motion=1
 *
 * HOW IT WORKS
 * Motion decides once, at mount, by asking
 * `window.matchMedia("(prefers-reduced-motion)")` — and it never asks again
 * (see useReducedMotion in the framer-motion source; there's a TODO about it).
 * That means two things:
 *
 *   1. Toggling the real OS setting does nothing until you reload the page.
 *   2. If we answer that one question differently, every component follows.
 *
 * So this replaces `window.matchMedia` with a version that lies about that one
 * query, in a blocking inline script that runs before the app's JavaScript.
 *
 * WHAT IT DOESN'T COVER
 * The `@media (prefers-reduced-motion: reduce)` block in globals.css is real
 * CSS and can't be faked this way — it needs the actual OS setting. That block
 * only governs CSS animations and transitions, and everything in
 * components/motion/ is animated in JavaScript, so this covers the part that
 * needs testing. For the CSS half, use the OS setting.
 *
 * It sets `window.__forcedReducedMotion` so you can confirm it took effect.
 * (A marker on <html> would be stripped again by React on hydration.)
 *
 * It is stripped from production builds entirely.
 */

import { notFound } from "next/navigation";
import { guideIsVisible } from "@/lib/guide";

const REDUCE_MOTION_SHIM = `
(function () {
  try {
    if (!/[?&]reduce-motion=1/.test(location.search)) return;
    var real = window.matchMedia.bind(window);
    window.matchMedia = function (query) {
      if (typeof query === "string" && query.indexOf("prefers-reduced-motion") !== -1) {
        return {
          matches: true, media: query, onchange: null,
          addEventListener: function () {}, removeEventListener: function () {},
          addListener: function () {}, removeListener: function () {},
          dispatchEvent: function () { return false; }
        };
      }
      return real(query);
    };
    window.__forcedReducedMotion = true;
  } catch (e) {}
})();
`;

export default function GuideLayout({ children }: LayoutProps<"/guide">) {
  // One check covers /guide and everything under it. Off your live site when
  // showGuide is false in site.config.ts; always on at localhost:3000.
  if (!guideIsVisible) notFound();

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <script dangerouslySetInnerHTML={{ __html: REDUCE_MOTION_SHIM }} />
      )}
      {children}
    </>
  );
}
