---
title: HubSpot API Best Practices
category: Foundations
summary: Reference guide for writing reliable, well-formatted content to HubSpot via MCP — HTML formatting, associations, enums, timestamps.
trigger: Consulted by any skill before it writes a note, task, call, or email to HubSpot.
inputs: None — reference skill.
connectors: HubSpot MCP
owner: Karina Pakule - Technology transformation team
updated: 2026-08-13
tags: foundation, reference, hubspot, api, formatting, write-safety
---

Reference guide for writing well-formatted, reliable content to HubSpot via the MCP connector. Covers all engagement object types (notes, tasks, calls, emails), association patterns, enum handling, and general CRM write discipline.

---

## Quick-Reference: Field Cheat Sheet

| Object | Key body field | HTML? | Other required/important fields |
|---|---|---|---|
| Note | `hs_note_body` | ✅ Yes | `hs_timestamp`, `hubspot_owner_id` |
| Task | `hs_task_body` | ✅ Yes | `hs_task_subject` (plain text), `hs_task_status`, `hs_task_due_date`, `hubspot_owner_id` |
| Call | `hs_call_body` | ✅ Yes | `hs_call_direction`, `hs_call_status`, `hs_call_disposition`, `hs_call_duration` (ms), `hs_timestamp` |
| Email | `hs_email_html` | ✅ Yes | `hs_email_subject`, `hs_email_direction`, `hs_email_text` (plain fallback), `hs_timestamp` |

Plain text only (no HTML): `hs_task_subject`, all standard company/contact/deal properties.

---

## Formatting: Notes, Tasks, Calls, Emails

### The core problem
HubSpot's API accepts plain text strings, but the UI renders content through its own rich-text editor. Plain text with `\n` line breaks is **not** preserved — it displays as a single unbroken paragraph in the UI.

### The fix: always use HTML
Send HTML in all engagement body fields. HubSpot's UI will render it correctly on first load — no manual re-save needed.

### HTML Formatting Patterns

**Paragraphs** — use `<p>` tags, not `\n`:
```html
<p>First paragraph.</p><p>Second paragraph.</p>
```

**Section headers** — use `<strong>` inside `<p>`, not `<h1>`–`<h6>` (HubSpot strips heading tags):
```html
<p><strong>SECTION HEADER</strong></p>
```

**Bullet lists:**
```html
<ul><li>Item one</li><li>Item two</li></ul>
```

**Numbered lists:**
```html
<ol><li>First item</li><li>Second item</li></ol>
```

**Full note template:**
```html
<p><strong>Pre-call research brief — [Date]</strong></p>
<p><strong>KEY FINDINGS</strong></p>
<p>Finding one goes here.</p>
<p>Finding two goes here.</p>
<p><strong>DISCOVERY GAPS</strong></p>
<ol>
  <li>First gap or question.</li>
  <li>Second gap or question.</li>
</ol>
```

### What NOT to use
| Avoid | Use instead |
|---|---|
| `\n` or `\n\n` | `<p>...</p>` |
| `<h1>`, `<h2>`, etc. | `<p><strong>...</strong></p>` |
| `•` bullet characters | `<ul><li>...</li></ul>` |
| Markdown (`**bold**`, `# Header`) | HTML tags |
| Raw dashes as separators (`---`) | `<p><strong>HEADER</strong></p>` |

---

## Notes vs Tasks — When to Use Which

| Use a **Note** when... | Use a **Task** when... |
|---|---|
| Logging research, call summaries, or meeting outcomes | There is a concrete action a rep needs to take |
| Recording context for future reference | A due date or assignee is relevant |
| No action required | Something needs to appear in the open task queue |

**Default to Notes** for any informational logging — research briefs, call summaries, meeting outcomes, data snapshots. Tasks are strictly for actionable work items.

Never create a Task just to work around formatting limitations or to store reference content. A Task marked `COMPLETED` immediately upon creation is a misuse of the object — use a Note instead.

**Task field specifics:**
- `hs_task_subject`: plain text title (no HTML)
- `hs_task_status`: `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED` | `WAITING` | `DEFERRED`
- `hs_task_due_date`: ISO 8601 datetime

---

## Calls

Use the Call object when logging an actual phone or video interaction. Don't use Notes as a substitute for calls — it breaks call activity reporting.

**Important call fields:**

| Field | Values / Format |
|---|---|
| `hs_call_direction` | `INBOUND` or `OUTBOUND` |
| `hs_call_status` | `COMPLETED`, `MISSED`, `CANCELED`, `NO_ANSWER`, `BUSY`, `FAILED` |
| `hs_call_disposition` | Enum — retrieve valid values with `get_properties`. Common: "Connected", "Left voicemail", "No answer" |
| `hs_call_duration` | Integer, in **milliseconds** (not seconds). A 5-minute call = `300000` |
| `hs_call_body` | HTML — use same formatting patterns as notes |
| `hs_timestamp` | ISO 8601 — set to actual call time, not API call time |

