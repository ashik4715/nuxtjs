# University Tracker Expansion — Design Spec (v2)

## Overview

Expand the University Application Tracker to include:

1. Two separate trackers: CSE and Civil Engineering
2. More opportunities from CSV files + internet research
3. Professor outreach integration
4. Updated column structure

## Changes Required

### 1. Two Tracker Pages

**Add two buttons before "Browser Saving Active":**

- "CSE Study Tracker" → shows CS/IT/AI/Data Science programs
- "Civil Engineering Study Tracker" → shows Civil/Structural/Construction programs

Both share the same layout and features but have different data sets.

### 2. German Universities Tab (CSE + Civil)

**Add rows where Portal = University Portal** from CSV data:

- TU Munich (4 programs from CSV)
- RWTH Aachen (2 programs from CSV)
- Univ. of Freiburg (1 program from CSV)
- TU Berlin (1 program from CSV)

Plus existing 60 programs from boishik.md

**Columns to keep:** University, Course, Intake, Start date, End date, Portal, VPD, MOI, Tuition fee, Exam/interview, Application fee, Applied, QS ranking, GRE/GMAT, Restricted, Link, Actions

### 3. Non-German Universities Tab

**Add Start Date column** (currently missing)

**Data sources:**

- 9 programs from study.md (Erasmus Mundus, Canada, Ireland)
- CSV professor leads → extract program info where available
- Additional programs from internet research (August 2026 deadlines)

**Columns:** Program, University, Country, Degree, Start Date, Deadline, Scholarship, App Fee, Relevancy, Status, Actions

### 4. Professor Outreach Tab

**Data from CSVs:**

- 54 professors from Canada/Ireland CSV
- 27 professors from Global PhD CSV
- 24 professors from Global Scholarship CSV
- Total: ~79 unique professors (after deduplication)

**Columns:** Professor name, University, Country, Research Area, Email, Status, Last Contact, Follow-up Date, Notes, Actions

### 5. New Opportunities to Add (August 2026+ Deadlines)

Based on CSV analysis, Erasmus Mundus catalogue, and research:

#### Computer Science (Free/Low Cost) — 40 Programs

**Germany (Free)**

| University              | Program                      | Deadline | Fee |
| ----------------------- | ---------------------------- | -------- | --- |
| TU Munich               | MSc Informatics              | Jul 2027 | €0  |
| RWTH Aachen             | MSc Computer Science         | Sep 2026 | €0  |
| TU Berlin               | MSc Computer Science         | Feb 2027 | €0  |
| Univ. of Freiburg       | MSc Computer Science         | Dec 2026 | €0  |
| University of Bonn      | MSc Computer Science         | Jul 2027 | €0  |
| University of Stuttgart | MSc Computer Science         | Jan 2027 | €0  |
| TU Dortmund             | MSc Data Science             | Jan 2027 | €0  |
| TU Darmstadt            | MSc Computer Science         | Jan 2027 | €0  |
| University of Göttingen | MSc Applied Data Science     | Nov 2026 | €0  |
| University of Passau    | MSc Computer Science         | Dec 2026 | €0  |
| University of Kassel    | MSc Computer Science         | Jan 2027 | €0  |
| University of Bamberg   | MSc Software Systems Science | Jan 2027 | €0  |

**Europe (Free/Low)**

| University                      | Program              | Country        | Deadline | Fee        |
| ------------------------------- | -------------------- | -------------- | -------- | ---------- |
| University of Helsinki          | MSc Computer Science | Finland        | Jan 2027 | €0         |
| KTH Royal Institute             | MSc Machine Learning | Sweden         | Jan 2027 | €0         |
| Technical University of Denmark | MSc Computer Science | Denmark        | Jan 2027 | DKK 0      |
| Aalto University                | MSc Computer Science | Finland        | Jan 2027 | EUR 15,000 |
| ETH Zurich                      | MSc Computer Science | Switzerland    | Dec 2026 | CHF 730    |
| TU Delft                        | MSc Computer Science | Netherlands    | Jan 2027 | EUR 2,200  |
| University of Amsterdam         | MSc Computer Science | Netherlands    | Jan 2027 | EUR 2,200  |
| Trinity College Dublin          | MSc Computer Science | Ireland        | Apr 2027 | €25,000    |
| University of Galway            | MSc Computer Science | Ireland        | Feb 2027 | €24,000    |
| University of Edinburgh         | MSc Computer Science | UK             | Mar 2027 | £26,000    |
| University of Manchester        | MSc Computer Science | UK             | Jan 2027 | £28,000    |
| University of Warsaw            | MSc Computer Science | Poland         | Jan 2027 | €3,000     |
| Charles University              | MSc Computer Science | Czech Republic | Feb 2027 | €5,000     |

