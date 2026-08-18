# Visma GTM Skill Library — Technical Specification

_Last updated: 2026-08-18 · Owner: Karina Pakule (Technology Transformation team)_

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
  pages load directly. This compile now runs **automatically in CI** on every deploy (see
  §11) — contributors never run a build locally.
- **Hosting:** GitHub Pages (free tier), public, deployed via a **GitHub Actions workflow**
  (`deploy.yml`) rather than from a branch. Repo:
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
| Markup | HTML5 | Four pages: `index.html` (landing), `all-skills.html` (library), `skill.html` (detail), `personalise.html` |
| Styling | CSS3 (custom properties, flexbox, grid) | Single stylesheet, Visma brand tokens |
| Behaviour | Vanilla JavaScript (ES2015+) | No frameworks, no bundler |
| Markdown rendering | Custom mini-renderer (`assets/js/md.js`) | ~120 lines, dependency-free |
| Fonts | Instrument Sans via Google Fonts | Visma-approved web fallback; degrades to system fonts |
| Content authoring | Markdown + YAML front matter | One file per skill in `/skills` |
| Build tooling | Node.js (build scripts only) | Runs in CI on deploy; not needed to run the site locally |
| Hosting / CI | GitHub Pages via GitHub Actions | `deploy.yml` builds data + publishes; `pr-guard.yml` gates PRs |

---

## 4. Directory structure

