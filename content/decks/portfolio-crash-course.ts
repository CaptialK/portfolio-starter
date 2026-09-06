/**
 * The Portfolio Crash Course deck, as data.
 *
 * The .pptx in public/downloads/ is the file you hand someone. This is the same
 * deck as structured content so the site can render it as a real page: readable
 * on a phone, linkable section by section, and searchable.
 *
 * If you edit the deck, edit this too. If you delete the course from the site,
 * delete this file, components/deck/, and app/guide/.
 */

export type DeckBlock =
  /** A paragraph. One or two per slide, no more. */
  | { kind: "lede"; text: string }
  /** A set of labelled definitions. `numbered` ranks them; `check` ticks them. */
  | {
      kind: "grid";
      variant?: "plain" | "numbered" | "check";
      items: { label: string; body: string }[];
    }
  /** An ordered sequence with arrows between the items. */
  | { kind: "flow"; items: { label: string; body: string }[] }
  /** Two labelled lists side by side. Used for do / don't. */
  | { kind: "split"; columns: { title: string; items: string[] }[] }
  /** A terminal or file block. Lines starting with `#` render as comments. */
  | { kind: "code"; caption?: string; lines: string[] }
  /** The seven-day calendar. */
  | { kind: "calendar"; items: { day: string; label: string; body: string }[] }
  /** The one line on the slide that matters most. Renders as the pull quote. */
  | { kind: "note"; text: string };

export type DeckSlide = {
  /** Slide number in the .pptx, so the two stay in sync. */
  n: number;
  /** URL fragment. Stable: people link to these. */
  id: string;
  /** The small label above the title. */
  eyebrow: string;
  title: string;
  blocks: DeckBlock[];
};

