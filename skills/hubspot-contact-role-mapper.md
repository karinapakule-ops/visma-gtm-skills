---
title: Contact Role Mapper
category: Prospecting
summary: Maps every contact at an account to buying-committee roles (Champion, Economic Buyer, Technical Evaluator, Blocker, User) and flags coverage gaps.
trigger: On multi-stakeholder deals (3+ contacts), before a deal review or proposal.
inputs: A company name/ID or a deal name/ID.
connectors: HubSpot MCP
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
package: packages/hubspot-contact-role-mapper.skill
tags: buying committee, stakeholders, spiced, deals, coverage, hubspot
---

Maps contacts at a target account to SPICED-aligned buying committee roles. Surfaces coverage gaps and suggests candidates for uncovered roles. Writes role assignments back to HubSpot contact properties when confirmed.

---

## Step 1 — Identify the target

Extract the target from the user's prompt. It will be one of:
- A **company name** (e.g. "Map the buying committee for Acme")
- A **HubSpot company ID**
- A **deal name or ID** (e.g. "Map contacts for deal 'Acme Expansion Q3'")

If a deal is referenced, resolve it to its associated company and pull contacts from both the deal and the company record.

If neither is clear, ask: *"Which company or deal should I map the buying committee for?"* — one question only.

---

## Step 2 — Pull all contacts and signal data via HubSpot MCP

Retrieve the following. Do not skip any signal source — use all available data for role inference.

**From the Company record:**
- All associated contacts: name, job title, seniority, department
- Any existing "Buying Role" or equivalent property already populated
- Company industry and size (provides title-normalisation context)

**From the Deal record (if applicable):**
- All contacts associated with the deal
- Deal stage, deal name, close date, last activity date

**For each contact, retrieve:**
- Job title and any seniority/department fields
- Last 5 activities: call logs, meeting notes, email subjects and snippets
- Notes content — scan for signals like "budget approval", "technical requirements", "champion", "signed off", "legal review", "concerns", "blockers"
- Email engagement: open/click history if available; subject lines of sent/received emails
- Last activity date and activity frequency (high vs low engagement)

Flag any contacts where activity data is missing or sparse — treat them as low-confidence mappings.

---

## Step 3 — Map each contact to a buying role

Use the following role definitions. Assign **one primary role** per contact. A contact may have a secondary role noted if signals overlap.

| Role | Definition | Title signals | Behavioural signals |
|---|---|---|---|
| **Champion** | Internal advocate who wants the solution to succeed and will sell on your behalf | Manager/Director-level in the operational team, not C-suite | High email engagement, positive meeting notes, repeat touchpoints, references internal stakeholders |
| **Economic Buyer** | Controls or approves the budget. Final financial decision-maker | CFO, CEO, VP Finance, COO, Head of Operations, Owner | Referenced in notes re: budget/sign-off, copied on proposals, low meeting frequency but high-stakes touchpoints |
| **Technical Evaluator** | Evaluates the technical fit, integration, or security/compliance requirements | CTO, IT Director, Systems Manager, Head of IT, Security Lead, Architect | Activity around technical docs, data/security questions, integration discussions in notes |
| **Blocker** | Raises objections, slows the process, or has competing interests | Legal, Procurement, IT Security, or any role with notes indicating concerns, pushback, or competing vendor preference | Objections in notes, silence after a proposal, delays, legal/procurement involvement |
| **User** | Will use the product day-to-day; care about usability and workflow fit | Analyst, Coordinator, Specialist, Team Lead in the operational function | Product questions, demo requests, feature-level discussion in notes |

**Inference rules:**
1. **Title first** — use job title as the primary signal for initial classification
2. **Activity override** — if behavioural signals strongly contradict the title (e.g. an "IT Manager" who is clearly driving budget decisions), let activity win and note the override
3. **Confidence scoring** — assign each mapping a confidence level:
   - `High` — title + multiple activity signals align
   - `Medium` — title matches but limited activity data
   - `Low` — inferred from activity only, or sparse data overall

---

## Step 4 — Identify coverage gaps and suggest candidates

After mapping all contacts, check which roles have **no assigned contact**:

