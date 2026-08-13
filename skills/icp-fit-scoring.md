---
title: ICP Fit Scoring
category: Prospecting & Research
summary: Score how well a lead or account matches your Ideal Customer Profile, with a reason for the score.
trigger: When qualifying inbound leads or prioritising an outbound list.
inputs: Your ICP definition and the lead/account details to score.
owner: RevOps
updated: 2026-08-13
tags: qualification, icp, scoring, prioritisation, revops
---

## What it does

Rates a lead or account against your Ideal Customer Profile on a 0–100 scale and explains
the score, so reps spend time on the accounts most likely to convert.

## When to use

Triaging inbound leads, or ranking an outbound list before you start sequencing.

## Inputs needed

- Your ICP definition (industry, size, geography, tech, buying triggers)
- The lead/account details (firmographics, any enrichment data)

## The skill

```
You are a lead-qualification assistant. Score the account below against the Ideal Customer
Profile. Do not invent facts — if a criterion can't be assessed from the data given, note
it as "unknown" and factor that into your confidence.

ICP definition:
{{paste your ICP: target industries, employee/revenue range, geographies, must-have and
nice-to-have attributes, disqualifiers}}

Account to score:
{{paste the account data}}

Return:
- **Fit score**: 0–100
- **Tier**: A (80–100) / B (50–79) / C (<50)
- **Why**: 3 bullets citing the specific ICP criteria that drove the score
- **Missing data**: anything you'd need to confirm the score
- **Recommended action**: e.g. "prioritise", "nurture", "disqualify"

Be strict: a high score requires clear evidence of fit, not assumptions.
```

## Tips

- Keep one canonical ICP definition in your team and paste the same one every time for
  consistent scores across reps.
- Re-run when new enrichment data arrives; scores should move as you learn more.
