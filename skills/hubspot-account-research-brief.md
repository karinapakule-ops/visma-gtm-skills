---
title: Account Research Brief
category: Prospecting
summary: Builds a structured pre-call account brief by combining live HubSpot CRM data with web-search enrichment — never CRM alone.
trigger: Before a first call, a qualification meeting, or reviving a stale account.
inputs: A company name, HubSpot company ID, or contact name.
connectors: HubSpot MCP · Web search
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
package: packages/hubspot-account-research-brief.skill
tags: research, prospecting, account planning, discovery, hubspot, spiced
---

Generates a pre-call / pre-meeting account brief by combining live HubSpot CRM data with web search enrichment. Always runs both — do not skip web search even if CRM data looks complete.

## Step 1 — Identify the target

Extract the target from the user's prompt. It will be one of:
- A **company name** (e.g. "Research Acme AS")
- A **HubSpot company ID** (e.g. "Build a brief for company ID 12345")
- A **contact name** (resolve to their associated company)

If none of these is clear, ask: *"Which company or contact should I build the brief for?"* — one question only.

---

## Step 2 — Pull CRM data via HubSpot MCP

Use the HubSpot MCP connector to retrieve the following. Fetch all that are available — note any gaps explicitly rather than skipping them silently.

**Company record:**
- Company name, domain, industry, employee count, country/region
- HubSpot owner (assigned rep/CSM)
- Lifecycle stage
- Any custom properties: ICP tier, segment, MRR, ARR, product SKU, health score, churn risk

**Associated deals:**
- All open deals: name, stage, deal value, close date, days in current stage
- Last 2 closed deals (Won or Lost): outcome, deal value, close date

**Associated contacts:**
- All contacts linked to the company: name, job title, email, last activity date
- Note any buying role properties if populated (Champion, Economic Buyer, etc.)

**Recent activity (last 90 days):**
- Last 3 notes/call logs: summary of content
- Last email subject line and date
- Last meeting date and outcome if logged

---

## Step 3 — Web search enrichment

Run web searches to fill gaps and add external context. Always run at minimum:

1. `[Company name] company overview` — what they do, industry, size, recent news
2. `[Company name] recent news OR press release` — funding, product launches, leadership changes, layoffs, expansions
3. `[Company name] [industry] recent challenges` — to surface relevant pain points

Use additional searches if the CRM data raises specific questions (e.g. competitor named in a note → search that competitor, or if domain suggests a niche market).

Synthesise findings — do not dump raw search snippets. Extract what is relevant to the sales context.

---

## Step 4 — Build the brief

Output the brief in this exact structure. Use clear headers. Keep each section tight — this is a pre-call card, not a research essay.

---

### 🏢 Company Snapshot
| Field | Value |
|---|---|
| Company | |
| Industry | |
| Size | |
| Location | |
| Website | |
| HubSpot Owner | |
| Lifecycle Stage | |
| ICP Tier | *(if available)* |
| MRR / ARR | *(if available)* |

---

### 📋 What We Know (CRM Summary)
- **Relationship history**: When did we first engage? How long have they been in the CRM?
- **Deal status**: Active deals (stage, value, days in stage). Recent outcomes (Won/Lost + reason if logged).
- **Key contacts**: List name + title for each contact. Flag any gaps (e.g. "No Economic Buyer identified").
- **Last touchpoint**: Date, type (call/email/meeting), and what was discussed or agreed.
- **Data gaps**: Explicitly list any key fields missing (close date, deal value, owner, etc.)

---

### 🌐 External Context (Web Enrichment)
- **What they do**: 2–3 sentence summary of their business model and market position.
- **Recent developments**: Any news from the last 6 months relevant to a sales conversation (funding, growth, leadership, challenges).
- **Industry headwinds / tailwinds**: What's happening in their sector that creates urgency or risk for them?

---

### 🎯 SPICED Mapping
Map what is known from CRM + web enrichment to the SPICED framework. For any element where data is insufficient, flag it as a **discovery gap** — a question the rep should ask on the call.

| SPICED Element | What We Know | Discovery Gap / Question |
|---|---|---|
| **Situation** | Company context, size, industry, current product/deal status | *(e.g. "Confirm current tech stack and team structure")* |
| **Pain** | Pain points inferred from deal notes, lost deal reasons, or industry context | *(e.g. "What is their biggest operational bottleneck right now?")* |
| **Impact** | Business impact of the pain — quantified if possible | *(e.g. "What does this cost them in time or revenue?")* |
| **Critical Event** | Any known deadline, trigger event, or forcing function | *(e.g. "Is there a renewal, contract end, or leadership change driving urgency?")* |
| **Decision** | Known decision-making process, stakeholders, budget signals | *(e.g. "Who signs off on this? What's their typical buying process?")* |

---

### ✉️ Suggested Opener
A 2–3 sentence suggested opening for outreach or call intro, personalised to:
- Their current situation (CRM + web context)
- A relevant pain or recent trigger event
- The rep's existing relationship with the account (warm re-engage vs cold)

---

## Step 5 — Offer write-back

After presenting the brief, always ask:

> *"Should I log a summary of this brief as a note on the HubSpot company record? If yes, I'll write a concise version to the activity feed."*

If confirmed, log a note to the HubSpot company record via MCP with:
- Date and trigger ("Pre-call research brief — [date]")
- 3–5 bullet summary of key findings
- Top 2 discovery gaps from the SPICED table
- Do NOT log the full brief — keep the note scannable

---

## Output quality rules

- Never fabricate CRM data. If a field is missing, say so.
- Never reproduce raw web search text — synthesise.
- Flag sandbox data quirks if results look inconsistent (e.g. missing owner, zero activity, lifecycle stage mismatch).
- If the company doesn't exist in HubSpot, say so clearly and offer to run web-only enrichment instead.
- Keep the full brief under 600 words (excluding the SPICED table and snapshot).