**Erasmus Mundus (Fully Funded)**

| Program                                 | Universities            | Deadline | Fee |
| --------------------------------------- | ----------------------- | -------- | --- |
| EDISS - Data-intensive Software Systems | Sweden/Denmark/Germany  | Jan 2027 | €0  |
| DEAI - Data Engineering & AI            | France/Germany/Spain    | Jan 2027 | €0  |
| CYBERSURE - Cybersecurity               | UK/Ireland/Germany      | Jan 2027 | €0  |
| EMMC IMAGINE - Medical Image Computing  | Germany/Netherlands     | Jan 2027 | €0  |
| EMJM in Imaging                         | Italy/Finland/Sweden    | Jan 2027 | €0  |
| IPCVai - Image Processing & CV          | France/Spain/Hungary    | Jan 2027 | €0  |
| EMAI - Erasmus Mundus in AI             | Spain/Netherlands/Italy | Dec 2026 | €0  |
| COSI - Computational Colour             | France/Spain/Norway     | Jan 2027 | €0  |

**North America**

| University                     | Program                | Country | Deadline | Fee        |
| ------------------------------ | ---------------------- | ------- | -------- | ---------- |
| University of Waterloo         | MMath Computer Science | Canada  | Dec 2026 | CAD 22,000 |
| University of British Columbia | MSc Computer Science   | Canada  | Dec 2026 | CAD 9,000  |
| University of Alberta          | MSc Computing Science  | Canada  | Jan 2027 | CAD 10,000 |
| Simon Fraser University        | MSc Computing Science  | Canada  | Jan 2027 | CAD 17,500 |
| McGill University              | MSc Computer Science   | Canada  | Jan 2027 | CAD 20,000 |
| University of Toronto          | MSc Computer Science   | Canada  | Dec 2026 | CAD 24,000 |

**Asia**

| University                       | Program                 | Country     | Deadline | Fee           |
| -------------------------------- | ----------------------- | ----------- | -------- | ------------- |
| National University of Singapore | MSc Computer Science    | Singapore   | Jan 2027 | SGD 48,000    |
| Hong Kong University of Science  | MSc Computer Science    | Hong Kong   | Dec 2026 | HKD 180,000   |
| NTU Singapore                    | MSc Computer Science    | Singapore   | Jan 2027 | SGD 48,000    |
| Seoul National University        | MSc Computer Science    | South Korea | Oct 2026 | KRW 6,000,000 |
| University of Tokyo              | MSc Information Science | Japan       | Dec 2026 | JPY 535,800   |

#### Civil Engineering (Free/Low Cost) — 35 Programs

**Germany (Free)**

| University                    | Program               | Deadline | Fee |
| ----------------------------- | --------------------- | -------- | --- |
| TU Munich                     | MSc Civil Engineering | Jul 2027 | €0  |
| RWTH Aachen                   | MSc Civil Engineering | Sep 2026 | €0  |
| TU Berlin                     | MSc Civil Engineering | Feb 2027 | €0  |
| University of Stuttgart       | MSc Civil Engineering | Jan 2027 | €0  |
| TU Braunschweig               | MSc Civil Engineering | Jan 2027 | €0  |
| TU Darmstadt                  | MSc Civil Engineering | Jan 2027 | €0  |
| University of Karlsruhe (KIT) | MSc Civil Engineering | Jan 2027 | €0  |
| TU Hamburg                    | MSc Civil Engineering | Feb 2027 | €0  |

**Europe (Free/Low)**

