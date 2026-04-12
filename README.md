# Minerva Pathfinder

> A gamified, pixel-art web app that helps admitted and freshman Minerva students explore the university's 5 schools — through a choose-your-own-adventure story that ends with personalized course recommendations.

**Live:** [[nnplinggg.github.io/admissions](https://nnplinggg.github.io/minerva_pathfinder )]

---

## The Problem

Admitted and freshman Minerva students face a wall of dense, text-heavy information when trying to understand how the curriculum connects to their interests. The course catalog is a PDF. The school descriptions are administrative. There's no interactive way to say: *"I care about systems and data — what would my actual Minerva coursework look like?"*

This creates anxiety, not excitement. Students struggle to find their intellectual "fit" before committing — or in their first year when choosing concentrations.

**Minerva Pathfinder aims to facilitate personalized exploration.**

---

## How It Works

### 1. Pixel World Map
Students navigate a hand-drawn top-down map as Mi — a pixel cat mascot — using arrow keys. Each of Minerva's 5 schools is represented as a treasure chest. Walk close enough and the chest opens, starting that school's adventure.

### 2. Choose-Your-Own-Adventure
Each school has a 10-node branching story. Students make three rounds of choices, each reflecting a genuine intellectual dilemma that Minerva students actually face. Scenarios are imaginative (jungle clearings, data dimensions, ancient manuscripts) but the choices are real academic actions: "Run a causal inference analysis", "Trace the legal precedent", "Model it as a dynamical system."

The branching structure is:
```
start (3 choices)
  → branch A / B / C  (2 choices each)
    → cluster 1 / 2 / 3  (2 choices each, all pointing to the same ending)
      → ending X / Y / Z  (terminal — diagnosis)
```

This gives 3 distinct intellectual "identities" per school (e.g., Builder / Theorist / Analyst for CS). The cluster choices don't change which ending you reach — they change *which courses appear*.

### 3. Tag Accumulation
Every choice carries 2–3 invisible **interest tags** (e.g., `machine-learning`, `causal-inference`, `narrative`, `entrepreneurship`). As students make choices, these tags accumulate silently in the background. Students can go back and change their answers — the tag state is restored correctly on each backtrack.

### 4. Diagnosis & Course Matching
At the end of the adventure, Mi "claps loudly" and a CTA appears: **→ Discover your course suggestions**. On click, the app matches the student's accumulated tags against Minerva's course catalog.

**Matching logic** (`js/data.js`):
1. Filter courses by school
2. Score each course by how many of its tags overlap with the student's accumulated tags
3. Return the top 5 courses with ≥ 2 matching tags
4. Fall back to top 5 by score if fewer than 3 qualify

Two students who played the same adventure differently will often see different course recommendations — because the recommendations reflect their actual intellectual path through the story, not just the school they visited.

### 5. School Card
The result screen shows the school description, matched courses with a `?` tooltip explaining the matching mechanism, and a link to the full Minerva course catalog PDF.

---

## The 5 Schools

| School | Core theme |
|--------|-----------|
| 🎨 Arts & Humanities | Meaning, expression, history, philosophy, culture |
| 🌍 Social Sciences | Society, politics, economics, psychology, policy |
| ⚡ Computational Sciences | Algorithms, data, logic, ML, theory of computation |
| 🌿 Natural Sciences | Biology, physics, chemistry, evolution, climate |
| 📈 Business | Strategy, entrepreneurship, finance, markets |

---

## Tag System

Tags are the backbone of the matching mechanism. Each school has a vocabulary of ~40–80 tags that appear in both:
- **Adventures** — attached to choices (`choice.tags`)
- **Courses** — attached to course records (`course.tags`)

Some tags cross school boundaries (e.g., `causal-inference` appears in both Social Sciences and Computational Sciences adventures). The full tag reference for each school is in [`docs/adventure-writing-guide.md`](docs/adventure-writing-guide.md).

To edit course tags without touching JSON directly:
```bash
python3 scripts/tag-courses.py --export-csv   # → data/tags.csv (edit in Excel / Sheets)
python3 scripts/tag-courses.py --from-csv     # → updates data/courses.json
```

---

## Writing Adventures

See [`docs/adventure-writing-guide.md`](docs/adventure-writing-guide.md) for the full guide. Quick reference:

- **Tone:** Imaginative scenarios, but choices are concrete intellectual actions
- **Structure:** 10 nodes — start → 3 branches → 3 clusters → 3 endings
- **Tags:** 2–3 per choice, drawn from the school's tag vocabulary
- **Endings:** Name the student's intellectual identity ("You're a theorist")
- **Template:** [`data/adventures-template.json`](data/adventures-template.json)

The terminal node uses `"unlocks": "school-id"` — this triggers the diagnosis screen and course match.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | No build step, no dependencies. Runs directly on GitHub Pages. |
| State | In-memory JS object + `localStorage` | No server needed. Discovered schools persist across sessions. |
| Data | Static JSON | `adventures.json` (stories) + `courses.json` (68 courses with tags) |
| Font | [Silkscreen](https://fonts.google.com/specimen/Silkscreen) | Reliable pixel font, consistent across browsers |
| Hosting | GitHub Pages | Free, zero-ops |

---

## File Structure

```
admissions/
├── index.html                    # Single-page app — all screens
├── css/
│   └── styles.css                # All styles (mobile-first, CSS custom properties)
├── js/
│   ├── app.js                    # State machine, screen logic, event wiring
│   └── data.js                   # getAdventure(), getMatchedCourses()
├── data/
│   ├── adventures.json           # 5 × 10-node adventure trees
│   ├── courses.json              # 68 courses with tags
│   ├── adventures-template.json  # Blank template for new adventures
│   └── tags.csv                  # Spreadsheet-editable course tags
├── assets/
│   ├── map.png                   # Pixel world map background
│   ├── character-mi.png          # Mi mascot
│   ├── closed-chest.png          # School node (undiscovered)
│   ├── opened-chest.png          # School node (discovered)
│   ├── play-default.png          # Play button (normal)
│   └── play-clicked.png          # Play button (pressed)
├── scripts/
│   └── tag-courses.py            # CSV export/import for course tags
├── docs/
│   └── adventure-writing-guide.md
├── pm-artifacts/                 # Product management documentation
│   ├── problem-statement.md
│   ├── problem-framing-canvas.md
│   └── data-requirements.md
├── DECISIONS.md                  # Architecture decision record (append-only)
├── SCRATCHPAD.md                 # Session log and milestone tracker
└── GEMINI.md                     # Project context for AI pair-programming
```

---

## Navigation

| Screen | How to get there |
|---|---|
| Welcome | App load |
| World Map | Press Play |
| Adventure | Walk Mi near a chest (arrow keys), or click a chest |
| Diagnosis | Reach the terminal node of any adventure |
| School Card | Click "→ Discover your course suggestions" |
| Back to Map | "Back to Map" button on school card |

**In-adventure controls:**
- `← Back` — go to the previous question (tag state is restored correctly)
- `✕ Map` — exit and return to the map at any point

---

## Key Design Decisions

**No framework.** React/Vue/Svelte all need a build pipeline. For a static GitHub Pages project, vanilla JS is the right call. The screen state machine (`showScreen()` + a single `state` object) handles everything cleanly. Full rationale in `DECISIONS.md`.

**Tag matching over GPT.** Course recommendations are computed client-side from static tag overlap. Zero API cost, zero latency, zero privacy risk — and fully auditable. The `?` tooltip on the school card exposes the mechanism to students.

**No server, no login.** `localStorage` persists discovered schools across sessions. There is no user account, no database, no backend.

---

## AI Disclosure

Built with [Claude Code](https://claude.ai/claude-code) (claude-sonnet-4-6) as a pair-programming partner. All AI-generated code and content was reviewed and approved by the human developer before each commit. Full session logs and contribution disclosures are in `SCRATCHPAD.md`.

This project follows [Minerva University's Student AI Guardrails](Guardrails%20Docs/). No student PII is collected or processed. All data is static and public.

---

*Minerva Pathfinder — Student Project, Spring 2026*