For each **unmapped role**:
1. Flag it explicitly as a gap
2. Scan the existing contact list for the best candidate — even if imperfect
3. State who the candidate is, why they might fill the role (title proximity, behavioural signals), and what the rep should do to confirm or develop this relationship
4. If no plausible candidate exists in the CRM, recommend who the rep should seek out (by title/function) at that account

---

## Step 5 — Output the Role Map

Present the output in this exact structure:

---

### 🏢 [Company Name] — Buying Committee Map
*Deal: [Deal Name] · Stage: [Stage] · Last activity: [Date]*
*(or: Company-level map — no specific deal scoped)*

---

### 👥 Contact Role Assignments

| Contact | Title | Role | Confidence | Key Signals |
|---|---|---|---|---|
| [Name] | [Title] | Champion | High | "Proactively shared internal deck in meeting notes (14 Apr), 8 email opens in last 30 days, references 'our team needs this'" |
| [Name] | [Title] | Economic Buyer | Medium | CFO title; only 1 touchpoint logged — no direct budget discussion on record |
| [Name] | [Title] | Technical Evaluator | High | IT Director; meeting notes reference integration requirements and data residency questions |
| [Name] | [Title] | User | Medium | Operations Coordinator; attended product demo, feature questions in email thread |
| *(add rows as needed)* | | | | |

---

### ⚠️ Coverage Gaps

For each unmapped role, output a block like this:

**Missing: Blocker**
> No contact mapped to this role. No procurement, legal, or risk-function contact is currently in HubSpot for this account.
> **Suggested candidate:** [Name] (IT Director) — while mapped as Technical Evaluator, IT Directors often also play a gatekeeping/security-veto role. Worth probing in the next call whether legal or procurement are involved in sign-off.
> **If no candidate:** Ask your Champion — *"Who else needs to be comfortable with this decision before it moves forward?"*

*(Repeat for each uncovered role)*

---

### 📊 Coverage Summary

| Role | Covered? | Contact | Confidence |
|---|---|---|---|
| Champion | ✅ | [Name] | High |
| Economic Buyer | ⚠️ | [Name] — inferred | Medium |
| Technical Evaluator | ✅ | [Name] | High |
| Blocker | ❌ | Not identified | — |
| User | ✅ | [Name] | Medium |

**Overall coverage: X/5 roles mapped · Y gaps to address**

---

### 🎯 Rep Actions

Based on the gap analysis, list 2–4 concrete next steps:

1. **Confirm Economic Buyer** — [Name] is a likely candidate but no budget conversation is logged. Ask your Champion: *"Who ultimately approves the spend on a decision like this?"*
2. **Identify Blocker risk** — No procurement or legal contact on file. Add as a qualification question before moving to proposal stage.
3. *(etc.)*

---

## Step 6 — Offer write-back

After presenting the map, always ask:

> *"Should I write these role assignments back to the HubSpot contact records? I'll update the Buying Role property for each contact with High or Medium confidence mappings. Low-confidence ones I'll skip unless you confirm."*

If confirmed:
- Write the assigned role to each contact's **Buying Role** property (or closest equivalent) via HubSpot MCP
- Log a single summary note on the **Company** (or **Deal**) record:
  - Title: `Buying committee mapped — [date]`
  - Content: coverage summary table + gap list (concise version, no full signal rationale)
- Confirm each write in the conversation: *"✅ Updated [Name] → [Role]"*

If the property doesn't exist, flag it: *"No 'Buying Role' property found on contact records. You may want to create one in HubSpot before I write back — or I can log the full map as a deal/company note instead."*

---

## Output quality rules

- Never fabricate contact data or invent signals not present in HubSpot
- If activity data is sparse for a contact, say so explicitly — do not inflate confidence
- If a company has only 1–2 contacts, flag that the map is incomplete by definition and prompt the rep to expand contact coverage
- Flag sandbox data quirks if mappings look off (e.g. all contacts have identical titles, zero activity on all records, duplicate contacts)
- If the company or deal doesn't exist in HubSpot, say so and stop — do not guess
- Keep Key Signals column factual and evidence-based — quote from notes/email subjects where possible, do not paraphrase vaguely
