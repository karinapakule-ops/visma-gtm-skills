# Visma GTM Skill Library — Technical Specification

_Last updated: 2026-08-14 · Owner: Karina Pakule (Technology Transformation team)_

---

## 1. Purpose

An internal, browsable web library of reusable **go-to-market AI skills** for Visma teams,
inspired by the format of [gtmskills.com](https://www.gtmskills.com/). Each entry is a skill
— a structured, reusable instruction set — that a GTM employee can read, copy, and run inside
an AI agent (Claude / Cowork, Copilot, etc.) to perform a specific sales task: account
research, outreach, meeting prep, CRM hygiene, and so on.

The site is the **storefront**; the skills are the **product**. Every skill is both
human-readable (browsable on the site) and portable (copyable / downloadable as text).

---

## 2. Architecture at a glance

- **Type:** Static website. No server, no database, no backend.
- **Runtime dependencies:** None. Plain HTML + CSS + vanilla JavaScript. No frameworks, no
  build step required to _serve_ it, no third-party JS loaded at runtime.
- **Content model:** Each skill authored as a Markdown file in `/skills`. A small Node script
  compiles those into a single JavaScript data file (`assets/js/skills-data.js`) that the
  pages load directly.
- **Hosting:** GitHub Pages (free tier), public. Repo:
  `https://github.com/karinapakule-ops/visma-gtm-skills`
  Live: `https://karinapakule-ops.github.io/visma-gtm-skills/`
- **Design system:** Visma 2026 brand (see §9).

### Why content is embedded in a `.js` file

The site does **not** fetch raw `.md` files at runtime. Instead, all skill content is
compiled into `assets/js/skills-data.js`, which assigns a global `window.SKILLS` array.

This decision was deliberate: GitHub Pages runs **Jekyll** by default, and Jekyll rewrites
any `.md` file that has YAML front matter into `.html` — so runtime `fetch('skills/x.md')`
returned 404 on the live site. Embedding content in a `.js` file (which Jekyll never rewrites)
makes the site **immune to Jekyll**, removes all dependency on the `.nojekyll` control file,
and has a bonus: the site even works when opened directly from `file://` (no server needed).

---

## 3. Technology stack

| Layer | Technology | Notes |
|---|---|---|
| Markup | HTML5 | Two pages: `index.html`, `skill.html` |
| Styling | CSS3 (custom properties, flexbox, grid) | Single stylesheet, Visma brand tokens |
| Behaviour | Vanilla JavaScript (ES2015+) | No frameworks, no bundler |
| Markdown rendering | Custom mini-renderer (`assets/js/md.js`) | ~120 lines, dependency-free |
| Fonts | Instrument Sans via Google Fonts | Visma-approved web fallback; degrades to system fonts |
| Content authoring | Markdown + YAML front matter | One file per skill in `/skills` |
| Build tooling | Node.js (build scripts only) | Not needed to run the site, only to regenerate data |
| Hosting / CI | GitHub Pages | Deploy from `main` branch, root folder |

---

## 4. Directory structure

```
visma-gtm-skills/
├── index.html                  # Home: hero, intro, search, category filters, skill grid
├── skill.html                  # Skill detail page (reads ?slug= query param)
├── assets/
│   ├── favicon.svg             # Visma monogram on purple
│   ├── css/
│   │   └── styles.css          # All styling + Visma brand tokens
│   └── js/
│       ├── md.js               # Markdown → HTML renderer + front-matter parser
│       ├── skills-data.js      # AUTO-GENERATED: window.SKILLS (metadata + body)
│       ├── app.js              # Home page logic (filter, search, render cards)
│       └── skill.js            # Detail page logic (render one skill, copy/download)
├── skills/                     # SOURCE OF TRUTH — one Markdown file per skill
│   ├── _template.md            # Contribution template (ignored by build; leading _)
│   └── <slug>.md               # e.g. hubspot-account-research-brief.md
├── scripts/
│   ├── build-data.mjs          # Compiles skills/*.md → assets/js/skills-data.js
│   └── build-index.mjs         # Compiles skills/*.md → skills.json (legacy/reference)
├── skills.json                 # Reference index (not used at runtime anymore)
├── .github/workflows/
│   └── build-index.yml         # (optional) auto-rebuild index on push
├── .nojekyll                   # Present but no longer load-bearing (see §2)
├── README.md
├── CONTRIBUTING.md
└── TECHNICAL_SPEC.md           # This document
```

---

## 5. Data model

Each skill is a Markdown file with a YAML front-matter block followed by the skill body.

```markdown
---
title: Account Research Brief
category: Prospecting
summary: One-sentence description shown on the card.
trigger: When to use it — one line.
inputs: What the user must supply.
connectors: HubSpot MCP · Web search
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: research, prospecting, discovery
---

# Account Research Brief

## What it does
...the full skill instructions (the payload an AI agent runs)...
```

### Compiled record (`window.SKILLS[]`)

| Field | Type | Source | Used by |
|---|---|---|---|
| `slug` | string | filename | routing, card links |
| `title` | string | front matter | cards, detail heading, `<title>` |
| `category` | string | front matter | filter chips |
| `summary` | string | front matter | card + detail sub-heading |
| `trigger` | string | front matter | detail "When to use" |
| `inputs` | string | front matter | (available; reference) |
| `connectors` | string | front matter | detail metadata |
| `owner` | string | front matter | card avatar + detail |
| `updated` | string (YYYY-MM-DD) | front matter | detail metadata |
| `tags` | string[] | front matter (comma-split) | search |
| `body` | string (Markdown) | everything after front matter | rendered on detail page, copied, downloaded |

The front-matter parser (`md.js → parseFrontMatter`) splits on the first `:` per line, so
values may contain colons. Keep each value on a single line; do not remove the `---` fences.

---

## 6. Pages & behaviour

### 6.1 Home (`index.html` + `app.js`)
1. Loads `window.SKILLS` from `skills-data.js` (no fetch).
2. Renders category filter chips with per-category counts (derived from the data) plus an
   "All" chip.
3. Renders a responsive grid of skill cards (category pill, title, summary, owner, link).
4. **Search:** case-insensitive, whitespace-tokenised AND-match across
   `title + summary + category + trigger + tags`.
5. **Filter:** clicking a chip filters to that category; combines with the active search term.
6. Card click → `skill.html?slug=<slug>`.

### 6.2 Skill detail (`skill.html` + `skill.js`)
1. Reads `slug` from the query string (validated against `^[a-z0-9-]+$`).
2. Looks the skill up in `window.SKILLS` (no fetch).
3. Renders: back link, category pill, title, summary, metadata row (owner / updated /
   connectors / when-to-use), an action bar, and the rendered Markdown body.
4. **Action bar (two actions):**
   - **Copy text** — copies the raw skill body to the clipboard (Clipboard API with a
     `textarea + execCommand` fallback for non-secure contexts).
   - **Download .md** — generates the `.md` file in-memory via a `Blob` + object URL
     (no server file required).

> Note: an earlier "Download .skill (install)" button and the `packages/*.skill` bundles
> were removed by product decision; the library is now copy/read-oriented.

### 6.3 Markdown renderer (`md.js`)
A small, dependency-free renderer supporting: headings, bold/italic, inline code, fenced
code blocks, ordered/unordered lists, links, blockquotes, horizontal rules, paragraphs, and
**GitHub-style pipe tables** (added specifically because the skill content is table-heavy).
All text is HTML-escaped before inline formatting; content inside code fences is escaped and
left unformatted.

---

## 7. Build scripts

Run only when skill content changes — not needed to serve the site.

```bash
node scripts/build-data.mjs   # skills/*.md  →  assets/js/skills-data.js   (REQUIRED)
node scripts/build-index.mjs  # skills/*.md  →  skills.json                (optional/legacy)
```

`build-data.mjs` scans `/skills` (ignoring files starting with `_`), parses front matter +
body, sorts by title, and writes `window.SKILLS = [...]`. `skills-data.js` is
**auto-generated — do not hand-edit**.

---

## 8. Content taxonomy

Six categories (mirroring the source HubSpot Skills Catalog), currently 9 skills:

| Category | Skills |
|---|---|
| **Prospecting** | Account Research Brief · Contact Role Mapper |
| **Outreach** | Follow-up Email Generator |
| **Meeting Prep** | Meeting Prep Checklist |
| **CRM Hygiene** | SPICED Call Note Structurer · Deal Summary & Next-Step Updater |
| **Productivity** | Daily Action Digest |
| **Foundations** | HubSpot API Best Practices · Company Context (Template) |

`Company Context` ships as a **genericized template** (placeholders, no real commercial data),
because the site is public. Contributors fill it in per company.

---

## 9. Design system (Visma 2026 brand)

| Token | Value |
|---|---|
| Primary purple | `#7F56FA` |
| Black | `#131313` |
| White (base) | `#FEFEFE` |
| Creme | `#F9F5F1` |
| Cool grey light (borders) | `#E7EBEC` |
| Amplify gradient | `linear-gradient(135deg, #7F56FA, #FFAB65)` |
| Font | Instrument Sans (web fallback for Visma Text) |
| Logo | Visma wordmark, inlined SVG (black on light, white on dark footer) |

Design principles: white-dominant layout, purple/gradient reserved for key moments
(hero eyebrow, avatars, category pills), generous whitespace, one typeface in multiple
weights.

---

## 10. Contribution workflow

Adding a skill is **one Markdown file** (see `CONTRIBUTING.md`):

1. Add `skills/<slug>.md` using `skills/_template.md` as a starting point.
2. Run `node scripts/build-data.mjs` (or let a maintainer do it) to regenerate
   `skills-data.js`.
3. Commit and push. GitHub Pages redeploys automatically.

`<slug>` (the filename) becomes the skill's URL, so keep it short, lowercase, hyphenated,
and stable.

---

## 11. Deployment

- **Method:** GitHub Pages → Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
- **URL:** `https://karinapakule-ops.github.io/visma-gtm-skills/`
- **Recommended local workflow:** clone via **GitHub Desktop**, edit, commit, push — this
  reliably includes folders and hidden files (the web uploader silently drops dot-files and
  can miss folders).
- **Jekyll note:** the site is Jekyll-proof by design (§2); `.nojekyll` is retained but is no
  longer load-bearing.

### Access / privacy
Public site. Only non-sensitive content should be published. Company-specific commercial
detail (real ICP, pricing, customer names) must **not** be committed — `Company Context` is a
blank template for this reason. Restricting access would require GitHub Enterprise (private
Pages), Cloudflare Access, or a move to GitLab Pages.

---

## 12. Known limitations & possible future work

- **No auth / analytics.** No login, no view counts (the reference site shows view counts).
- **Client-side search only.** Fine for tens/hundreds of skills; not built for thousands.
- **Manual build step.** `skills-data.js` must be regenerated when content changes (a GitHub
  Action could automate this).
- **Markdown renderer is a subset.** Supports the features the skills use; not a full
  CommonMark implementation (e.g. nested lists, images, footnotes are not handled).
- **Potential enhancements:** per-skill "last validated" badge, a contribution form, an
  auto-index GitHub Action, a private-access option, and a short "how to use a skill" explainer
  on the homepage.
```
