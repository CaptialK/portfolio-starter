# Adding a project

## The short version

1. In VS Code's file tree, right-click `projects/_template` → Duplicate.
2. Rename the copy to your project, lowercase-with-dashes.
3. Open `project.md`, fill in the top, save.
4. Look at `localhost:3000/work`. It's there.

No code. No list to update. The folder name becomes the address, so
`projects/onboarding-redesign` shows at `/work/onboarding-redesign`.

Folders starting with `_` are skipped, which is how `_template` stays off the
site.

## What goes in the folder

```
your-project/
├── project.md      the words. the top bit shows on the card
├── cover.jpg       the card image. any size; it's cropped to a wide shape
├── images/         screenshots, numbered in the order you'd tell the story
└── prototype/      optional. Figma exports, flow notes, anything for later
```

## The top of project.md

The block between the `---` lines. `title`, `role`, `year` and `summary` are
required — leave one out and the site stops and tells you which folder and which
word, rather than showing "undefined" to a hiring manager.

| Field     | Required | What it is                                          |
| --------- | -------- | --------------------------------------------------- |
| `title`   | yes      | The project, named the way you'd say it out loud.    |
| `role`    | yes      | Your job on it. "Product designer".                  |
| `year`    | yes      | "2026", or "Spring 2024".                            |
| `summary` | yes      | One sentence. The line that decides who opens it.    |
| `tools`   | no       | "Figma, Maze, Notion".                               |
| `cover`   | no       | File name of the card image, in the same folder.     |

## Images

Drop them in `images/` and reference them from `project.md` with a path relative
to the folder:

```markdown
![What this screen shows and why it matters](images/02-wireframes.png)
```

The text in square brackets becomes the caption underneath, so write it as a
sentence about what the picture shows — not `screenshot-final-v3`.

Number them in the order you'd tell the story. `01-`, `02-`, `03-`. It keeps
them sorted in Finder and makes it obvious when one is missing.

Every image is served at its real proportions, so nothing on the page moves
around while they load. PNG, JPEG, GIF and WebP all work. Keep them under about
300KB each.

## The six sections

Leave any of them empty and the page still shows the heading, with a quiet "Not
written yet" underneath. That's deliberate: you can see the shape of what's left
to write without opening the file.

1. **Problem** — who it was for, what was broken. One paragraph.
2. **Constraints** — time, team, tech, what you weren't allowed to change.
3. **What I did** — process and artifacts. Show the work.
4. **Decisions and why** — the two or three real forks in the road. *This is the
   section that gets you hired.* If you write one well, write this one.
5. **Outcome** — shipped? numbers? If none, say so and say what you learned.
6. **What I'd change** — one honest paragraph. Reads senior.

500–800 words. Write them in a doc first, then paste them in — editing prose
inside a code editor makes you fiddle with the site instead of the writing.

You can add your own headings beyond these six; they appear after them, in the
order you wrote them.

## Then hand it to Claude

Adding the folder is step one. Step two is asking for the page you want. The
prompts to paste are at `/guide/start` — one that interviews you until the words
are written, one that turns it into a designed page, one that adds a working
prototype.

Add the folder first, prompt second. Claude does better when the files exist.

## The example

`projects/onboarding-redesign/` is a worked example, and its summary says so in
capitals. Delete the whole folder once you have one of your own.
