# Contributing a skill

Adding a skill is **one Markdown file**. No coding required — you can do it entirely in
the GitHub website.

## Add a skill (in the browser)

1. Go to the `skills/` folder in this repository.
2. Click **Add file → Create new file**.
3. Name it with lowercase words and hyphens, ending in `.md` — e.g.
   `competitor-battlecard.md`. **This filename becomes the skill's web address**, so keep
   it short and stable.
4. Copy the contents of [`skills/_template.md`](skills/_template.md) into the file and fill
   it in.
5. Click **Commit changes**. GitHub will offer to **create a new branch and start a pull
   request** — choose that and click **Propose changes**.

Your change now waits as a **pull request** for review. Once it's approved and merged, the
site rebuilds automatically and your skill appears within a minute or two. You can only add
or edit files inside `skills/` — that's by design, so a stray edit can't break the site.

## The front matter (the block at the top between `---` lines)

| Field      | Required | Notes                                                        |
|------------|----------|--------------------------------------------------------------|
| `title`    | Yes      | The skill's display name.                                    |
| `category` | Yes      | Pick an existing one for consistency (see below).            |
| `summary`  | Yes      | One sentence shown on the card.                              |
| `trigger`  | No       | "When to use" — one line.                                    |
| `inputs`   | No       | What the user must supply.                                   |
| `owner`    | No       | Your team or name — so people know who to ask.               |
| `updated`  | No       | Date you last touched it (YYYY-MM-DD).                       |
| `tags`     | No       | Comma-separated keywords; they feed search.                  |

Keep values on a single line. Don't remove the `---` fences.

## Current categories

Prospecting & Research · Outreach · Sales / Deals · RevOps · Marketing & Content · Pricing

Add a new category only when you have a skill that genuinely doesn't fit — just type it in
the `category` field and it will appear as a new filter.

## Writing a good skill

- The **The skill** code block is the payload — write it as instructions an AI agent can
  follow, with `{{placeholders}}` for the user's inputs.
- Tell the agent **not to invent facts**; GTM work needs accuracy.
- Keep it self-contained: someone should be able to copy it and use it without reading
  anything else.

## Editing or removing a skill

- **Edit:** open the file, click the pencil icon, change it, and **Propose changes** to open
  a pull request. Once it's reviewed and merged, the index rebuilds.
- **Remove:** delete the `.md` file the same way (via a pull request). After it's merged, the
  index rebuilds and the skill disappears from the site.

Every change goes through a quick review before it's live — nothing publishes to the site
until the pull request is approved.
