# Visma GTM Skill Library

An internal, browsable library of reusable **go-to-market AI skills** for Visma teams.
Find a skill, copy it, and paste it into your AI agent (Claude, Copilot, …) to run the
play — from prospecting to pricing.

It's a static website (plain HTML/CSS/JS, no build tooling, no dependencies) designed to
be hosted for free on **GitHub Pages**. Each skill is a single Markdown file in `skills/`.

## How it works

- `index.html` — the library: search + category filters + skill cards.
- `skill.html` — a single skill page, with **Copy skill** and **Download .md** buttons.
- `skills/*.md` — one file per skill (front matter + the skill itself).
- `skills.json` — the search index, generated from the Markdown files.
- `.github/workflows/build-index.yml` — rebuilds `skills.json` automatically when a skill
  is added or changed, so contributors only touch one Markdown file.

## Add a skill

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: add a Markdown file to `skills/`
using [`skills/_template.md`](skills/_template.md) as a starting point — the site updates
itself.

## Run it locally (optional)

Because the pages fetch `skills.json` and the Markdown files, open it through a small local
server rather than double-clicking the HTML:

```bash
# from the project folder
npx serve .
# or
python -m http.server 8000
```

Then visit the printed URL. To regenerate the index by hand:

```bash
node scripts/build-index.mjs
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch
   `main`, folder `/ (root)`, and save.
3. Wait ~1 minute; your site is live at `https://<user-or-org>.github.io/<repo>/`.

The full step-by-step guide lives alongside this project.

---

Built with the Visma 2026 brand. Not affiliated with gtmskills.com — inspired by the format.
