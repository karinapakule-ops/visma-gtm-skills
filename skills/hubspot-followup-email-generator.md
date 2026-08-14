---
title: Follow-up Email Generator
category: Outreach
summary: Drafts a personalised, SPICED-informed follow-up email from live CRM context and saves it as a sendable Gmail draft.
trigger: After a meeting, call, or touchpoint with a contact or deal.
inputs: A contact name, deal, or company that has recent CRM activity.
connectors: HubSpot MCP · Gmail MCP
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: outreach, follow-up, email, gmail, spiced, hubspot
---

Generates a personalised, SPICED-informed follow-up email by reading live HubSpot CRM context. Always pull CRM data first — never draft from assumptions alone.

---

## Step 1 — Identify the target

Extract from the user's prompt:
- **Contact name** — the person to email (resolve to their HubSpot contact record)
- **Deal name or ID** — if mentioned (resolve to deal record)
- **Company name** — if mentioned (resolve to associated company)

If none of these is clear, ask one question only:
> *"Which contact or deal should I draft the follow-up for?"*

---

## Step 2 — Pull CRM context via HubSpot MCP

Use the HubSpot MCP connector to retrieve the following. Note any gaps explicitly — do not skip silently.

**Contact record:**
- Full name, job title, seniority level (infer from title if not explicit: C-suite / VP / Director / Manager / Individual)
- Email address
- Last activity date and type
- Any notes or call log from the most recent interaction

**Associated deal (if linked):**
- Deal name, current stage, deal value, expected close date
- Days in current stage
- Deal description and next step fields (if populated)
- Last 2 activity notes on the deal

**Associated company:**
- Company name, industry, size

**Email thread (if available):**
- Subject line and date of last email sent or received

---

## Step 3 — Determine follow-up context

Before drafting, resolve the following from the CRM data:

| Question | Source |
|---|---|
| What was the last interaction? | Most recent note, call log, or meeting on contact or deal |
| What was agreed or discussed? | Note content, deal description, next step field |
| What stage is the deal at? | Deal stage — shapes the email's objective |
| What is the contact's seniority? | Job title — shapes tone and level of detail |
| Is there a known pain or critical event? | SPICED elements from notes if logged |
| Is there a next step already defined? | Next step field on deal |

If the last interaction is not logged in HubSpot (no notes, no call, no email), state this clearly and ask the rep to paste their raw notes before proceeding. Do not fabricate context.

---

## Step 4 — Draft the follow-up email

Apply the following rules when drafting:

### Tone
- Default: **formal and professional**
- Adjust formality slightly based on seniority:
  - C-suite / VP: crisp, high-level, outcome-focused — no fluff
  - Director / Manager: balanced — concrete but conversational
  - Individual contributor: slightly warmer, more detail-oriented
- Never sycophantic openers ("Hope this finds you well", "Great speaking with you today" as the only opener)

### Structure
Every follow-up must include all four of these elements — keep it concise:

1. **Context anchor** — one sentence referencing what was discussed (from CRM notes). Specific, not generic.
2. **Value / pain recap** — one sentence summarising the key pain or opportunity surfaced (SPICED: Pain or Impact). If not in CRM, surface the deal-stage-appropriate assumption and flag it.
3. **Clear next step** — one concrete action with a soft deadline or question. Pull from the deal's Next Step field if populated; otherwise propose one appropriate to the stage.
4. **Low-friction close** — a single easy ask or confirmation that moves the deal forward.

### Subject line
- Specific and contextual — never generic ("Following up", "Checking in")
- Format: reference the company/topic + the forward motion (e.g. "Next steps: [Topic] — [Company]" or "[Company] — [specific outcome discussed]")

### Length
- Maximum 150 words in the body. Brevity signals respect for the contact's time.
- If the deal stage requires more detail (e.g. Proposal, Contract), allow up to 200 words but flag that it's on the longer side.

### What to avoid
- Do not invent facts, names, or specifics not present in the CRM
- Do not use placeholder language like "[insert pain here]" — flag the gap instead
- Do not add generic filler sentences to pad length
- Do not assume a meeting happened if no meeting note is logged

---

## Step 5 — Present the draft in chat

Output the email in this format:

---

**✉️ Follow-up Email Draft**

**To:** [Contact name] — [Job title] at [Company]
**Subject:** [Subject line]

---

[Email body]

---

**📋 CRM context used:**
- Last interaction: [date + type + 1-line summary]
- Deal stage: [stage name]
- Next step source: [pulled from CRM / proposed by skill]

**⚠️ Data gaps (if any):**
- [List any fields that were missing and how they affected the draft]

---

Then ask the rep:
> *"How does this look? Let me know if you'd like to adjust the tone, angle, or next step — or if I've missed context from your actual conversation."*

Wait for confirmation or edits before proceeding to Step 6.

---

## Step 6 — Save to Gmail draft (on approval)

Once the rep approves the draft (or after edits are agreed), ask:

> *"Should I save this as a Gmail draft so you can review and send from your inbox?"*

If confirmed:
- Use the Gmail MCP connector to create a draft with:
  - **To:** contact's email address (from HubSpot)
  - **Subject:** the approved subject line
  - **Body:** the approved email text
- Confirm back: *"Draft saved to Gmail. You can review and send it from your inbox."*

If declined:
- Confirm the final text is visible in chat for the rep to copy manually.

Do **not** attempt to send the email directly — draft only.

---

## Step 7 — Offer HubSpot activity log

After the Gmail step (or if Gmail is declined), ask:

> *"Should I log this follow-up as an activity note on the HubSpot deal or contact record?"*

If confirmed:
- Log a brief note via HubSpot MCP:
  - Note type: Email / Follow-up
  - Content: "Follow-up email drafted and sent to [Contact] on [date]. Subject: [subject]. Key next step: [next step]."
  - Associate with: the deal record (preferred) or contact record if no deal exists

---

## Output quality rules

- Never fabricate CRM data. If a field is missing, say so and explain how it affected the draft.
- Flag sandbox data quirks if results look inconsistent (e.g. no activity logged, deal value missing, contact with no email).
- If the contact has no email address in HubSpot, flag it before drafting and ask the rep to provide one.
- If no recent interaction is logged in HubSpot, state this and ask the rep to provide raw notes rather than guessing at context.
- Keep the email tight. A weak, padded follow-up is worse than a short, specific one.
- This skill is rep-agnostic — do not apply any individual rep voice overlay unless explicitly instructed.

---

## Connector used
**HubSpot MCP** — for contact, deal, company, and activity reads; activity note write-back.
**Gmail MCP** — for saving approved email as a draft (optional, on rep confirmation).
