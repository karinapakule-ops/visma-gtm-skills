---
title: Deal Summary & Next-Step Updater
category: CRM Hygiene
summary: Reads a deal and writes a concise 3-sentence summary plus a recommended next step back to HubSpot after your confirmation.
trigger: Weekly on active deals, to keep pipeline records current.
inputs: A deal name, company name, or HubSpot deal ID.
connectors: HubSpot MCP
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: crm hygiene, deals, pipeline, next step, spiced, hubspot
---

Reads a live HubSpot deal record, generates a structured 3-sentence deal summary and a recommended next step, previews both for rep confirmation, then writes them to the Deal Description field and `hs_next_step` property.

**Connector:** HubSpot MCP (read + write)

---

## Step 1 — Identify the Deal

Extract from the rep's message:
- Deal name, company name, or HubSpot deal ID

If nothing is clearly identified, ask one question only:
> *"Which deal should I summarise? You can give me the deal name, company name, or HubSpot deal ID."*

Use `search_crm_objects` (object type: `deals`) to locate the record. If multiple matches are returned, show a short disambiguation list (deal name + stage + owner) and ask the rep to confirm which one.

---

## Step 2 — Pull Deal Context via HubSpot MCP

Retrieve the following from the deal record and associated objects. Note any missing fields explicitly — do not skip silently.

**Deal record:**
- Deal name, pipeline, current stage
- Deal value (amount)
- Expected close date + days until close
- Days in current stage
- Deal Description (current value, if any)
- `hs_next_step` (current value, if any)
- Deal owner

**Associated contact(s):**
- Name, job title, last activity date

**Associated company:**
- Company name, industry, employee count

**Recent activity (last 3 items):**
- Activity type (call, email, meeting, note), date, and a 1-line summary of content
- Use `get_crm_objects` or `search_crm_objects` on the associated activities/notes

---

## Step 3 — Determine Next Step Logic

Before generating, ask the rep how they want the next step derived — unless they've already specified in their prompt.

Present this as a single inline question:

> *"How should I derive the suggested next step?*
> **(A)** Based on deal stage + last activity — I'll recommend the typical next action for this stage given what's already happened.*
> **(B)** Based on deal stage + last activity + SPICED gap analysis — I'll also flag which SPICED elements are missing from the CRM notes and suggest actions to fill those gaps.*
>
> *Just reply A or B."*

If the rep's original prompt already implies a preference (e.g. "focus on gaps" → B, "quick update" → A), pre-select and proceed without asking.

**Logic A — Stage + Activity:**
- Map the current deal stage to the standard expected next action (e.g. Discovery → book demo, Demo Done → send proposal, Proposal Sent → follow up on decision criteria, Negotiation → confirm legal/procurement steps, etc.)
- Factor in recency: if last activity was 14+ days ago, the next step should prioritise re-engagement first

**Logic B — Stage + Activity + SPICED Gaps:**
- Apply Logic A
- Additionally scan the last 5 activity notes for evidence of each SPICED element: Situation, Pain, Impact, Critical Event, Decision
- Flag which elements have no evidence in the CRM
- Incorporate the highest-priority gap into the next step recommendation (e.g. "No Economic Buyer identified — next step: map decision-makers before proposal")

---

## Step 4 — Generate the Summary and Next Step

### Deal Summary (3 sentences, max 60 words total)

Write exactly three sentences:
1. **What the deal is** — company, deal value, stage, and how long it's been there
2. **Where things stand** — last meaningful interaction and what was discussed or agreed
3. **Key momentum signal** — either a positive signal (e.g. stakeholder engaged, demo completed) or a risk signal (e.g. no activity in X days, close date approaching with no proposal sent)

Rules:
- Use concrete data from the CRM — no vague filler ("things are progressing well")
- If a field is missing (e.g. no deal value, no recent notes), include a bracketed note: `[deal value not set]` — do not omit the sentence
- Do not repeat the deal name more than once
- Write in third person, past/present tense, declarative style — this is a CRM field, not a chat message

### Next Step (1 sentence, max 25 words)

Write one clear, actionable sentence:
- Starts with a verb (e.g. "Send", "Book", "Confirm", "Follow up on", "Identify")
- Specific enough to act on immediately — no generic "follow up" without context
- Includes a timeframe where relevant (e.g. "by end of week", "before close date on [date]")

---

## Step 5 — Preview and Confirm

Present the generated content in this format:

---

**📋 Deal Summary & Next Step — [Deal Name]**

**CRM data used:**
- Stage: [stage] | Value: [value] | Days in stage: [X] | Close date: [date]
- Last activity: [date] — [type] — [1-line summary]
- Next step logic: [A — Stage + Activity / B — Stage + Activity + SPICED Gaps]

---

**Deal Description (→ will write to Deal Description field):**

[3-sentence summary]

---

**Next Step (→ will write to `hs_next_step`):**

[1-sentence next step]

---

**⚠️ Data gaps (if any):**
- [List any fields that were empty and how they affected the output]

---

Then ask:

> *"Does this look right? Edit anything you'd like to change — or say **confirm** and I'll write both fields to HubSpot."*

Wait for explicit confirmation or edits before proceeding. If edits are requested, apply them, re-present the updated version, and ask again before writing.

---

## Step 6 — Write Back to HubSpot

Once the rep confirms, use `manage_crm_objects` to update the deal record:

| Field | Value |
|---|---|
| `description` | Approved 3-sentence deal summary |
| `hs_next_step` | Approved next step sentence |

After writing, confirm:
> *"Done — Deal Description and Next Step updated on [Deal Name]. [Link to deal if available]"*

---

## Edge Cases

| Situation | How to handle |
|---|---|
| Deal has an existing Description or Next Step already | Show current values in Step 5 preview alongside the new ones. Ask rep to confirm they want to **overwrite** — make this explicit. |
| Multiple deals match the company name | Show top 3 (deal name + stage + value + owner) and ask rep to pick |
| No recent activity logged on the deal | Flag it clearly: "No activity found in the last 30 days." Adjust summary sentence 2 to reflect this. Default next step logic to A and note the gap. |
| Deal value is blank | Include `[deal value not set]` in the summary. Flag as a data gap. |
| Close date is in the past | Flag in the preview: "⚠️ Close date [date] is overdue — you may want to update this field too." Do not block the write. |
| Rep says "just write it" without reviewing | Still show the preview — always confirm before writing to HubSpot. State this if pushed. |
| Rep uses Logic B but notes are very sparse | Perform SPICED gap analysis on what's available. If all elements are missing, surface this as a pattern: "No SPICED context logged for this deal — the next step should focus on discovery." |

---

## Output Quality Rules

- Never fabricate CRM data. If a field is empty, say so — do not invent values or assume.
- Flag sandbox data quirks if something looks off (e.g. deal value = 0, close date = past, no contacts associated).
- Keep the summary tight and factual. A precise 3-sentence summary is more valuable than a padded paragraph.
- The next step must be immediately actionable. If you can't make it specific with the available data, explain why and ask the rep to provide the missing context.
- Always write in consistent, professional CRM language — these fields will be read by managers in pipeline reviews.
