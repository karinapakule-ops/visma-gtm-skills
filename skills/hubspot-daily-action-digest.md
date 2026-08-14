---
title: Daily Action Digest
category: Productivity, HubSpot
summary: Pulls your open tasks, overdue activities, and stale deals and ranks them by deal value × urgency into a prioritised daily list.
trigger: First thing in the morning, or any time you want a prioritised to-do view.
inputs: None — uses your logged-in HubSpot owner (or a named rep, for managers).
connectors: HubSpot MCP (Native connector fallback)
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: productivity, tasks, pipeline, prioritisation, revops, hubspot
---

Pulls all open tasks, overdue activities, and neglected deals assigned to the rep, then ranks them by deal value × urgency into a prioritised daily action list.

**Connector:** HubSpot MCP preferred (richer filtering + deal value data). Falls back gracefully to Native Connector (read-only, tasks + activities only — deal value ranking will be limited).

---

## Step 0 — Detect Connector Availability

Before pulling data, silently check which connector is available:

- **HubSpot MCP available** → proceed with full workflow (Steps 1–5). Enables deal value retrieval, urgency scoring, and HubSpot task view links.
- **HubSpot MCP not available, Native Connector present** → proceed in degraded mode. Note this to the rep:
  > *"Running in read-only mode via the Native Connector — I can pull your tasks and overdue activities, but deal value × urgency scoring will be limited."*
  Skip deal-level prioritisation scoring; rank by due date only. Skip Step 4 (Excel export) unless you can build it from the data already retrieved.

---

## Step 1 — Identify the Rep

Extract the rep identity from context:
- If the rep is logged in via MCP, use the authenticated user's owner ID automatically.
- If the rep names themselves ("show me tasks for [name]") or a manager is asking on behalf of someone, resolve the HubSpot user/owner ID via `search_owners`.
- If identity is ambiguous, ask one question:
  > *"Who should I pull tasks for? I'll default to your account — or give me a rep name."*

---

## Step 2 — Pull Data from HubSpot

Retrieve the following in parallel where possible. Do not skip a data type if it returns empty — note it explicitly.

### 2A — Open Tasks
Use `search_crm_objects` (object type: `tasks`) with filters:
- `hs_task_status` = `NOT_STARTED` or `IN_PROGRESS`
- `hubspot_owner_id` = rep's owner ID

Retrieve per task:
- Task subject / title
- Due date (calculate days overdue if past today)
- Priority (if set)
- Associated deal name + deal ID
- Associated contact name
- Associated company name
- HubSpot task URL (construct as `https://app.hubspot.com/contacts/{portalId}/tasks` — or per-record link if available)

### 2B — Overdue Activities
Use `search_crm_objects` (object type: `engagements` or `activities`) with filters:
- Activity type: call, email, meeting — scheduled but not completed
- Due/scheduled date < today
- Owner = rep's owner ID

Retrieve per activity:
- Activity type + subject
- Scheduled date + days overdue
- Associated deal name + deal ID
- Associated contact and company

### 2C — Deals with No Recent Contact (14+ Days)
Use `search_crm_objects` (object type: `deals`) with filters:
- `hubspot_owner_id` = rep's owner ID
- `dealstage` ≠ Closed Won / Closed Lost (exclude closed deals)
- `hs_lastmodifieddate` or last activity date < 14 days ago

Retrieve per deal:
- Deal name + deal ID
- Deal stage
- Deal value (`amount` property)
- Expected close date + days until close (or days overdue)
- Last activity date + type
- Associated company name
- HubSpot deal URL: `https://app.hubspot.com/contacts/{portalId}/deal/{dealId}`

---

## Step 3 — Score and Rank

### Urgency Score (per item)

Calculate a **Priority Score** for each item using this formula:

```
Priority Score = Deal Value Score × Urgency Multiplier
```

**Deal Value Score:**
| Deal Value | Score |
|---|---|
| > €100,000 | 5 |
| €50,001–€100,000 | 4 |
| €20,001–€50,000 | 3 |
| €5,001–€20,000 | 2 |
| ≤ €5,000 or unknown | 1 |

**Urgency Multiplier:**
| Condition | Multiplier |
|---|---|
| Task overdue > 7 days | 3× |
| Task overdue 1–7 days | 2× |
| Task due today | 1.5× |
| Task due this week | 1× |
| Deal: close date in < 7 days | 3× |
| Deal: close date in 7–14 days | 2× |
| Deal: no contact in 21+ days | 2× |
| Deal: no contact in 14–21 days | 1.5× |
| Activity overdue | 2× |

