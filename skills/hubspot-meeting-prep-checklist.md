---
title: Meeting Prep Checklist
category: Meeting Prep
summary: Builds a SPICED-aligned meeting prep card from Google Calendar + HubSpot, with three targeted discovery questions.
trigger: The morning before a meeting day, or 15 minutes before a call.
inputs: A company/contact/deal, or an upcoming calendar event.
connectors: HubSpot MCP · Google Calendar MCP
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: meeting prep, discovery, spiced, calendar, hubspot
---

Generates a structured, SPICED-aligned meeting prep card by combining Google Calendar event data with live HubSpot CRM context. Delivers the card in-chat and saves a summary note to the HubSpot record.

---

## Step 1 — Identify the meeting

### Try calendar first
Use the Google Calendar MCP to find the upcoming meeting:
- Search for meetings in the next 7 days matching the company or contact name from the rep's prompt
- If the prompt includes a time reference ("at 2pm", "tomorrow", "this afternoon"), filter by that window
- Extract from the calendar event: meeting title, date/time, attendee names and emails

**If a calendar event is found** → confirm with the rep:
> *"Found: [Meeting Title] on [Date] at [Time] with [Attendees]. Shall I prep for this one?"*

**If no calendar event is found** → fall back to manual:
> *"I couldn't find a matching calendar event. Which company or contact should I prep for?"*

Accept: company name, contact name, HubSpot deal name, or HubSpot company/contact ID.

---

## Step 2 — Pull CRM data via HubSpot MCP

Resolve the target to a HubSpot company record. Then retrieve all of the following. Note any gaps explicitly — do not skip silently.

### Company record
- Company name, industry, employee count, country
- HubSpot owner (assigned rep)
- Lifecycle stage, ICP tier (if available), MRR/ARR (if available)

### Contacts attending
- Cross-reference calendar attendee emails against HubSpot contacts
- For each matched contact: name, job title, lifecycle stage, last activity date
- Note any attendees not found in HubSpot
- Flag any buying role properties if populated (Champion, Economic Buyer, Technical Evaluator, etc.)

### Open deal context
- All open deals linked to the company: name, stage, deal value, close date, days in current stage
- Last 2 closed deals (Won or Lost): outcome, value, close date, loss reason if logged

### Recent activity (last 90 days)
- Last 3 notes or call logs: brief summary of what was discussed or agreed
- Last email: subject line and date
- Last meeting: date and outcome if logged

---

## Step 3 — Build the prep card

Output in this exact structure. Keep it scannable — this is a pre-meeting card, not a research report.

---

### 📅 Meeting Details
| Field | Value |
|---|---|
| Meeting | |
| Date & Time | |
| Attending (External) | |
| Attending (Internal) | |

---

### 🏢 Account Snapshot
| Field | Value |
|---|---|
| Company | |
| Industry | |
| Size | |
| Lifecycle Stage | |
| ICP Tier | *(if available)* |
| MRR / ARR | *(if available)* |
| HubSpot Owner | |

---

### 👥 Who's in the Room
For each external attendee:
- **Name** — Job Title
  - Buying role: *(Champion / Economic Buyer / Technical Evaluator / Unknown)*
  - Last interaction: *(date + type)*
  - Notable CRM signal: *(e.g. "Replied positively to last email", "No activity in 45 days", "Flagged as blocker in notes")*

Flag if any attendee has **no HubSpot record** — this is a data gap to address post-meeting.

---

### 📋 Deal & Relationship Context
- **Open deal**: Stage, value, days in stage, close date. Flag if overdue or stalling.
- **Last 3 touchpoints**: Date, type, and one-line summary of outcome or discussion topic.
- **Key open items**: Anything unresolved from prior interactions (commitments made, questions left open, next steps that were agreed but not yet actioned).
- **Data gaps**: Missing fields that matter for this deal (e.g. no close date, no deal value, no Economic Buyer identified).

---

### 🎯 SPICED Prep

Map what is known from CRM data to SPICED. For each element where data is thin or missing, produce a **suggested discovery question** the rep should ask in the meeting.

| SPICED Element | What We Know | Suggested Discovery Question |
|---|---|---|
| **Situation** | Company context, deal stage, current product/relationship status | *(e.g. "Can you walk me through how your team is currently handling X?")* |
| **Pain** | Pain signals from deal notes, lost deal history, or activity content | *(e.g. "What's the biggest friction point your team is experiencing with X right now?")* |
| **Impact** | Business impact of the pain — quantified if CRM notes allow | *(e.g. "What does this cost you in time, revenue, or headcount if it stays unsolved?")* |
| **Critical Event** | Known deadlines, renewal dates, trigger events, or forcing functions | *(e.g. "Is there a specific deadline or internal event driving urgency on your side?")* |
| **Decision** | Known decision process, budget signals, stakeholders involved | *(e.g. "Who else needs to be involved before a decision like this moves forward?")* |

Produce exactly **3 prioritised discovery questions** drawn from the gaps above. Label them:
> 🔑 **Top 3 questions for this meeting:**
> 1. [Question targeting the most critical SPICED gap]
> 2. [Question targeting the second most critical gap]
> 3. [Question targeting a relationship or process gap]

---

### ✅ Suggested Agenda (Optional)
If the deal stage or meeting type implies a clear agenda (e.g. discovery call, demo, proposal review, QBR), suggest a 3-point meeting structure:
1. Re-establish context and confirm agenda
2. Core discussion or demo focus
3. Agree next step with owner and date

Skip this section if the meeting type is unclear.

---

## Step 4 — Save to HubSpot

After presenting the prep card in-chat, always offer:

> *"Should I save a summary of this prep card to the HubSpot deal or contact record?"*

If confirmed (or if the rep said "save it" in their original prompt), write a note via HubSpot MCP with:
- **Title**: `Meeting Prep — [Company] — [Date]`
- **Body**: 5–7 bullet summary covering: attendees, deal status, last touchpoint, top 2 SPICED gaps, and the 3 priority questions
- Do NOT log the full formatted card — keep the note concise and CRM-scannable
- Prefer logging to the **open deal record** if one exists; fall back to the **company record**; fall back to the **primary contact record**

Confirm to the rep where the note was saved:
> *"Saved as a note on [Deal / Company / Contact] in HubSpot."*

---

## Output quality rules

- Never fabricate CRM data. If a field is missing, say so explicitly.
- If a calendar attendee has no HubSpot record, flag them — do not invent a profile.
- If there are no open deals, still run the prep — use the company and contact records.
- If the company doesn't exist in HubSpot at all, say so and offer to run prep from calendar + web context only.
- Flag sandbox data quirks if results look inconsistent (e.g. zero activity, mismatched lifecycle stage, owner = deactivated user).
- Keep the in-chat card scannable — aim for under 500 words excluding the SPICED table.
- SPICED questions must be specific to this account — never use generic placeholder questions in the final output.
