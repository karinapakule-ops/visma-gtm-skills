---
title: Company Context (Template)
category: Foundations
summary: Foundational reference holding your company's product, ICP, buyer personas, value proposition, and SPICED alignment — fill it in once per company so every skill sounds like it understands the business.
trigger: Loaded automatically before any content-generating skill (emails, briefs, prep, notes).
inputs: None — a reference skill you customise once per company.
connectors: None (reference only)
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
package: packages/company-context.skill
tags: foundation, company context, icp, personas, value prop, spiced
---

This skill holds the foundational commercial context for the company deploying these HubSpot skills. It exists so Claude does not have to infer who the company is, what it sells, or who it sells to — that context is encoded here and loaded on demand.

> **This is a TEMPLATE.** Every Visma company that deploys these skills should replace the placeholder values below with their own before running any sales-facing skill. The structure is intentional — do not remove sections, only replace the `[bracketed]` values.

---

## How to Use This Skill

This is a **reference skill**, not an action skill. Claude loads it when generating content that needs to reflect the company's positioning — emails, briefs, prep cards, notes, and outreach. It does not trigger any HubSpot reads or writes on its own.

When loaded, Claude should use this context to:
- Frame pain points in the language the company uses with prospects
- Reference the right product names and capabilities (not generic descriptions)
- Pitch value in terms of the business outcomes the company sells toward
- Apply the correct ICP filter when evaluating whether a contact or company is a fit
- Use the right buyer persona framing when structuring SPICED notes or prep questions

---

## Company Overview

**Company name:** [Your company name]
**What the company does:** [1–2 sentence description of what you sell and the problem it solves.]

**Core product(s):**
- **[Product name]** — [what it is and who it's for.]
- Key capabilities: [list the capabilities that matter in a sales conversation.]

**Stage / GTM motion:** [e.g. B2B SaaS, mid-market; direct sales + partner channel; primary market and expansion.]

---

## Ideal Customer Profile (ICP)

Use this to score accounts, frame discovery questions, and prioritise pipeline.

| Dimension | Target |
|---|---|
| **Company size** | [e.g. 100–2,000 employees (primary); enterprise 2,000+ (secondary)] |
| **Industries** | [your target verticals] |
| **Geography** | [your primary and secondary markets] |
| **Trigger signals** | [events that signal a good time to sell — e.g. upcoming audit, new CFO, M&A, tool sprawl, regulation] |
| **Disqualifiers** | [what makes an account a poor fit] |

---

## Buyer Personas

### Primary buyer — [title]
- Cares about: [priorities]
- Pain: [the problem they feel]
- Buys for: [the outcome they want]
- Language to use: [phrases that resonate]

### Secondary buyer — [title]
- Cares about: [priorities]
- Pain: [the problem they feel]
- Buys for: [the outcome they want]
- Language to use: [phrases that resonate]

### Champion (typically) — [title]
- Cares about: [priorities]
- Pain: [the problem they feel]
- Buys for: [the outcome they want]
- Language to use: [phrases that resonate]

### Economic Buyer — [title] (final sign-off)
- Focuses on: [ROI / risk / cost framing]
- Key objection: [the objection you hear most]
- Counter: [your best response]

---

## Value Proposition

**One-line:** [Your one-sentence value proposition.]

**Core outcomes we sell:**
1. **[Outcome]** — [proof or detail]
2. **[Outcome]** — [proof or detail]
3. **[Outcome]** — [proof or detail]

**Common objections and responses:**

| Objection | Response framing |
|---|---|
| "[Common objection 1]" | "[How you reframe it]" |
| "[Common objection 2]" | "[How you reframe it]" |
| "[Common objection 3]" | "[How you reframe it]" |

---

## SPICED Framework Alignment

When structuring discovery notes or prep questions, map to SPICED using this company-specific lens:

| SPICED element | What to probe for at your accounts |
|---|---|
| **Situation** | [what to establish about their current state] |
| **Pain** | [the pains you solve — what to listen for] |
| **Impact** | [how to quantify the cost of the pain] |
| **Critical Event** | [deadlines or triggers that create urgency] |
| **Decision** | [how buying decisions get made in your market] |

---

## Customisation Notes

Replace the sections above with your own company's content. The structure is intentional — do not remove sections, only replace the values.

Minimum required to customise before deploying any sales skill:
- [ ] Company Overview — your product name, what it does, GTM motion
- [ ] ICP — your target firmographics and trigger signals
- [ ] Buyer Personas — primary buyer, champion, economic buyer
- [ ] Value Proposition — your one-liner and core outcomes
- [ ] SPICED alignment — what to probe for in your sales motion

Optional but high-value:
- [ ] Add competitor positioning (what you displace and why)
- [ ] Add reference customers or proof points by industry vertical
- [ ] Add local language tone notes if selling in a non-English market
