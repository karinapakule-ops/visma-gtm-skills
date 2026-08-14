---
title: SPICED Call Note Structurer
category: CRM Hygiene
summary: Turns raw or voice-to-text call notes into a structured SPICED CRM note and logs it to the right HubSpot record.
trigger: After every discovery or qualification call.
inputs: Raw call notes (pasted text or voice-to-text), plus the deal/contact.
connectors: HubSpot MCP
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: crm hygiene, spiced, notes, discovery, hubspot
---

Converts raw rep call notes (pasted text or an existing HubSpot note) into a structured SPICED CRM note, previews it for rep confirmation, then logs it to the correct HubSpot record.

---

## SPICED Framework

| Element | Mandatory | What to extract |
|---|---|---|
| **S — Situation** | ✅ | Current state: company context, team, tools, where they are today |
| **P — Pain** | ✅ | The problem, challenge, or frustration driving the conversation |
| **I — Impact** | ✅ | Business consequences of the pain — revenue, time, risk, morale |
| **C — Critical Event** | ❌ Optional | A deadline, event, or forcing function creating urgency |
| **D — Decision** | ✅ | Who decides, what the process looks like, next step agreed |

---

## Workflow

### Step 1 — Identify the Record

Check whether the rep has provided a company name, contact name, or deal name in their message.

- If yes → search HubSpot for the matching deal or contact using that name. If one clear match is found, proceed. If multiple matches, show a short list and ask which one.
- If no record is referenced → ask: *"Which deal or contact should I log this against? You can give me a name or HubSpot ID."*

Use `search_crm_objects` to look up deals, contacts, or companies by name.

---

### Step 2 — Collect the Raw Notes

Accept input in any of these forms:
- **Pasted text** — rep types or pastes notes directly into chat
- **Existing HubSpot note** — rep references a note already logged (e.g. "use the note I just logged on Acme"). Retrieve using `get_crm_objects` on the associated activity/note.
- **Voice-to-text dump** — unstructured, rambling, or fragmented text. Treat the same as pasted text — extract meaning, don't require clean input.

---

### Step 3 — Structure into SPICED

Extract and format the note using this template:

```
📋 SPICED Call Note
[Date] | [Company Name] | [Contact Name if known]

🔵 Situation
[What is the prospect's current state, context, and setup?]

🔴 Pain
[What specific problem or challenge did they surface?]

💥 Impact
[What is the business consequence of that pain?]

⚡ Critical Event (if applicable)
[Is there a deadline, event, or trigger creating urgency? If none identified, omit this section.]

✅ Decision
[Who makes the decision? What does their process look like? What was the agreed next step?]

---
📌 Gaps flagged: [List any mandatory SPICED elements (S/P/I/D) where the raw notes didn't provide enough to fill the field. Do not block logging — surface for rep awareness only.]
```

**Extraction rules:**
- Use the rep's own language where it's clear — don't over-sanitise
- If a mandatory element (S, P, I, D) has no content in the notes, include the heading with `[Not captured in notes]` and list it under Gaps flagged
- If Critical Event is not mentioned, omit the section entirely — don't add a placeholder
- Keep each section concise: 2–4 sentences max
- Do not invent or infer details not present in the raw notes

---

### Step 4 — Preview and Confirm

Present the formatted note to the rep and ask:

> *"Here's your SPICED note — does this look right? If you want to edit anything, just tell me what to change. When you're happy, let me know whether to log this to the **deal record**, the **contact record**, or **both**."*

Wait for explicit confirmation before logging. If the rep requests edits, apply them and re-present before asking again.

---

### Step 5 — Log to HubSpot

Once the rep confirms and specifies where to log:

- Use `manage_crm_objects` to create a Note activity on the specified record(s)
- Set the note body to the full formatted SPICED note text
- Associate the note with the correct deal ID and/or contact ID

Confirm back to the rep:
> *"Done — SPICED note logged to [Deal/Contact name]. Here's the HubSpot link if you want to check it."*

---

## Edge Cases

| Situation | How to handle |
|---|---|
| Rep pastes notes but doesn't mention a record | Ask for company/deal/contact name before structuring |
| Multiple HubSpot records match the name | Show top 3 matches with stage/owner info and ask rep to pick |
| Notes are very thin (1–2 sentences) | Structure what's there, flag all gaps, proceed — don't ask for more unless rep invites it |
| Rep says "just log it" without reviewing | Still show the formatted note — always preview before writing to HubSpot |
| No deal record exists yet | Log to the contact or company record, note that no deal was found |