Apply the **highest applicable multiplier** per item — do not stack.

> **Native Connector fallback:** If deal value is unavailable, score all items as Deal Value Score = 1 and rank by urgency multiplier only (effectively due-date ranked). Flag this at the top of the output.

### Group and Sort

After scoring, group items into three sections:
1. **🔴 Act Today** — Priority Score ≥ 6, or any item overdue > 7 days, or close date < 7 days
2. **🟡 This Week** — Priority Score 3–5
3. **🟢 On Radar** — Priority Score ≤ 2, no immediate urgency

Within each group, sort descending by Priority Score.

---

## Step 4 — Format the Digest Output

Present the digest in this format in chat:

---

**📋 Daily Action Digest — [Rep Name] — [Today's Date]**

**Connector:** [MCP — Full mode / Native — Limited mode]
**Data pulled:** [X] open tasks · [Y] overdue activities · [Z] deals with no recent contact

---

### 🔴 Act Today ([N] items)

| # | Type | Subject / Deal | Company | Deal Value | Due / Last Contact | Days Overdue | Priority Score | HubSpot Link |
|---|---|---|---|---|---|---|---|---|
| 1 | Task | [Subject] | [Company] | [€ value] | [date] | [X days] | [score] | [Open ↗] |
| 2 | Deal | [Deal Name] | [Company] | [€ value] | [last contact date] | — | [score] | [Open ↗] |

---

### 🟡 This Week ([N] items)

[same table format]

---

### 🟢 On Radar ([N] items)

[same table format]

---

**⚠️ Data gaps (if any):**
- [e.g. "12 deals have no deal value set — scored as minimum. Update deal values for accurate prioritisation."]
- [e.g. "Native Connector mode — deal value scoring unavailable"]

---

Then ask:

> *"Would you like me to export this as an Excel file, or open any of these in HubSpot? Just say **export** or give me a number from the list."*

---

## Step 5 — Post-Digest Actions

Handle the rep's follow-up request:

### Option A — Export to Excel

If the rep says **"export"**, **"Excel"**, **"download"**, or **"save this"**:

Build an `.xlsx` file with:
- **Tab 1: Action Digest** — full ranked table with all columns (Type, Subject/Deal, Company, Deal Value, Due Date, Days Overdue, Priority Score, HubSpot Link)
- **Tab 2: Summary** — counts per group (Act Today / This Week / On Radar), total deal value at risk, data gap flags
- Apply conditional formatting: 🔴 red fill for Act Today rows, 🟡 yellow for This Week, 🟢 green for On Radar

Present the file for download via `present_files`.

### Option B — Open in HubSpot

If the rep says **"open [number]"** or **"show me deal [X]"**:
- Return the direct HubSpot URL for that item as a clickable link
- Format: `[Open [Deal/Task Name] in HubSpot ↗]([url])`

### Option C — No follow-up

If the rep says nothing further, the digest stands as delivered. Do not prompt again.

---

## Edge Cases

| Situation | How to handle |
|---|---|
| Rep has zero open tasks | State clearly: "No open tasks found." Still show overdue activities and neglected deals. |
| All deals are recently active | State: "No deals with 14+ days of silence found." Show tasks and activities only. |
| HubSpot portal ID not available for URL construction | Omit HubSpot links and note: "Direct links unavailable — open tasks from your HubSpot Tasks view." |
| Rep asks for someone else's digest (manager use) | Resolve owner via `search_owners`, run same workflow. Note whose digest this is at the top. |
| Deal has no close date | Treat urgency for close-date signals as N/A. Score on deal value + last contact recency only. |
| Very large result set (50+ items) | Cap display at top 20 by Priority Score. Note: "Showing top 20 of [X] total items. Export to Excel for the full list." |
| Native Connector + no deal value data | All items score as Value = 1. Rank by urgency only. Flag prominently. |
| Duplicate items (task + neglected deal for same record) | Show both entries — they represent different action types. Do not deduplicate. |

---

## Output Quality Rules

- Never fabricate CRM data. If a field is missing (deal value, due date), say so and apply the fallback score.
- Flag sandbox data quirks if something looks off (e.g. all deals have €0 value, all tasks are years overdue).
- The Priority Score is a guide, not a contract — remind the rep they can reorder based on context the CRM doesn't capture.
- Keep the digest scannable. The table format is intentional — do not convert it to prose.
- If running in Native Connector mode, always make the limitation visible so the rep understands the ranking is degraded.
