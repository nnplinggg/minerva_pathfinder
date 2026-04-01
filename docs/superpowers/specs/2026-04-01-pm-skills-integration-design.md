# PM Skills Integration Design — Minerva Pathfinder

**Date:** 2026-04-01
**Project:** admissions1 (private workshop repo)
**Status:** Approved

---

## What We're Building

Integrate the [deanpeters/Product-Manager-Skills](https://github.com/deanpeters/Product-Manager-Skills) repo into this project using **Option C (GEMINI.md-first + selective files)**, enabling dual-agent workflow between Gemini CLI and Claude Code with zero state loss.

---

## File Structure

```
admissions1/
├── GEMINI.md              ← existing; add ## PM Skills + ## User Segments sections
├── CLAUDE.md              ← new; thin bridge to GEMINI.md + Claude-specific notes
├── SCRATCHPAD.md          ← existing; add ## PM Artifacts tracker section
├── DECISIONS.md           ← unchanged (append-only)
├── skills/
│   └── pm/
│       ├── discovery-interview-prep.md
│       ├── epic-breakdown-advisor.md
│       ├── user-story-mapping.md
│       └── prd-development.md
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-01-pm-skills-integration-design.md  ← this file
```

**Split rationale:**
- 5 highest-frequency skills inline in `GEMINI.md` — Gemini sees them at every session start without any command
- 4 lower-frequency skills as files in `skills/pm/` — loaded on demand by either agent
- `CLAUDE.md` bridges Claude to `GEMINI.md` as single source of truth

---

## GEMINI.md Additions

### Section: `## PM Skills`

Five inline skill definitions appended to existing `GEMINI.md`:

| Skill | Command | Output destination |
|-------|---------|-------------------|
| Problem Statement | `/problem-statement` | DECISIONS.md |
| Proto-Persona | `/proto-persona` | DECISIONS.md |
| Jobs-to-Be-Done | `/jobs-to-be-done` | DECISIONS.md |
| Positioning Statement | `/positioning-statement` | GEMINI.md Project Identity |
| User Story | `/user-story` | DECISIONS.md |

### Section: `## User Segments`

Two segments for Minerva Pathfinder:
- **Admitted students** — deciding whether to commit to Minerva
- **First-year students** — choosing concentrations after arrival

---

## CLAUDE.md Structure

New file, ~25 lines:
- Points to `GEMINI.md` as primary project context
- Lists `skills/pm/` files with their phase mapping
- Notes when to prefer Claude vs Gemini (Claude for multi-file code edits, Gemini for PM doc sessions)

---

## SCRATCHPAD.md Addition

New `## PM Artifacts` tracker table appended below `## Milestones`:

| Artifact | PM Skill | Status | Location |
|----------|----------|--------|----------|
| Problem Statement | `/problem-statement` | [ ] | DECISIONS.md |
| Proto-Personas | `/proto-persona` | [ ] | DECISIONS.md |
| Jobs-to-Be-Done | `/jobs-to-be-done` | [ ] | DECISIONS.md |
| Positioning Statement | `/positioning-statement` | [ ] | GEMINI.md |
| User Stories | `/user-story` | [ ] | DECISIONS.md |
| User Story Map | `user-story-mapping.md` | [ ] | DECISIONS.md |
| Interview Guide | `discovery-interview-prep.md` | [ ] | DECISIONS.md |
| Data Schema | (manual) | [ ] | DECISIONS.md |
| User Research Findings | (manual) | [ ] | DECISIONS.md |
| PRD / Portfolio Write-up | `prd-development.md` | [ ] | portfolio/ |

---

## Dual-Agent Switching

**Install:** `npm install -g @google/gemini-cli` (v0.35.3 installed)

**Switch:**
```bash
gemini    # Gemini CLI session (reads GEMINI.md at start)
# Ctrl+C to exit, then:
claude    # Claude Code session (reads CLAUDE.md → GEMINI.md)
```

**Shared state:** `SCRATCHPAD.md`, `DECISIONS.md`, `skills/pm/`, all source files.

**When to use which:**
| Task | Preferred agent |
|------|----------------|
| PM artifact sessions (phases 1–3, 5–6) | Gemini CLI |
| Multi-file code edits (phase 4) | Claude Code |
| GEMINI.md / SCRATCHPAD.md updates | Gemini CLI |
| Debugging, data schema design | Claude Code |

---

## Pre-loaded PM Artifacts

The following content was defined before implementation and should be used directly when running PM skills — do not run skills from scratch.

### Problem Statement

**Who:** Admitted students deciding whether to commit + first-year students navigating course selection
**Problem:** Information asymmetry during yield decision; fragmented advice about student-fit; course information buried across disconnected documents
**Evidence:** Developer's own experience as a Minerva first-year; peer conversations; Minerva's yield conversion gap
**Impact of not solving:**
- Admitted students decline because they can't picture themselves at Minerva (no visible people from same background/interest area)
- First-year students drop out or feel misaligned because they couldn't find the right concentration early

### Proto-Personas

**Persona 1 — International Admitted Student + Parent**
- Background: Choosing between Minerva and a traditional university; family involved in decision
- Goals: Understand ROI, career outcomes, whether Minerva fits their background
- Pain points: Can't find people from their country who went to Minerva; marketing language doesn't translate to career clarity
- Decision criteria: Alumni outcomes, nationality representation, academic fit
- *Assumptions to validate: parent influence on decision, nationality as primary filter*

**Persona 2 — Minerva First-Year Student**
- Background: Enrolled, navigating course selection without a clear roadmap
- Goals: Find concentrations aligned with career interests without manual research overhead
- Pain points: 72-page course catalog, hours spent on LinkedIn stalking alumni, advice from peers is fragmented
- Decision criteria: Career relevance, interest match, peer outcomes
- *Assumptions to validate: catalog as primary pain point vs. advisor access*

### Jobs-to-Be-Done

**Admitted student jobs:**
1. "Help me feel confident that Minerva is the right fit for my career goals"
2. "Help me see people from my country/background who succeeded here"
3. "Help me understand what I'll actually study, beyond marketing language"

**First-year student job:**
4. "Help me find the concentration that fits my career interest and opportunities without having to read through the 72-page Minerva course catalog and spend a lot of time stalking alumni LinkedIn"

### Positioning Statement

For admitted Minerva students deciding whether to commit (and first-year students choosing their path),
who struggle to understand how Minerva's curriculum and network connect to their goals,
**Minerva Pathfinder** is a decision-support tool
that maps their interests to specific concentrations and surfaces relevant alumni stories.
Unlike browsing minerva.edu's marketing pages and the long text-form course catalog PDF,
our product provides personalized, interactive exploration of academic and career paths.

---

## Short-term vs Long-term Scope

| Feature | Scope |
|---------|-------|
| Course explorer (browse majors + concentrations) | Short-term (M1) |
| Interest-to-concentration matching | Short-term (M2) |
| Alumni spotlight (voluntary input model) | Long-term (M3+) |
| Admin panel for alumni data | Long-term |

**Alumni data model change from original plan:** Alumni voluntarily input nationality, intended track, and relevant experience — not scraped from public profiles. Short-term: course explorer only.
