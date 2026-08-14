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
