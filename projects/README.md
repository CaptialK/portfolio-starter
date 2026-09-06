# Your projects live here

You don't write code to add a project. You add a folder. The site notices, and a
page appears. Then you hand the folder to Claude and tell it what you want the
page to be.

The folder name becomes the address: `projects/onboarding-redesign` shows at
`/work/onboarding-redesign`. Lowercase, dashes instead of spaces.

Anything starting with `_` is ignored, which is how `_template/` stays off the
site.

## Five steps

1. In VS Code's file tree, right-click `_template` → Duplicate. Rename the copy
   to your project, lowercase-with-dashes.
2. Drag your files in from Finder: a cover image, screenshots into `images/`, a
   Figma PDF export, whatever you have. Names don't matter yet; you'll tidy them
   later.
3. Open `project.md`. Fill in the top: title, your role, year, tools, one-line
   summary. Leave the long sections empty if you haven't written them. Save.
4. Look at `localhost:3000/work`. Your project card is there. Click it. That's
   your page, unstyled and honest.
5. Now hand it to Claude with one of the prompts at `/guide/start`.

## What goes in a folder

```
your-project/
├── project.md      the words. the top bit shows on the card
├── cover.jpg       the card image. any size; it's cropped to a wide shape
├── images/         screenshots, numbered in the order you'd tell the story
└── prototype/      optional. Figma exports, flow notes, anything for later
```

Reference an image from inside `project.md` the normal Markdown way, with a path
relative to the folder:

```
![What this screen shows](images/02-wireframes.png)
```

The text in the square brackets becomes the caption under the image, so write it
as a sentence about what the picture shows — not `screenshot-final-v3`.

## The six sections

Leave any of them empty and the page still shows the heading with a quiet "Not
written yet" underneath, so you can see the shape of what's missing.

1. **Problem** — who it was for, what was broken.
2. **Constraints** — time, team, tech, what you weren't allowed to change.
3. **What I did** — process and artifacts.
4. **Decisions and why** — the forks in the road. This is the part that gets you hired.
5. **Outcome** — shipped? numbers? if none, what you learned.
6. **What I'd change** — one honest paragraph.

## Before you show anyone

Delete `onboarding-redesign/`. It's an example, and its summary says so.