| University                      | Program                    | Country     | Deadline | Fee       |
| ------------------------------- | -------------------------- | ----------- | -------- | --------- |
| Technical University of Denmark | MSc Civil Engineering      | Denmark     | Jan 2027 | DKK 0     |
| KTH Royal Institute             | MSc Structural Engineering | Sweden      | Jan 2027 | €0        |
| University of Helsinki          | MSc Civil Engineering      | Finland     | Jan 2027 | €0        |
| ETH Zurich                      | MSc Civil Engineering      | Switzerland | Dec 2026 | CHF 730   |
| TU Delft                        | MSc Civil Engineering      | Netherlands | Jan 2027 | EUR 2,200 |
| Trinity College Dublin          | MSc Civil Engineering      | Ireland     | Apr 2027 | €25,000   |
| University of Galway            | MEng Civil Engineering     | Ireland     | Feb 2027 | €24,000   |
| NTNU Norway                     | MSc Civil Engineering      | Norway      | Jan 2027 | NOK 0     |
| University of Edinburgh         | MSc Civil Engineering      | UK          | Mar 2027 | £28,000   |
| University of Manchester        | MSc Civil Engineering      | UK          | Jan 2027 | £28,000   |
| Politecnico di Milano           | MSc Civil Engineering      | Italy       | Jan 2027 | €3,800    |
| TU Wien                         | MSc Civil Engineering      | Austria     | Jan 2027 | €730      |
| University of Zagreb            | MSc Civil Engineering      | Croatia     | Feb 2027 | €1,000    |

**Erasmus Mundus (Fully Funded)**

| Program                                             | Universities             | Deadline | Fee |
| --------------------------------------------------- | ------------------------ | -------- | --- |
| RESCO - Renewable Energy & Sustainable Construction | France/Spain/Germany     | Jan 2027 | €0  |
| TERRA - Earthen Architecture & Construction         | France/Spain/Netherlands | Jan 2027 | €0  |
| EMJM - Sustainable Transportation                   | Portugal/Finland/Germany | Jan 2027 | €0  |
| EMJM - Erasmus Mundus in Wind Energy                | Denmark/Spain/Germany    | Jan 2027 | €0  |
| EMJM - Management of Interior Environments          | Belgium/Spain/Italy      | Jan 2027 | €0  |

**North America**

| University                     | Program                | Country | Deadline | Fee        |
| ------------------------------ | ---------------------- | ------- | -------- | ---------- |
| University of British Columbia | MSc Civil Engineering  | Canada  | Dec 2026 | CAD 9,000  |
| University of Waterloo         | MEng Civil Engineering | Canada  | Dec 2026 | CAD 22,000 |
| University of Alberta          | MSc Civil Engineering  | Canada  | Jan 2027 | CAD 10,000 |
| University of Toronto          | MEng Civil Engineering | Canada  | Dec 2026 | CAD 24,000 |
| McGill University              | MEng Civil Engineering | Canada  | Jan 2027 | CAD 20,000 |

**Asia**

| University                       | Program               | Country     | Deadline | Fee           |
| -------------------------------- | --------------------- | ----------- | -------- | ------------- |
| National University of Singapore | MSc Civil Engineering | Singapore   | Jan 2027 | SGD 48,000    |
| Hong Kong Polytechnic University | MSc Civil Engineering | Hong Kong   | Dec 2026 | HKD 150,000   |
| University of Tokyo              | MSc Civil Engineering | Japan       | Dec 2026 | JPY 535,800   |
| Seoul National University        | MSc Civil Engineering | South Korea | Oct 2026 | KRW 6,000,000 |
| Tsinghua University              | MSc Civil Engineering | China       | Dec 2026 | CNY 30,000    |
| University of Hong Kong          | MSc Civil Engineering | Hong Kong   | Dec 2026 | HKD 160,000   |

### 6. Layout Changes

- Keep `max-w-[1600px]` (user edited)
- Add tracker selector buttons before status indicator
- Responsive design for mobile

## Files to Modify

1. `pages/university-tracker.vue` — Add Civil Engineering tab, expand data
2. `assets/boishik.md` — Add German University Portal programs from CSV
3. `assets/study.md` — Add Start Date column
4. `public/professors.json` — Verify all CSV data merged
5. New: `public/civil-engineering-programs.json` — Civil engineering programs

## Data Mapping Summary

| Source                     | Tab                            | Count   |
| -------------------------- | ------------------------------ | ------- |
| boishik.md                 | German Universities (CSE)      | 60      |
| CSV (University Portal)    | German Universities (CSE)      | 8       |
| Additional German programs | German Universities (CSE)      | 4       |
| **Total CSE German**       |                                | **72**  |
| study.md                   | Non-German Universities (CSE)  | 9       |
| Internet research          | Non-German Universities (CSE)  | 31      |
| **Total CSE Non-German**   |                                | **40**  |
| Internet research          | Civil Engineering (German)     | 8       |
| Internet research          | Civil Engineering (Non-German) | 27      |
| **Total Civil**            |                                | **35**  |
| CSV professors             | Professor Outreach             | 79      |
| **Grand Total Programs**   |                                | **147** |
| **Grand Total Professors** |                                | **79**  |
