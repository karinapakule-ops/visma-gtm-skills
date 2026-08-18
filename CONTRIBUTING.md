# Contributing a skill

Adding a skill is **one Markdown file**. No coding required — you can do it entirely in
the GitHub website. **Anyone with a GitHub account can contribute** — you don't need to be
given any special access.

## Add a skill (in the browser)

1. Go to the `skills/` folder in this repository.
2. Open the [`_template.md`](skills/_template.md) file there and copy its contents.
3. Back in `skills/`, click **Add file → Create new file**.
4. Name it with lowercase words and hyphens, ending in `.md` — e.g.
   `competitor-battlecard.md`. **This filename becomes the skill's web address**, so keep
   it short and stable.
5. Paste in the template and fill it in.
6. Click **Commit changes**, then **Propose changes**.

### What you'll see when you propose

- **If you don't have write access** (most people), GitHub shows a banner saying it will
  **create a fork** — your own copy of the repo — to hold your change. That's normal and
  expected; just click through it. Your edit lands in your fork and opens a **pull request**
  back to this project.
- **If you're a collaborator**, GitHub instead offers to **create a new branch** in this repo.
  Choose that — it opens a pull request too, just without the fork step.

Either way, your change now waits as a **pull request** for review. Once it's approved and
merged, the site rebuilds automatically and your skill appears within a minute or two.

> **Heads-up for first-time contributors:** the very first time you open a pull request, a
> maintainer has to click **Approve** before the automated checks run. This is a one-time
> spam guard — nothing is wrong with your change.

You can only add or edit files inside `skills/` — that's by design, so a stray edit can't
break the site. A check called **`only-skills`** will fail your pull request if it touches
anything else, **or if a new or edited skill has no real `owner`** (blank, or left as the
template's `Your team or name` placeholder).

## The front matter (the block at the top between `---` lines)

| Field      | Required | Notes                                                        |
|------------|----------|--------------------------------------------------------------|
| `title`    | Yes      | The skill's display name.                                    |
| `category` | Yes      | Pick an existing one for consistency (see below).            |
| `summary`  | Yes      | One sentence shown on the card.                              |
| `trigger`  | No       | "When to use" — one line.                                    |
| `inputs`   | No       | What the user must supply.                                   |
| `owner`    | **Yes**  | Your team or name — so people know who to ask. Enforced on PRs. |
| `updated`  | No       | Date you last touched it (YYYY-MM-DD).                       |
| `tags`     | No       | Comma-separated keywords; they feed search.                  |

Keep values on a single line. Don't remove the `---` fences.

## Current categories

Prospecting · Outreach · Meeting Prep · CRM Hygiene · Productivity · Foundations

A skill can sit in **more than one** category — separate them with commas
(e.g. `category: Prospecting, HubSpot`). Add **`HubSpot`** as a second category on any skill
that uses the HubSpot connector.

Add a new category only when you have a skill that genuinely doesn't fit — just type it in
the `category` field and it will appear as a new filter.

## Writing a good skill

- The code block under **The skill** is the payload — write it as instructions an AI agent
  can follow, with `{{placeholders}}` for the user's inputs.
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
