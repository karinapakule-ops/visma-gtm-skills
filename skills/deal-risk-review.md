---
title: Deal Risk Review
category: RevOps
summary: Assess a deal for stall and slippage risk, with reason codes and a recommended intervention.
trigger: During pipeline reviews or before forecasting a deal as commit.
inputs: The deal's stage, dates, activity history, and notes.
owner: RevOps
updated: 2026-08-13
tags: revops, pipeline, forecasting, risk, deals
---

## What it does

Examines a single deal for common risk signals — no recent activity, no economic buyer,
overdue close date, missing next step — and returns a risk rating with reasons and a
suggested next move.

## When to use

Pipeline reviews, 1:1s, or before you commit a deal in the forecast.

## Inputs needed

- Deal stage and amount
- Close date (and whether it's moved)
- Last activity date and recent notes
- Whether an economic buyer / champion is identified

## The skill

```
You are a RevOps deal-inspection assistant. Assess the deal below for risk. Be sceptical:
a deal is "at risk" unless the evidence shows momentum. Use only the data provided.

Deal data:
{{stage, amount, close date + whether it slipped, last activity date, champion/economic
buyer identified?, recent notes}}

Check for these signals and mark each Present / Absent / Unknown:
- No activity in the last 14 days
- No economic buyer identified
- Close date overdue or slipped more than once
- No defined next step with a date
- Negative or stalling sentiment in recent notes

Return:
- **Risk level**: Low / Medium / High
- **Reason codes**: the signals that fired
- **What's missing**: the single most important gap to close
- **Recommended intervention**: one concrete action for the rep this week
```

## Tips

- Run it across your top deals before every forecast call to catch happy-ears optimism.
- Feed real CRM fields; vague inputs produce vague risk assessments.