```
visma-gtm-skills/
├── index.html                  # Landing: hero, three-step "how it works", CTA buttons (no grid)
├── all-skills.html             # Library: search, category filters, skill card grid
├── skill.html                  # Skill detail page (reads ?slug= query param)
├── personalise.html            # Static note on tailoring skills to your own data
├── assets/
│   ├── favicon.svg             # Visma monogram on purple
│   ├── css/
│   │   └── styles.css          # All styling + Visma brand tokens
│   └── js/
│       ├── md.js               # Markdown → HTML renderer + front-matter parser
│       ├── skills-data.js      # CI-GENERATED: window.SKILLS (metadata + body)
│       ├── app.js              # All-skills page logic (filter, search, render cards)
│       └── skill.js            # Detail page logic (render one skill, copy/download)
├── skills/                     # SOURCE OF TRUTH — one Markdown file per skill
│   ├── _template.md            # Contribution template (ignored by build; leading _)
│   └── <slug>.md               # e.g. hubspot-account-research-brief.md
├── scripts/
│   ├── build-data.mjs          # Compiles skills/*.md → assets/js/skills-data.js
│   └── build-index.mjs         # Compiles skills/*.md → skills.json (legacy/reference)
├── skills.json                 # Reference index (regenerated in CI; not used at runtime)
├── .github/workflows/
│   ├── deploy.yml              # Build data in CI + deploy site to GitHub Pages
│   └── pr-guard.yml            # Fail any PR that touches files outside skills/
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
category: Prospecting, HubSpot
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
| `categories` | string[] | front matter `category`, comma-split | filter chips + category pills |
| `summary` | string | front matter | card + detail sub-heading |
| `trigger` | string | front matter | detail "When to use" |
| `inputs` | string | front matter | (available; reference) |
| `connectors` | string | front matter | detail metadata |
| `owner` | string | front matter (**required** on new/edited skills — see §13; builder falls back to `Visma GTM`) | card avatar + detail |
| `updated` | string (YYYY-MM-DD) | front matter | detail metadata |
| `tags` | string[] | front matter (comma-split) | search |
| `body` | string (Markdown) | everything after front matter | rendered on detail page, copied, downloaded |

**Multi-category:** the `category` field accepts a **comma-separated list**, compiled into the
`categories` array. A skill therefore appears under every one of its categories. By convention
the **first** category is the primary one; **`HubSpot`** is used as a secondary tag on skills
that rely on the HubSpot connector, and renders as a distinct pill (Visma Black) to set it
apart from the primary (purple) pill.

The front-matter parser (`md.js → parseFrontMatter`) splits on the first `:` per line, so
values may contain colons. Keep each value on a single line; do not remove the `---` fences.

---

## 6. Pages & behaviour

### 6.1 Landing (`index.html`)
A static landing page — **no data load, no search, no grid**. It carries the hero, a
three-step "how it works" explainer, and call-to-action buttons into the library and the
contribution guide. Top navigation (**All skills · Personalise · Contribute**) is shared
across every page.

### 6.2 All skills (`all-skills.html` + `app.js`)
This is the browsable library (the grid moved here off the home page).
1. Loads `window.SKILLS` from `skills-data.js` (no fetch).
2. Renders category filter chips with per-category counts (derived from the data) plus an
   "All" chip. Counts respect multi-category skills (a skill counts under each category).
3. Renders a responsive grid of skill cards (category pills, title, summary, owner, link).
4. **Search:** case-insensitive, whitespace-tokenised AND-match across
   `title + summary + categories + trigger + tags`.
5. **Filter:** clicking a chip filters to that category; combines with the active search term.
6. Card click → `skill.html?slug=<slug>`.

### 6.3 Skill detail (`skill.html` + `skill.js`)
1. Reads `slug` from the query string (validated against `^[a-z0-9-]+$`).
2. Looks the skill up in `window.SKILLS` (no fetch).
3. Renders: back link, category pills (one per category; `HubSpot` shown in Visma Black),
   title, summary, metadata row (owner / updated / connectors / when-to-use), an action bar,
   and the rendered Markdown body.
4. **Action bar (two actions):**
   - **Copy text** — copies the raw skill body to the clipboard (Clipboard API with a
     `textarea + execCommand` fallback for non-secure contexts).
   - **Download .md** — generates the `.md` file in-memory via a `Blob` + object URL
     (no server file required).

> Note: an earlier "Download .skill (install)" button and the `packages/*.skill` bundles
> were removed by product decision; the library is now copy/read-oriented.

### 6.4 Markdown renderer (`md.js`)
A small, dependency-free renderer supporting: headings, bold/italic, inline code, fenced
code blocks, ordered/unordered lists, links, blockquotes, horizontal rules, paragraphs, and
**GitHub-style pipe tables** (added specifically because the skill content is table-heavy).
All text is HTML-escaped before inline formatting; content inside code fences is escaped and
left unformatted.

### 6.5 Personalise (`personalise.html`)
A static page (no data load) explaining how to tailor a copied skill to your own data before
running it — e.g. filling in the `Company Context` template. Reached from the top nav; it was
split out of the old home page so the landing page stays focused.

---

## 7. Build scripts

Both scripts run **automatically in CI** on every deploy (`deploy.yml`, §11) — you do **not**
need to run them by hand. Run them locally only if you want to preview generated output:

```bash
node scripts/build-data.mjs   # skills/*.md  →  assets/js/skills-data.js   (site data)
node scripts/build-index.mjs  # skills/*.md  →  skills.json                (legacy/reference)
```

`build-data.mjs` scans `/skills` (ignoring files starting with `_`), parses front matter +
body, sorts by title, and writes `window.SKILLS = [...]`. `skills-data.js` is
**machine-generated — do not hand-edit**; the deploy workflow overwrites it. Because it is
rebuilt in CI, the copy committed in the repo is not load-bearing for the live site.

---

## 8. Content taxonomy

Six **primary** categories (mirroring the source HubSpot Skills Catalog), currently 9 skills:

| Primary category | Skills |
|---|---|
| **Prospecting** | Account Research Brief · Contact Role Mapper |
| **Outreach** | Follow-up Email Generator |
| **Meeting Prep** | Meeting Prep Checklist |
| **CRM Hygiene** | SPICED Call Note Structurer · Deal Summary & Next-Step Updater |
| **Productivity** | Daily Action Digest |
| **Foundations** | HubSpot API Best Practices · Company Context (Template) |

Plus one **cross-cutting** category, **`HubSpot`**, applied as a secondary tag to every skill
that uses the HubSpot connector (all 8 above except `Company Context`, which is
Foundations-only). Categories are **derived dynamically from the front matter**, so adding a
new `category:` value automatically creates a new filter chip — no code change needed.

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

Design principles: **warm Creme (`#F9F5F1`) page background** with **white cards, callouts,
and the skill action bar** raised on top of it for contrast; purple/gradient reserved for key
moments (hero eyebrow, avatars, primary category pills), generous whitespace, one typeface in
multiple weights.

---

## 10. Contribution workflow

Adding a skill is **one Markdown file**, contributed via **pull request** (see
`CONTRIBUTING.md` and the governance rules in §13):

1. Add or edit `skills/<slug>.md` (start from `skills/_template.md`) — in the GitHub browser
   editor or locally.
2. Open a **pull request**. Anyone with a GitHub account can do this; without write access,
   GitHub auto-creates a fork. No local build step — CI regenerates the data.
3. The `pr-guard` check fails the PR if it touches anything outside `skills/`.
4. A maintainer reviews and approves. On merge, `deploy.yml` rebuilds the data and redeploys
   GitHub Pages automatically.

`<slug>` (the filename) becomes the skill's URL, so keep it short, lowercase, hyphenated,
and stable.

---

## 11. Deployment

- **Method:** GitHub Pages, **Source = GitHub Actions** (Settings → Pages → Build and
  deployment → Source → GitHub Actions). The `deploy.yml` workflow runs on every push to
  `main` (i.e. every merged PR): it regenerates the skill data (`build-data.mjs` +
  `build-index.mjs`), uploads the whole site as a Pages artifact, and deploys it. The
  generated data files are **never committed back** to the repo.
- **URL:** `https://karinapakule-ops.github.io/visma-gtm-skills/`
- **Recommended local workflow:** clone via **GitHub Desktop**, edit, commit, open a PR — this
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
- **Markdown renderer is a subset.** Supports the features the skills use; not a full
  CommonMark implementation (e.g. nested lists, images, footnotes are not handled).
- **"Own file only" is review-enforced, not automated.** `pr-guard` limits PRs to `skills/`,
  but nothing stops a contributor from editing *someone else's* skill file — the maintainer
  catches that in review (§13).
- **Resolved since v1:** the build is no longer manual — CI regenerates `skills-data.js` on
  every deploy (§7, §11).
- **Potential enhancements:** per-skill "last validated" badge, a contribution form, a
  private-access option, and a short "how to use a skill" explainer on the homepage.

---

## 13. Governance & branch protection

Contributions are open, but nothing reaches the live site without maintainer review.

- **`main` is protected** by a repository ruleset: a pull request with **1 approval** is
  required before merging; direct pushes and force-pushes to `main` are blocked. The
  repository admin (owner) is on the ruleset **bypass list** for fixes.
- **Path restriction & required fields** — the required **`only-skills`** status check
  (`pr-guard.yml`) fails any PR that changes files outside `skills/`, **or that adds/edits a
  skill without a real `owner:`** (blank, or the unedited `Your team or name` placeholder).
  Contributors can therefore only add or edit skill Markdown, never site code or config, and
  every skill has a named owner.
- **Who can contribute** — the repo is public, so **anyone with a GitHub account** can open a
  PR (GitHub auto-forks for users without write access). Named **collaborators (Write)** get
  the smoother branch-based flow and can be granted review duties.
- **"Edit only your own file"** is **enforced by review**, not automation: every PR shows the
  author and the exact diff, and the maintainer rejects edits to a skill the author doesn't
  own. (There is no reliable machine-readable owner identity today — the `owner` field is
  free-text, not a GitHub username.)
- **Deploy identity** — because data is built in CI and never committed back, no bot needs
  push access to `main`; the deploy runs with the scoped `GITHUB_TOKEN` via GitHub Actions.

See `CONTRIBUTING.md` for the contributor-facing version of this flow.