export const deck = {
  title: "Portfolio Crash Course",
  subtitle: "Ship it in 7 days.",
  lede: "You design. The AI builds. You decide what's good enough.",
  /** The .pptx, for anyone who wants the original. */
  download: "/downloads/portfolio-crash-course.pptx",

  slides: [
    {
      n: 2,
      id: "ground-rules",
      eyebrow: "Ground rules",
      title: "The deal for this week",
      blocks: [
        {
          kind: "split",
          columns: [
            {
              title: "You will",
              items: [
                "Direct an AI agent to build a real, custom site",
                "Own every design decision on it",
                "Ship a live URL by Day 7",
                "Learn just enough plumbing to never be stuck",
              ],
            },
            {
              title: "You will not",
              items: [
                "Learn React (you don't need to)",
                "Hand-write code",
                "Understand everything it generates",
                "Make it perfect",
              ],
            },
          ],
        },
        {
          kind: "note",
          text: "Speed beats polish this week. A live, decent site you refine for months beats a perfect one that never ships.",
        },
      ],
    },

    {
      n: 3,
      id: "the-argument",
      eyebrow: "The argument",
      title: "Why not just use Squarespace?",
      blocks: [
        {
          kind: "grid",
          variant: "numbered",
          items: [
            {
              label: "The signal flipped",
              body: "When building custom costs a weekend, a template stops reading as “pragmatic” and starts reading as “didn't bother.”",
            },
            {
              label: "Prototypes can't live there",
              body: "Working, clickable interactions are your biggest flex. A template site can't host them.",
            },
            {
              label: "You own the whole thing",
              body: "Files, history, domain. Nothing locked inside someone else's CMS. It grows with you for years.",
            },
          ],
        },
      ],
    },

    {
      n: 4,
      id: "vocabulary",
      eyebrow: "Vocabulary",
      title: "The stack: what each thing is, to you",
      blocks: [
        {
          kind: "grid",
          items: [
            {
              label: "Next.js",
              body: "The site framework. Pages, routing, image handling.",
            },
            {
              label: "Tailwind",
              body: "Styling as class names. Claude speaks it fluently.",
            },
            {
              label: "TanStack Query",
              body: "Fetches and caches data for interactive prototypes.",
            },
            {
              label: "Vercel",
              body: "Hosting. Every push goes live in about a minute.",
            },
            { label: "GitHub", body: "Your save history. Undo for everything." },
            { label: "Claude Code", body: "The builder. You direct, it types." },
          ],
        },
      ],
    },

    {
      n: 5,
      id: "day-0",
      eyebrow: "Day 0",
      title: "Install this before anything else",
      blocks: [
        {
          kind: "grid",
          items: [
            {
              label: "VS Code",
              body: "Plus the Claude Code extension. No separate CLI needed; steps are in the setup guide.",
            },
            {
              label: "Node.js (LTS)",
              body: "nodejs.org, click the LTS button. Next.js and Claude Code both need it.",
            },
            {
              label: "Git",
              body: "git-scm.com. On Mac it comes with the Xcode command-line tools.",
            },
            {
              label: "GitHub account",
              body: "Free. This is where the code lives.",
            },
            {
              label: "Vercel account",
              body: "Sign in with GitHub. Free tier is plenty.",
            },
            {
              label: "Domain (Day 7)",
              body: "Cloudflare or Namecheap. firstnamelastname.com if it's free.",
            },
          ],
        },
        {
          kind: "code",
          caption: "Then check it worked",
          lines: [
            "node -v",
            "npm -v",
            "git --version",
            "code --version",
            "# each prints a version,",
            "# not “command not found”",
          ],
        },
        {
          kind: "note",
          text: "Why local? Because you can't direct what you can't see.",
        },
      ],
    },

    {
      n: 6,
      id: "the-loop",
      eyebrow: "The method",
      title: "Why the local dev server is the whole game",
      blocks: [
        {
          kind: "flow",
          items: [
            {
              label: "You prompt",
              body: "Screenshot, Figma frame, exact words.",
            },
            {
              label: "Claude edits files",
              body: "Writes the components and styles.",
            },
            {
              label: "Browser updates",
              body: "npm run dev refreshes localhost:3000 in under a second.",
            },
            {
              label: "You judge",
              body: "Look at it at 375px. Accept, or say what's wrong.",
            },
          ],
        },
        {
          kind: "note",
          text: "The loop is look → reject → repeat. That needs a browser tab that updates instantly, on your machine. Cloud-only tools break the loop: you'd be waiting on deploys to see every change.",
        },
      ],
    },

    {
      n: 7,
      id: "case-studies",
      eyebrow: "Before any code",
      title: "No case studies, no site",
      blocks: [
        {
          kind: "lede",
          text: "Three case studies. Not six. Three great ones, 500–800 words each, written in a doc first — not in the site.",
        },
        {
          kind: "grid",
          variant: "numbered",
          items: [
            {
              label: "Process",
              body: "The one where the research changed the design.",
            },
            {
              label: "Craft",
              body: "The one that looks the best. Pixel-level care.",
            },
            {
              label: "Outcome",
              body: "The one that shipped, or had a result you can name.",
            },
          ],
        },
        {
          kind: "note",
          text: "Hiring managers spend about 90 seconds. They are reading for how you think, not how the site was built.",
        },
      ],
    },

    {
      n: 8,
      id: "anatomy",
      eyebrow: "Template",
      title: "Anatomy of a case study that gets a reply",
      blocks: [
        {
          kind: "grid",
          variant: "numbered",
          items: [
            {
              label: "Problem",
              body: "Who it was for, what was broken. One paragraph.",
            },
            {
              label: "Constraints",
              body: "Time, team, tech, what you weren't allowed to change.",
            },
            {
              label: "What you did",
              body: "Process and artifacts: sketches, flows, tests, iterations.",
            },
            {
              label: "Decisions & why",
              body: "The 2–3 forks in the road and what you picked. This is the part that gets you hired.",
            },
            {
              label: "Outcome",
              body: "Shipped? Numbers? If none, what you learned.",
            },
            {
              label: "What you'd change",
              body: "One honest paragraph. Reads senior.",
            },
          ],
        },
      ],
    },

    {
      n: 9,
      id: "day-3",
      eyebrow: "Day 3",
      title: "Design it in Figma before Claude touches it",
      blocks: [
        {
          kind: "grid",
          variant: "check",
          items: [
            {
              label: "Site map",
              body: "Home, Work (3 case studies), About/Contact. That's it.",
            },
            {
              label: "Mobile frame first",
              body: "375 wide, then desktop. Not the other way.",
            },
            { label: "Type scale", body: "5 sizes, max. Name them." },
            { label: "Spacing scale", body: "4 / 8 / 16 / 24 / 48 / 96." },
            { label: "Colors", body: "One background, one text, one accent." },
            {
              label: "Two frames only",
              body: "Home and one case-study template. Don't design all three pages.",
            },
          ],
        },
        {
          kind: "note",
          text: "Claude builds what you show it. A Figma frame gets a faithful build. A vibe gets the same site everyone else with the same tool is shipping this month.",
        },
      ],
    },

    {
      n: 10,
      id: "day-1",
      eyebrow: "Day 1",
      title: "Scaffold it, push it, deploy it. Same day.",
      blocks: [
        {
          kind: "code",
          lines: [
            "npx create-next-app@latest portfolio",
            "# TypeScript: Yes   Tailwind: Yes   App Router: Yes",
            "cd portfolio",
            "npm install @tanstack/react-query",
            "npm run dev",
            "# open http://localhost:3000",
          ],
        },
        {
          kind: "grid",
          variant: "numbered",
          items: [
            {
              label: "Push to GitHub",
              body: "Create an empty repo on github.com, then tell Claude Code: “push this to my new GitHub repo called portfolio.”",
            },
            {
              label: "Import on Vercel",
              body: "vercel.com → Add New → Project → pick the repo → Deploy. Defaults are fine.",
            },
            {
              label: "You're live",
              body: "A real URL on Day 1. Everything after this is iteration on a site that already exists.",
            },
          ],
        },
        {
          kind: "note",
          text: "Also on Day 1: write CLAUDE.md. Do it before the first real build prompt.",
        },
      ],
    },

    {
      n: 11,
      id: "git",
      eyebrow: "Plumbing",
      title: "Git: the only five commands you need",
      blocks: [
        {
          kind: "grid",
          items: [
            { label: "git status", body: "What changed since the last save?" },
            { label: "git add .", body: "Stage everything." },
            {
              label: "git commit -m “what you did”",
              body: "Save a checkpoint with a note.",
            },
            {
              label: "git push",
              body: "Send it up. Vercel deploys automatically.",
            },
            { label: "git log --oneline", body: "See your history." },
          ],
        },
        {
          kind: "grid",
          variant: "check",
          items: [
            { label: "One branch", body: "It's called main. No others this week." },
            {
              label: "Commit often",
              body: "Every time something works. Small and often.",
            },
            { label: "Push = deploy", body: "Only push what you'd show someone." },
            {
              label: "Broke it?",
              body: "Tell Claude Code: “revert to the last commit.”",
            },
          ],
        },
        {
          kind: "note",
          text: "Git isn't a skill to learn. It's what makes breaking things free.",
        },
      ],
    },

    {
      n: 12,
      id: "the-daily-loop",
      eyebrow: "The method",
      title: "The loop you'll run fifty times a day",
      blocks: [
        {
          kind: "flow",
          items: [
            {
              label: "Describe",
              body: "One screen. Figma frame or screenshot attached. Exact sizes and rules.",
            },
            {
              label: "Build",
              body: "Claude Code edits. Watch the terminal; it tells you what it touched.",
            },
            {
              label: "Look",
              body: "Browser, at 375px and desktop. Actually click things.",
            },
            {
              label: "Judge",
              body: "Accept, or paste a screenshot and say precisely what's wrong.",
            },
            {
              label: "Commit",
              body: "Works? git add . / commit / push. Next screen.",
            },
          ],
        },
        {
          kind: "note",
          text: "Never accept what you haven't looked at. The agent will produce something competent by default. Competent-by-default is what everyone else is shipping. Your taste is the only thing on this site that isn't a commodity.",
        },
      ],
    },

    {
      n: 13,
      id: "prompting",
      eyebrow: "Directing",
      title: "Prompting: bad vs. good",
      blocks: [
        {
          kind: "split",
          columns: [
            {
              title: "Bad",
              items: ["“Make the homepage look nice and modern.”"],
            },
            {
              title: "Good",
              items: [
                "“Build the homepage from the attached Figma frame. Hero: my name at 64px, one-line role in the muted color. Below it, 3 project cards: 1 column on mobile, 3 on desktop, 16px gap. Use the type and spacing scale in CLAUDE.md. No animations. Tell me what files you changed.”",
              ],
            },
          ],
        },
        {
          kind: "grid",
          variant: "check",
          items: [
            {
              label: "One screen per prompt",
              body: "Not “build the site.”",
            },
            {
              label: "Say what NOT to do",
              body: "It over-decorates by default.",
            },
            {
              label: "Attach the frame",
              body: "A Figma frame or a screenshot, every time.",
            },
            {
              label: "Ask what changed",
              body: "So you learn the shape of the project.",
            },
          ],
        },
        {
          kind: "note",
          text: "Specifics in, faithful build out. Vibes in, generic out.",
        },
      ],
    },

    {
      n: 14,
      id: "claude-md",
      eyebrow: "Day 1",
      title: "CLAUDE.md: your design system, in words",
      blocks: [
        {
          kind: "lede",
          text: "A plain text file at the root of the repo. Claude Code reads it at the start of every session, so every prompt inherits your rules without you repeating them.",
        },
        {
          kind: "grid",
          variant: "check",
          items: [
            { label: "Write it on Day 1", body: "Before the first real build." },
            {
              label: "Update it",
              body: "Whenever you make a new rule (“never center body text”).",
            },
            {
              label: "Rules about what NOT to do",
              body: "The most valuable lines in it.",
            },
            {
              label: "Keep it",
              body: "It's a great artifact to talk about in interviews.",
            },
          ],
        },
        {
          kind: "code",
          caption: "Example. Replace with your own scale from Figma.",
          lines: [
            "# Portfolio rules",
            "- Fonts: Inter (body), Instrument Serif (headings)",
            "- Type scale: 14 / 16 / 20 / 28 / 44 / 64",
            "- Spacing: 4 / 8 / 16 / 24 / 48 / 96",
            "- Colors: bg #0E0E0E, text #F2F2EE, accent #D4FF3A",
            "- Mobile first. Body max-width 720px.",
            "- Left-align all body text.",
            "- No animations, gradients, or custom cursors unless I ask.",
            "- Every image goes through next/image.",
            "- Content lives in /content as .mdx files.",
            "- After each change, tell me which files you edited.",
          ],
        },
      ],
    },

    {
      n: 15,
      id: "reject-list",
      eyebrow: "Day 6",
      title: "The reject list",
      blocks: [
        { kind: "lede", text: "Run it before every push you'd show someone." },
        {
          kind: "grid",
          variant: "check",
          items: [
            {
              label: "375px wide, no horizontal scroll",
              body: "Chrome DevTools → device toolbar. Every page.",
            },
            {
              label: "Lighthouse ≥ 90",
              body: "Performance and Accessibility. DevTools → Lighthouse tab.",
            },
            {
              label: "Contrast passes 4.5:1",
              body: "Muted text on dark backgrounds is where this fails.",
            },
            {
              label: "Images optimized",
              body: "Every one through next/image. Under 300KB each.",
            },
            {
              label: "Keyboard works",
              body: "Tab through the whole site. Can you reach everything?",
            },
            {
              label: "Does it look like yours?",
              body: "Or like the default? The type scale is the tell.",
            },
          ],
        },
        {
          kind: "note",
          text: "Vibe-coded sites fail this list constantly. A designer being judged on a janky site is worse than no site.",
        },
      ],
    },

    {
      n: 16,
      id: "prototypes",
      eyebrow: "After launch, or Day 5 if you're fast",
      title: "Live prototypes: the actual flex",
      blocks: [
        {
          kind: "lede",
          text: "Most portfolios show screenshots of a flow. Yours embeds the flow, working, inside the case study. The reader uses it.",
        },
        {
          kind: "code",
          caption: "Start with one. Tell Claude Code:",
          lines: [
            "Build an interactive prototype of the onboarding",
            "flow from this Figma file, as a component embedded",
            "in the case-study page. Fake the data. Match the",
            "real product's dimensions on mobile.",
          ],
        },
        {
          kind: "grid",
          variant: "check",
          items: [
            {
              label: "“Here, use it”",
              body: "Beats twelve slides of process.",
            },
            {
              label: "Structurally impossible elsewhere",
              body: "It's the one thing a template site can't do.",
            },
            {
              label: "It makes a junior read as senior",
              body: "Because it is genuinely harder to make.",
            },
            {
              label: "A much smaller pool",
              body: "It's the portfolio of a design engineer, not another junior product designer.",
            },
          ],
        },
        {
          kind: "note",
          text: "If it needs real data from an API, that's what TanStack Query is for. Otherwise, fake it.",
        },
      ],
    },

    {
      n: 17,
      id: "calendar",
      eyebrow: "The calendar",
      title: "Seven days, start to live",
      blocks: [
        {
          kind: "calendar",
          items: [
            {
              day: "0",
              label: "Install",
              body: "Everything on the Day 0 slide. Accounts made. Versions print.",
            },
            {
              day: "1",
              label: "Scaffold + deploy",
              body: "create-next-app, push, Vercel. Write CLAUDE.md. Site map in Figma.",
            },
            {
              day: "2",
              label: "Write",
              body: "Three case studies, in a doc, using the anatomy template.",
            },
            {
              day: "3",
              label: "Design",
              body: "Home + case-study template in Figma. Mobile first. Type and spacing scales set.",
            },
            {
              day: "4",
              label: "Build the shell",
              body: "Home and the case-study template with Claude Code. Screen by screen.",
            },
            {
              day: "5",
              label: "Fill it",
              body: "Three case studies as MDX. About page. Real images.",
            },
            {
              day: "6",
              label: "Quality pass",
              body: "The reject list, every page. Fix until it passes.",
            },
            {
              day: "7",
              label: "Launch",
              body: "Domain pointed. Send the link to five people. Ask what confused them.",
            },
          ],
        },
        { kind: "note", text: "You type every command. That's the deal." },
      ],
    },

    {
      n: 18,
      id: "finish-line",
      eyebrow: "Finish line",
      title: "Done means. Then what.",
      blocks: [
        {
          kind: "split",
          columns: [
            {
              title: "Done on Day 7 when",
              items: [
                "It's live on your own domain.",
                "Three case studies, each with a real decisions section.",
                "It passes the reject list on every page.",
                "You can explain every design decision on it out loud.",
                "You've sent it to five people.",
              ],
            },
            {
              title: "After launch",
              items: [
                "Add one live prototype per case study, one at a time.",
                "Iterate weekly from feedback. Small commits.",
                "Keep CLAUDE.md honest. It's your design system now.",
                "Apply with the URL in the first line of every message.",
                "Start describing yourself as someone who ships.",
              ],
            },
          ],
        },
        { kind: "note", text: "Refine for months. Ship in a week." },
      ],
    },
  ] satisfies DeckSlide[],
} as const;

export type Deck = typeof deck;
