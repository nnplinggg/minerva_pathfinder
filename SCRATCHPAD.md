# SCRATCHPAD

## Current State

**Status**: COMPLETE (M0–M3)
**Active milestone**: none — all milestones done
**Last session**: 2026-04-11

**Next actions**:
- [x] Fix tag alignment for Arts & Humanities — DONE (commit 8106cb1)
- [ ] Playtest all 5 adventures and verify course recommendations feel relevant
- [ ] Rewrite adventure stories if desired (see docs/adventure-writing-guide.md + data/adventures-template.json)
- [x] Build interactive world map — M4 (commit 0cb08a6)
- [ ] Test map on browser: node unlock, chest modal, mobile layout
- [ ] Fill in real URLs for 3 treasure chests in js/app.js (currently '#')
- [ ] Drop Sprout Lands sprites into assets/sprites/ and uncomment background-image lines in CSS
- [ ] Playtest all 5 adventures end-to-end

---

## Milestones

### M0 — Project Initialization

- [x] Clone template repository
- [x] Fill in GEMINI.md project identity section
- [x] **Define AI Guardrails**: In `DECISIONS.md`, document how this project handles data privacy and human accountability.
- [x] Define milestones M1–M3 below
- [x] Push initial commit to GitHub
- [x] Enable GitHub Pages in repository settings
- [x] Confirm live URL is accessible

### M1 — Foundation & Discovery

*Gathering the necessary data and framing the problem to ensure the Pathfinder meets student needs.*

**Values checklist**:
- [x] **Learning**: Deepens understanding & invites participation
- [x] **Agency**: Supports human control, not AI dependence
- [x] **Privacy**: Zero-trust for sensitive data (PII, student records)
- [x] **Transparency**: AI use disclosed & human-reviewed

**Acceptance criteria**:
- [x] Data collection requirements documented
- [x] Problem framing completed
- [x] Initial project artifacts (PM docs) drafted

### M2 — Blueprint & Data Structure

*Defining specific features and the static data model that will power the exploration and matching.*

**Values checklist**:
- [x] Learning
- [x] Agency
- [x] Privacy
- [x] Transparency

**Acceptance criteria**:
- [x] Feature specifications finalized
- [x] Data model (JSON structures) defined for courses
- [x] Initial static data files created

### M3 — Interface & Interaction

*Building the interactive frontend where users can explore curriculum and connect with the network.*

**Values checklist**:
- [x] Learning
- [x] Agency
- [x] Privacy
- [x] Transparency

**Acceptance criteria**:
- [x] Searchable course curriculum by interest area
- [x] Adventure-based school discovery (gamified, pixel mascot Mi)
- [x] Mobile-first responsive UI

<!-- Add milestones as the project grows. Keep acceptance criteria user-observable. -->

---

## Session Log

---

### 2026-04-01: Project Initialization and M1 Completion

**AI Tool(s) Used**: Gemini 2.0 Flash
**Purpose**: Project setup, milestone planning, drafting PM artifacts, and defining AI guardrails.
**Modifications & Verification**: Translated student goals into structured milestones and project identity. Created three PM artifacts (`problem-framing-canvas.md`, `problem-statement.md`, `data-requirements.md`) and updated `DECISIONS.md`. Verified alignment with Minerva's Student and Staff AI Guardrails.
**Learning Reflection**: Using structured PM frameworks (from the cloned repository) helped clarify the value proposition of the "Minerva Pathfinder" and established a clear path for data collection.
**Session Link/Context**: Initial project setup and M1 foundation.

---

### 2026-04-10: M2 + M3 Implementation

**AI Tool(s) Used**: Claude Code (claude-sonnet-4-6)
**Purpose**: Full implementation of gamified school explorer — pixel mascot Mi, 5 CYOA adventures, courses display, world map, summary card.
**Modifications & Verification**: Built 6 files from spec (data/adventures.json, data/courses.json, js/data.js, index.html, css/styles.css, js/app.js). Spec and code quality reviewed by automated subagents after each task.
**Learning Reflection**: Designing a state machine in vanilla JS without a framework required explicit screen management — each screen is a distinct render function. The IIFE pattern in data.js shows how to create private scope without ES modules.
**Session Link/Context**: Gamification design spec at docs/superpowers/specs/2026-04-10-gamification-design.md

---

### 2026-04-12b: M4 World Map — Pixel Art Interactive Map

