# SCRATCHPAD

## Current State

**Status**: COMPLETE (M0–M3)
**Active milestone**: none — all milestones done
**Last session**: 2026-04-11

**Next actions**:
- [ ] Fix tag alignment for Arts & Humanities (8/60 paths fall back to all courses — add `film`, `visual-arts`, `narrative` tags to relevant AH courses in data/courses.json)
- [ ] Playtest all 5 adventures and verify course recommendations feel relevant
- [ ] Rewrite adventure stories if desired (see docs/adventure-writing-guide.md + data/adventures-template.json)

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
