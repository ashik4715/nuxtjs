# University Application Tracker & Outreach — Design Spec

## Overview

Standalone Nuxt page at `/university-tracker` with three tabs:

1. German Universities (60 programs from boishik.md)
2. Non-German Programs (9 programs from study.md)
3. Professor Outreach (105 professors from merged CSVs)

Plus a document generation system for motivation letters, SOP, and cold emails.

## Data Sources

| Source                                 | Content                             | Format                  |
| -------------------------------------- | ----------------------------------- | ----------------------- |
| `assets/boishik.md`                    | 60 German university programs       | Inline JSON (seed data) |
| `assets/study.md`                      | 9 non-German programs               | Inline JSON (seed data) |
| `assets/ashik-academic-credentials.md` | Author's academic profile           | Reference doc           |
| `public/professors.json`               | 105 professors (merged from 3 CSVs) | JSON                    |
| `public/email-templates.json`          | 3 email templates                   | JSON                    |

## Page Structure

### Header

- Title: "University Application Tracker & Outreach"
- Subtitle: search, filter, sort, personalize programs and track professor outreach
- Browser saving status indicator

### Tab Switcher (3 tabs)

1. "German Universities" — full schema from boishik.md
2. "Non-German Programs" — from study.md (USA, Canada, Ireland, NZ, Europe)
3. "Professor Outreach" — from professors.json

---

## Tab 1: German Universities

**Stats Cards:** Total programs, Free tuition, Applied count, VPD required

**Table Columns:**
University, Course, Intake, Start date, End date, Portal, VPD, MOI, Tuition fee, Exam/interview, Application fee, Applied, QS ranking, GRE/GMAT, Restricted, Link, Actions

---

## Tab 2: Non-German Programs

**Stats Cards:** Total programs, Fully funded, Applied count, Country count

**Table Columns:**
Program, University, Country, Degree, Scholarship, App Fee, Deadline, Relevancy, Status, Actions

---

## Tab 3: Professor Outreach

**Stats Cards:** Total professors, Contacted, Response rate, Pending follow-ups

**Table Columns:**
Professor name, University, Country, Research area, Lab URL, Email, Status (Not contacted/Contacted/Responded/Interested/Rejected), Last contact date, Follow-up date, Notes, Actions

### Professor Data Schema (unified from 3 CSVs)

```json
{
  "id": "string",
  "status": "Ready | To Research | Contacted | Responded | Interested | Rejected",
  "priority": "A | B | C",
  "country": "string",
  "region": "Europe | North America | Asia | Oceania",
  "university": "string",
  "department": "string",
  "professorTitle": "Prof. | Assistant Professor | Associate Professor",
  "professorFirstName": "string",
  "professorLastName": "string",
  "email": "string",
  "altEmail": "string",
  "researchArea": "string",
  "keywords": "string",
  "yourPaperMatch": "string",
  "personalizedHook": "string",
  "programType": "PhD | MSc→PhD",
  "startTerm": "Fall 2026",
  "fundingPath": "string",
  "eligibilityNotes": "string",
  "websiteSource": "string",
  "linkedPaperUrl": "string",
  "emailVerification": "VALID | UNKNOWN | INVALID",
  "campaignStatus": "SCHEDULED | SENT | OPENED | REPLIED",
  "lastContactDate": "YYYY-MM-DD",
  "followUpDate": "YYYY-MM-DD",
  "notes": "string"
}
```

### Email Templates Schema

```json
{
  "templateName": "Initial_Cold_Intro | Followup_1 | Followup_2",
  "subject": "string with {{placeholders}}",
  "body": "string with {{placeholders}}"
}
```

**Placeholders:** `{{Professor_Title}}`, `{{Professor_LastName}}`, `{{Research_Area}}`, `{{Program_Type}}`, `{{Start_Term}}`, `{{Personalized_Hook}}`

---

## Features (all tabs)

- **Search**: full-text across all fields
- **Sort**: click column headers
- **Filter**: dropdowns per column + date range
- **Edit**: inline dialog to modify record
- **Delete**: requires security question answer
- **Add**: new record dialog
- **Export**: CSV of visible filtered results
- **localStorage**: guest mode, all changes persist

---

## Document Generation System

Accessible from a button on the Professor Outreach tab.

### Input

- User profile data from `ashik-academic-credentials.md`
- Target professor data from the outreach table
- Document type selector (Motivation Letter / SOP / Cold Email / Follow-up)

### Generated Documents

1. **Motivation Letter** — tailored to specific program/professor
2. **Statement of Purpose** — academic narrative
3. **Initial Cold Email** — first contact to professor
4. **Follow-up Email** — second/third touch

### Writing Rules (strict)

- Active voice, direct honest tone
- Vary sentence length (short punchy + longer)
- NO em dashes, semicolons as stylistic crutches
- NO bullet points or bold text
- NO corporate buzzwords or AI clichés (delve, testament, game-changing, in today's fast-paced world)
- Human-friendly, natural writing

---

## Security Question (Delete Gate)

Before deleting any record, show a dialog with ONE of two randomly selected questions:

1. "What is the nickname of author?" → answer: `jholok`
2. "What is the college roll number of author?" → answer: `4715`

Delete only proceeds if answer matches exactly (case-insensitive, trimmed).

---

## Technical Approach

- Single Vue page component with composables for shared logic
- Data loaded from inline JSON (universities) and fetched JSON (professors, templates)
- VueUse for localStorage persistence
- Tailwind CSS for styling (matches existing site)
- Document generation using string template interpolation

---

## Files to Create/Modify

### Data Files

1. `assets/boishik-study-tracker.md` — merged data reference doc
2. `assets/ashik-academic-credentials.md` — author's academic profile
3. `public/professors.json` — merged professor data (from 3 CSVs, deduplicated)
4. `public/email-templates.json` — email templates

### Components

5. `pages/university-tracker.vue` — main page component
6. `composables/useTracker.ts` — shared filtering/sorting/persistence logic
7. `composables/useSecurityQuestion.ts` — delete gate logic
8. `composables/useProfessorOutreach.ts` — professor tracking logic
9. `composables/useDocumentGenerator.ts` — motivation letter/SOP/email generation
10. `components/TrackerTable.vue` — reusable table component
11. `components/SecurityDialog.vue` — security question dialog
12. `components/ProgramDialog.vue` — add/edit program dialog
13. `components/ProfessorDialog.vue` — add/edit professor dialog
14. `components/DocumentGenerator.vue` — document generation UI

### Utilities

15. `utils/csvParser.ts` — CSV to JSON utility (for user uploads)
16. `utils/templates.ts` — document template interpolation

### Config

17. Navbar component — add link to tracker page