**AI Tool(s) Used**: Claude Code (claude-sonnet-4-6)
**Purpose**: Replace flat school grid with a Sprout Lands-style pixel-art top-down map featuring 5 school nodes, 3 progressive treasure chests, and a parchment modal popup.
**Modifications & Verification**: Rewrote `#screen-map` HTML (replaced `.school-grid` with absolute-positioned `.pixel-map` canvas). Added 280+ lines of CSS: terrain background with vignette, decorative trees, school nodes (grey locked → gold glow unlocked), treasure chests (greyscale+🔒 → ✨ → gold opened) with sparkle keyframe, parchment modal with pixel drop-shadow, HUD counter, Mi marker, mobile responsive breakpoint. Extended `js/app.js`: added `CHESTS` constant, `openedChests` state, `loadOpenedChests`/`saveOpenedChests` localStorage helpers, rewrote `renderMap()`, added `openChest()` and modal close wiring. All CSS uses placeholder styling with commented swap-in lines for real Sprout Lands sprites. Committed as 0cb08a6.
**Learning Reflection**: Absolute positioning with CSS custom properties (`--nx`, `--ny`) makes node placement declarative and easy to tune without touching JS. The placeholder-first asset strategy means the map is fully playable before any sprites are added.
**Session Link/Context**: Spec at docs/superpowers/specs/2026-04-12-world-map.md, plan at docs/superpowers/plans/2026-04-12-world-map.md

---

### 2026-04-12: Tag Vocabulary Fix + World Map Brainstorm

**AI Tool(s) Used**: Claude Code (claude-sonnet-4-6)
**Purpose**: (1) Fix 8 failing adventure paths due to tag mismatch between adventures.json and courses.json. (2) Brainstorm interactive world map feature for M4.
**Modifications & Verification**: Added missing tags to 8 courses (AH112 +film, AH113 +narrative, AH146 +film/narrative, AH166 +film, CS111 +proof-writing, CS142 +algorithms, SS110 +social-systems, SS162 +research-methods). Extended tag-courses.py with CSV export/import workflow (python3 scripts/tag-courses.py --export-csv / --from-csv). Generated data/tags.csv as spreadsheet-editable source of truth. Committed and pushed as 8106cb1. All 60/60 adventure paths now have matching courses.
**Learning Reflection**: Tag-based matching requires explicit vocabulary alignment between two independently-authored datasets. The CSV workflow makes future tag edits accessible without touching Python.
**Session Link/Context**: Spec for M4 world map at docs/superpowers/specs/2026-04-12-world-map.md

---

### 2026-04-11: Adventure V2 — Deeper Branching + Interest-Based Course Matching

**AI Tool(s) Used**: Claude Code (claude-sonnet-4-6)
**Purpose**: Redesign adventure system with 3-level branching (3 endings/school), interest tag accumulation, and course recommendations filtered by student choices.
**Modifications & Verification**: Rewrote data/adventures.json (20 → 50 nodes), added tags to all 68 courses via scripts/tag-courses.py, extended js/data.js with getMatchedCourses(), updated js/app.js state machine to accumulate tags and pass them through the unlock flow. Created authoring tools (data/adventures-template.json, docs/adventure-writing-guide.md). Spec and code quality reviewed by automated subagents after each of 6 tasks; final integration review confirmed no regressions. Known gap: 8/60 paths (mostly A&H) still fall back to all courses due to tag vocabulary mismatch — data fix pending.
**Learning Reflection**: Tag-based matching requires deliberate alignment between two independently authored datasets (adventures and courses) — a design constraint that isn't visible in the code itself. The fallback mechanism (show all courses when <3 match) is what makes the system safe to deploy before that alignment is perfect.
**Session Link/Context**: Spec at docs/superpowers/specs/2026-04-10-adventure-v2-design.md, plan at docs/superpowers/plans/2026-04-10-adventure-v2.md

---

### Disclosure Template

*Copy and fill this for each session where significant AI was used (from Part 3.5 of Student Guardrails).*

**AI Tool(s) Used**: [e.g., Gemini 1.5 Pro, March 2026]
**Purpose**: [e.g., brainstorming, outlining, debugging, editing]
**Modifications & Verification**: [What did you change? How did you verify the AI's accuracy?]
**Learning Reflection**: [What value did this AI use add to your learning or work quality?]
**Session Link/Context**: [Briefly describe the chat session or provide a link if possible]

---

<!-- First entry goes here after your first working session. -->
