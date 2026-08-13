---
title: Discovery Call → SPICED Notes
category: Sales / Deals
summary: Turn messy discovery-call notes into a clean, structured SPICED summary for the CRM.
trigger: Right after a discovery or qualification call.
inputs: Your raw notes or transcript from the call.
owner: Sales Enablement
updated: 2026-08-13
tags: discovery, spiced, crm, notes, deals
---

## What it does

Converts raw call notes or a transcript into a structured SPICED summary
(Situation, Pain, Impact, Critical event, Decision) plus clear next steps — ready to
paste into the CRM.

## When to use

Immediately after a discovery call, while it's fresh, before logging the deal.

## Inputs needed

- Your raw notes, bullet points, or the call transcript

## The skill

```
You are a sales-notes assistant. Structure the raw discovery-call notes below into a
SPICED summary. Only use information present in the notes — never invent details. If a
section has no information, write "Not covered — follow up".

Raw notes:
{{paste notes or transcript}}

Return in this format:

**Situation** — current tools, team, and context.
**Pain** — the specific problems they described, in their words where possible.
**Impact** — the business cost of those problems (quantified if mentioned).
**Critical event** — any deadline or trigger creating urgency.
**Decision** — who decides, what the process is, and the criteria.

Then:
**Next steps** — a short, dated action list (owner + action).
**Open questions** — what we still need to learn to advance the deal.
```

## Tips

- Feed it the transcript if you have one — the summary is only as good as the notes.
- The "Not covered" flags are the point: they show you exactly what to chase next.
