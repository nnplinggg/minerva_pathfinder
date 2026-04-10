# Gamified School Explorer — Design Spec

**Date**: 2026-04-10
**Project**: Minerva Pathfinder
**Feature**: Gamified mascot-led adventure to discover Minerva's 5 schools

---

## Overview

Replace the blank app shell with an interactive, gamified experience where a cute pixel-art mascot guides admitted/freshman students through choose-your-own-adventure stories — one per school — revealing courses upon completion. Students can collect all 5 schools and receive a personalized summary card.

---

## User Flow

1. **Welcome screen** — Pixel mascot intro animation, app title, "Start your adventure" button.
2. **World map** — Pixel-art map with 5 school zones. Each zone shows a lock (undiscovered) or stamp/badge (discovered). Mascot sits on the map. Click any zone to enter its adventure.
3. **Adventure screen** — Story text + 2–3 choice buttons. 3 decision nodes per school, all paths converge to that school's unlock ending.
4. **School card** — Displayed after adventure completes. Shows: school name, description, and list of courses (from JSON). "Return to map" button stamps the zone.
5. **Final summary** — Triggered when all 5 schools are stamped. Shows "Your Minerva Path" with all 5 schools discovered, a short personalized blurb, and a prompt to screenshot/share.

Progress is saved to `localStorage` so returning students pick up where they left off.

---

## Architecture

### File Structure

```
index.html                        Main entry point (single page)
css/styles.css                    All styles — mobile-first, pixel art, animations
js/app.js                         State machine — screen transitions, progress tracking
js/data.js                        Loads and queries JSON data files
data/
  adventures.json                 Story trees for all 5 school adventures
  courses.json                    Course entries per school (manually curated)
```

### State Machine (app.js)

The app has 5 named states managed in a single object:
- `welcome` — initial landing
- `map` — world map view
- `adventure` — active story node
- `school-card` — post-adventure school reveal
- `summary` — all 5 collected

State is stored in memory during the session; discovered schools are persisted to `localStorage`.

### Data Module (data.js)

Exposes two async functions:
- `getAdventure(schoolId)` — returns the story tree for a school
- `getCourses(schoolId)` — returns courses filtered by school

All data is fetched once on load and cached in memory.

---

## Data Schemas

### adventures.json

```json
[
  {
    "id": "cs-start",
    "school": "computational-sciences",
    "text": "Story node text here.",
    "choices": [
      { "label": "Choice A", "next": "cs-2a" },
      { "label": "Choice B", "next": "cs-2b" }
    ]
  },
  {
    "id": "cs-end",
    "school": "computational-sciences",
    "text": "Ending text — you've discovered this school!",
    "unlocks": "computational-sciences"
  }
]
```

Each school has ~4 nodes (3 decision + 1 terminal). All paths within a school converge to a single terminal node with `"unlocks"`. No dead ends.

### courses.json

```json
[
  {
    "id": "cs-formal-analyses",
    "school": "computational-sciences",
    "title": "Formal Analyses",
    "description": "Brief description from Minerva's public catalog."
  }
]
```

Target: 5–8 courses per school (25–40 entries total). Content curated manually from Minerva's public course catalog.

---

## The 5 Schools

| School ID | Display Name | Map Icon |
|---|---|---|
| `arts-humanities` | Arts & Humanities | Paintbrush |
| `social-sciences` | Social Sciences | Globe |
| `computational-sciences` | Computational Sciences | Atom/Circuit |
| `natural-sciences` | Natural Sciences | Leaf/Flask |
| `business` | Business | Chart/Briefcase |

Each gets a distinct accent color derived from Minerva's brand palette (Obsidian, Bone, Clay base + 2 accent tones).

---

## Mascot

- Built entirely in CSS using `box-shadow` pixel grid (16×16 base sprite)
- No external image files
- Two animations:
  - `idle`: subtle vertical bounce (runs always on map screen)
  - `celebrate`: wiggle + scale pulse (triggers on school unlock)
- Mascot is a small generic explorer character — named "Mi" (short for Minerva)

---

## UI & Styling

- Mobile-first responsive layout
- Pixel font via Google Fonts (`Press Start 2P` or `VT323`) for headings/buttons
- School zone tiles on map: CSS grid, each tile ~120×120px on desktop, full-width stacked on mobile
- Lock icon → stamp transition: CSS class swap + short scale animation
- All colors from Minerva brand: `--color-obsidian`, `--color-bone`, `--color-clay` + school accent vars

---

## Summary Card

Displayed when all 5 schools are unlocked. Contains:
- "You've discovered all of Minerva!" heading
- Five school badges in a row
- A short personalized blurb based on the **first school unlocked** (treated as the student's primary interest). One blurb pre-written per school (5 total). Example: first unlock was Computational Sciences → "You started with code and logic — a natural systems thinker. Minerva's CS school might be your home base."
- "Screenshot this!" prompt (no share API required — just a visual cue)

---

## Data Privacy

- No user data is collected or transmitted
- `localStorage` stores only an array of unlocked school IDs (e.g. `["computational-sciences", "business"]`)
- Compliant with Minerva AI Guardrails (Zero-Trust PII policy)

---

## Out of Scope

- User accounts or login
- Backend or database of any kind
- AI-generated content at runtime
- Fetching live data from external APIs
- Animations beyond CSS (no canvas, no WebGL)