Common mistake: setting `hs_call_duration` in seconds. HubSpot will display a duration 1000× too short in the UI without throwing an error.

---

## Emails

Use the Email engagement object when logging outbound/inbound email interactions against a contact or deal record.

**Important email fields:**

| Field | Notes |
|---|---|
| `hs_email_subject` | Plain text subject line |
| `hs_email_html` | Full HTML body — use standard formatting patterns |
| `hs_email_text` | Plain text fallback (always include alongside HTML) |
| `hs_email_direction` | `EMAIL` (outbound) or `INCOMING_EMAIL` (inbound) |
| `hs_timestamp` | ISO 8601 — set to actual send/receive time |

Always include both `hs_email_html` and `hs_email_text`. Some HubSpot views render the plain text version; omitting it can cause blank email previews.

---

## Associations

Always associate engagements with all relevant objects. Missing associations means the activity won't appear on related records.

```json
"associations": [
  { "targetObjectId": 123, "targetObjectType": "companies" },
  { "targetObjectId": 456, "targetObjectType": "contacts" },
  { "targetObjectId": 789, "targetObjectType": "deals" }
]
```

Associate with every relevant object type — company, contact(s), and deal(s) — not just one. If associating with multiple contacts (e.g., all attendees on a call), include each as a separate entry.

**Association type IDs:** Some MCP calls require an explicit `associationTypeId`. Using the wrong one (e.g., swapping the direction of a company↔deal association) will either silently fail or create the wrong relationship type. When in doubt, use `get_association_types` to retrieve valid type IDs for the object pair before writing.

---

## Timestamps

Always set `hs_timestamp` on notes, calls, and emails to control where they appear in the activity feed timeline:

```json
"hs_timestamp": "2026-05-06T09:00:00Z"
```

Without it, HubSpot uses the API call time, which may be slightly off. For historical entries (e.g., logging a past meeting), set the timestamp to the actual event time — otherwise the activity appears out of order in the timeline.

Tasks use `hs_task_due_date` for scheduling, not `hs_timestamp`.

---

## Owner Assignment

Always set `hubspot_owner_id` on engagements and tasks. Without it, the activity appears unowned and may not surface in rep dashboards, task queues, or activity reports.

Use `search_owners` to find the correct owner ID by name or email before writing:
```
search_owners(query="Karina")
```

For tasks, the owner is also the assignee — if the task is for a specific rep, use their ID, not the admin's.

---

## Enum Values

Enum properties require the **API value**, not the display label. Always use `get_properties` to retrieve valid enum options before setting:

```
get_properties(objectType="deals", propertyNames=["dealstage"])
```

Common mistake: setting `dealstage: "Appointment Scheduled"` instead of `dealstage: "1580915926"`.

This applies to all enum properties, including:
- `dealstage` (deal stages)
- `lifecyclestage` (lifecycle stages — values vary by portal)
- `hs_call_disposition` (call outcomes)
- Any custom select/radio/checkbox property

Never assume enum API values from their display labels — they are often numeric IDs or internal slugs that bear no resemblance to what's shown in the UI.

---

## General CRM Write Patterns

### Always confirm before writing
Before creating or updating any CRM record, show the user a summary of the proposed change and wait for confirmation — unless they have explicitly waived confirmations for the session.

### Read before updating
Before updating an existing record's properties, retrieve the current property values first. Partial updates via `manage_crm_objects` only overwrite the fields you pass — but some properties interact with each other, and it's easy to set a value that conflicts with adjacent fields. Knowing the current state prevents logic errors.

### Check before creating
Before creating a new company, contact, or deal, search for existing records to avoid duplicates:
```
search_crm_objects(objectType="companies", query="Company Name")
```

### Property names vs labels
Always use the API property **name** (e.g., `hs_task_body`), not the UI label (e.g., "Task Notes"). Use `search_properties` to find the correct name when unsure.

### Batch writes
When creating multiple related objects, batch them in a single `manage_crm_objects` call where possible (up to 10 objects per request). Create associations in the same call.

### Error handling
If a write fails, check:
1. Property name is correct (not a UI label)
2. Property is writable (some are read-only system properties)
3. Object ID exists (search first)
4. Value format matches property type (dates in ISO 8601, enums use API values, durations in ms)
5. Association type IDs are correct for the object pair direction

---

## Deletion

The HubSpot MCP connector does **not** expose a delete tool for engagements (notes, tasks, calls, emails). If an engagement needs to be deleted, direct the user to do it manually in the HubSpot UI from the relevant record's activity feed.
