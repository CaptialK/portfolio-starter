/**
 * The words you'll hear this week, in one sentence each.
 *
 * This is what the "Words" button in the guide's header opens. Twelve terms —
 * the ones that come up constantly and stop you dead the first time. Anything
 * you only meet once doesn't belong here; it belongs in the sentence where it
 * appears, in brackets.
 *
 * Rules for writing one of these:
 * - One sentence. If it needs two, the first one wasn't plain enough.
 * - Say what you'd see or do, not what it is underneath.
 * - If it maps onto something in Figma, say so. That's the shortest route.
 */

export type Word = {
  /** The term, exactly as it appears on screen elsewhere. */
  term: string;
  /** One sentence. Plain. No second sentence. */
  meaning: string;
};

export const glossary: Word[] = [
  {
    term: "terminal",
    meaning:
      "A text box where you type commands, which does exactly what you type and nothing else.",
  },
  {
    term: "npm",
    meaning:
      "The thing that downloads other people's code into your project, the way you'd install a Figma plugin.",
  },
  {
    term: "package",
    meaning:
      "One chunk of somebody else's code that your project uses — a plugin, essentially.",
  },
  {
    term: "dev server",
    meaning:
      "The thing running in your terminal that shows the site at localhost:3000 and updates the browser every time you save.",
  },
  {
    term: "localhost",
    meaning:
      "Your own computer; localhost:3000 is your site, open only to you.",
  },
  {
    term: "build",
    meaning:
      "Packing the whole site into the finished version that goes on the internet.",
  },
  {
    term: "deploy",
    meaning:
      "Putting that finished version online, which here happens on its own every time you push.",
  },
  {
    term: "commit",
    meaning: "A named save point you can always come back to.",
  },
  {
    term: "push",
    meaning:
      "Sending your save points up to GitHub, which is also what puts them online.",
  },
  {
    term: "component",
    meaning:
      "A reusable piece of interface — the same idea as a component in Figma.",
  },
  {
    term: "variant",
    meaning:
      "A named version of a component, like Default and Hover — the same idea as a variant in Figma.",
  },
  {
    term: "CLAUDE.md",
    meaning:
      "A plain text file of your rules that Claude reads before every single job.",
  },
];
