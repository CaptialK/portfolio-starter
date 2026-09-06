"use client";

import { useEffect } from "react";

/**
 * Makes the setup guide interactive.
 *
 * The guide itself is plain HTML in content/guide/setup-guide.html, injected by
 * app/guide/setup/page.tsx. This component wires up the three behaviours that
 * HTML can't do on its own, after it lands in the DOM:
 *
 *   1. the step checkboxes, saved in this browser's localStorage
 *   2. the "Copy" button on every terminal block
 *   3. the contents list highlighting the section you're reading
 *
 * It renders nothing. It only attaches listeners and removes them on unmount.
 */

const STORAGE_KEY = "portfolio-setup-guide-v1";

export function GuideRuntime() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".guide");
    if (!root) return;

    /** Everything we attach, so unmount can undo all of it. */
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      target: EventTarget,
      type: K | string,
      handler: EventListenerOrEventListenerObject,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };

    // ---------------------------------------------------------------- checklist

    const boxes = Array.from(
      root.querySelectorAll<HTMLInputElement>("input[data-step]"),
    );
    const fill = root.querySelector<HTMLElement>("#fill");
    const count = root.querySelector<HTMLElement>("#count");

    let state: Record<string, boolean> = {};
    try {
      state = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") ?? {};
    } catch {
      state = {};
    }

    const save = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Private browsing, or storage is full. The checklist just won't persist.
      }
    };

    const render = () => {
      let done = 0;
      for (const box of boxes) {
        const key = box.dataset.step ?? "";
        const checked = Boolean(state[key]);
        box.checked = checked;
        box.closest(".step")?.classList.toggle("done", checked);
        if (checked) done++;
      }

      if (fill) {
        fill.style.width = boxes.length
          ? `${Math.round((done / boxes.length) * 100)}%`
          : "0%";
      }
      if (count) count.textContent = `${done} of ${boxes.length} done`;

      // A contents entry goes green once every step inside its section is ticked.
      for (const section of root.querySelectorAll("section")) {
        const inner = section.querySelectorAll<HTMLInputElement>(
          "input[data-step]",
        );
        const link = root.querySelector(`.toc a[href="#${section.id}"]`);
        if (!link) continue;
        const all =
          inner.length > 0 && Array.from(inner).every((input) => input.checked);
        link.parentElement?.classList.toggle("done", all);
      }
    };

    for (const box of boxes) {
      // Clicking the step's heading toggles its checkbox. Bigger target.
      const heading = box.closest(".step")?.querySelector<HTMLElement>("h3");
      if (heading) {
        heading.id = `h-${box.dataset.step}`;
        on(heading, "click", () => {
          box.checked = !box.checked;
          box.dispatchEvent(new Event("change"));
        });
      }
      on(box, "change", () => {
        state[box.dataset.step ?? ""] = box.checked;
        save();
        render();
      });
    }

    const reset = root.querySelector<HTMLButtonElement>("#reset");
    if (reset) {
      on(reset, "click", () => {
        state = {};
        save();
        render();
      });
    }

    render();

    // -------------------------------------------------------------- copy buttons

    for (const button of root.querySelectorAll<HTMLButtonElement>(
      "button[data-copy]",
    )) {
      on(button, "click", () => {
        const text = button.getAttribute("data-copy") ?? "";
        const confirm = () => {
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = "Copy";
          }, 1400);
        };
        navigator.clipboard?.writeText(text).then(confirm, () => {
          button.textContent = "Select & copy";
        });
      });
    }

    // ------------------------------------------------------ contents highlighting

    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".toc a"));
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(".col section"),
    );

    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = sections[0];
      for (const section of sections) {
        if (section.offsetTop <= y) current = section;
      }
      if (!current) return;
      for (const link of links) {
        link.classList.toggle("on", link.getAttribute("href") === `#${current.id}`);
      }
    };

    on(window, "scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
