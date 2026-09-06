# Adding a case study

## The short version

1. Copy `content/work/_TEMPLATE.mdx` to `content/work/your-project-name.mdx`.
2. Fill in the block at the top, between the `---` lines.
3. Write.
4. Set `draft: false` when you want it live.

The file name becomes the URL. `content/work/onboarding-redesign.mdx` is at
`/work/onboarding-redesign`. There is no list to update and no route to
register — the site reads the folder.

Files whose name starts with `_` are ignored, which is why `_TEMPLATE.mdx`
never shows up on the site.

## The frontmatter

The block at the top of the file. Everything down to `emphasis` is required; if
you leave one out, the site stops and tells you which file and which field,
rather than printing "undefined" at a hiring manager.

| Field      | Required | What it is                                                       |
| ---------- | -------- | ---------------------------------------------------------------- |
| `title`    | yes      | The project, named the way you'd say it out loud.                |
| `client`   | yes      | Company, client, team, or "Personal project".                    |
| `role`     | yes      | Your job on it. "Product design, prototyping".                   |
| `year`     | yes      | Free text. `"2025"`, `"Spring 2024"`, `"2023 — 2024"`.           |
| `summary`  | yes      | One sentence. The line that decides whether anyone opens it.     |
| `emphasis` | yes      | `process`, `craft`, or `outcome`. `/work` groups by this.        |
| `tags`     | no       | Three or four short labels. Not ten.                             |
| `cover`    | no       | Path from `public/`, e.g. `/work/my-slug/cover.jpg`.             |
| `coverAlt` | with cover | What the image shows. Required whenever `cover` is set.        |
| `draft`    | no       | `true` hides it from the live site but keeps it in `npm run dev`.|
| `order`    | no       | Lower comes first on `/work`. Defaults to 100.                   |

Quote a year: `year: 2025` without quotes is a number, and `year: "2025"` is
text. The site wants text.

## Emphasis, and why there are only three case studies

The rule from the course is three case studies, one each doing a different job:

- **process** — the one where the research changed the design
- **craft** — the one that looks the best, pixel-level care
- **outcome** — the one that shipped, or had a result you can name

`/work` groups by `emphasis` and labels each group. Six case studies that all do
the same job read worse than three that don't.

## Writing it

The template has six headings, in this order, and they are the order for a
reason:

1. **The problem** — who it was for, what was broken. One paragraph.
2. **Constraints** — time, team, tech, what you weren't allowed to change.
3. **What I did** — process and artifacts. Show the work.
4. **Decisions, and why** — the two or three real forks in the road. *This is
   the section that gets you hired.* If you write one section well, write this.
5. **Outcome** — shipped? numbers? If none, say so and say what you learned.
6. **What I'd change** — one honest paragraph. Reads senior.

500–800 words. Write it in a doc first, then paste it in — editing prose inside
a code editor makes you fiddle with the site instead of the writing.

## Images

Put them in `public/work/<slug>/`. Reference them from the `public` folder down:

```markdown
![What this screen shows and why it matters](/work/my-slug/step-2.png)
```

The alt text becomes the visible caption, so write it as a sentence about what
the image shows — not `screenshot-final-v3.png`.

Every image goes through `next/image` automatically, so it gets resized and
served in a modern format. Keep the source files under about 300KB anyway;
`next/image` can only do so much with a 12MB PNG.

## Things you can use in the body

Normal Markdown, plus GitHub-flavoured extras (tables, strikethrough), plus:

```mdx
<Note>
  An aside that isn't part of the argument: a credit, a link to the live
  thing, a caveat about what you can and can't show.
</Note>
```

Styling for every one of these lives in `components/mdx-components.tsx`. Change
it there once and every case study follows. Don't put styling in the `.mdx`.

## Drafts

`draft: true` keeps a case study off the live site but leaves it visible when
you run `npm run dev`, so you can read it in place while you work on it. Flip it
to `false` when it's ready.

The three files named `sample-*.mdx` are drafts for exactly this reason. Delete
them once yours exist.
