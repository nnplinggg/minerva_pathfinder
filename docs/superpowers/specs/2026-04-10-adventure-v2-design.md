# Adventure V2 — Deeper Branching + Interest-Based Course Matching

**Date**: 2026-04-10
**Project**: Minerva Pathfinder
**Feature**: Rewrite adventure system with deeper branching, multiple endings per school, and tag-based course matching

---

## Overview

Replace the current flat 3-step adventure trees (2 choices/node, all paths converge to 1 ending) with richer 3-decision adventures (2–4 choices/node, 2–3 distinct endings per school). Each choice accumulates interest tags. The ending node adds required tags. Courses shown = those matching ≥ 2 tags from the accumulated set. Falls back to all school courses if < 3 matches.

---

## User Experience

1. Student enters a school adventure from the world map.
2. Mi presents a scenario — student makes 3 choices.
3. Each choice silently adds 2–3 interest tags to their profile.
4. The 3rd choice determines which ending they reach (2–3 endings per school).
5. School card appears showing: school name, description, and **courses filtered by their interest tags**.
6. If < 3 courses match, all courses for that school are shown (fallback).

---

## Adventure Tree Structure (per school)

```
start (3 choices)
  ├─ branch-A (3 choices)
  │    ├─ cluster-1 (2–3 choices) ──→ end-X
  │    └─ cluster-2 (2–3 choices) ──→ end-Y
  ├─ branch-B (3 choices)
  │    ├─ cluster-1 (shared)      ──→ end-X
  │    └─ cluster-3 (2–3 choices) ──→ end-Z
  └─ branch-C (3 choices)
       ├─ cluster-2 (shared)      ──→ end-Y
       └─ cluster-3 (shared)      ──→ end-Z
```

- **Nodes per school**: ~7–9 (1 start + 3 branches + 3 clusters + 2–3 endings)
- **Total nodes across 5 schools**: ~40–45
- **Shared cluster nodes**: clusters are reachable from multiple branches — reduces writing burden while preserving branching feel
- **Choices per node**: 2–4 (author decides per node, schema supports any count)

---

## Data Schemas

### adventures.json — Decision Node

```json
{
  "id": "cs-start",
  "school": "computational-sciences",
  "text": "Story text here.",
  "choices": [
    { "label": "Choice label", "next": "cs-branch-a", "tags": ["algorithms", "logic"] },
    { "label": "Choice label", "next": "cs-branch-b", "tags": ["data-science", "machine-learning"] },
    { "label": "Choice label", "next": "cs-branch-c", "tags": ["mathematics", "proof-writing"] }
  ]
}
```

### adventures.json — Terminal (Ending) Node

```json
{
  "id": "cs-end-X",
  "school": "computational-sciences",
  "text": "Mi celebrates! Ending story text here.",
  "unlocks": "computational-sciences",
  "requiredTags": ["AI", "neural-networks"]
}
```

### courses.json — Restored with Tags

```json
{
  "id": "CS110",
  "school": "computational-sciences",
  "title": "Machine Learning",
  "description": "Course description.",
  "tags": ["machine-learning", "AI", "algorithms", "data-science"]
}
```

---

## Tag System

Tags come from the original `minerva_courses.json` source file. Valid tags per school:

### arts-humanities
`aesthetics`, `anthropology`, `applied-ethics`, `art-analysis`, `art-history`, `artistic-expression`, `arts`, `bioethics`, `civil-disobedience`, `close-reading`, `communication`, `comparative-history`, `constitutional-theory`, `creative-expression`, `creative-writing`, `cross-cultural`, `cultural-studies`, `cultural-theory`, `data-ethics`, `democracy`, `design`, `design-thinking`, `digital-history`, `digital-humanities`, `dilemmas`, `empire`, `environment`, `environmental-ethics`, `ethics`, `evidence`, `feminist-ethics`, `film`, `form`, `gender`, `global`, `global-justice`, `global-perspectives`, `globalization`, `historical-analysis`, `historiography`, `history`, `human-rights`, `identity`, `ideology`, `institutions`, `interdisciplinary`, `international-law`, `justice`, `labor`, `law`, `literary-criticism`, `literature`, `material-culture`, `media`, `memory`, `methodology`, `migration`, `moral-philosophy`, `museums`, `music`, `narrative`, `nationalism`, `normative-ethics`, `persuasion`, `philosophy`, `policy`, `political-philosophy`, `politics`, `positionality`, `propaganda`, `public-history`, `social-change`, `social-justice`, `social-movements`, `socioeconomics`, `sociology`, `structure`, `sustainability`, `technology`, `visual-arts`

### social-sciences
`AI`, `Nash-equilibrium`, `behavior-change`, `behavioral-economics`, `behavioral-science`, `brain`, `causal-inference`, `central-banking`, `cognition`, `cognitive-science`, `comparative-law`, `comparative-politics`, `constitution-making`, `constitutional-law`, `corruption`, `creativity`, `decision-making`, `democracy`, `development-economics`, `econometrics`, `economic-policy`, `economics`, `education`, `emotion`, `game-theory`, `global-development`, `governance`, `health-psychology`, `healthcare`, `inequality`, `institutions`, `international-relations`, `international-trade`, `macroeconomics`, `market-failures`, `markets`, `memory`, `mental-health`, `microeconomics`, `motivation`, `neural-computation`, `neuroscience`, `nudging`, `persuasion`, `policy`, `political-science`, `political-systems`, `political-theory`, `psychology`, `public-policy`, `regression`, `research-methods`, `rule-of-law`, `social-change`, `social-movements`, `social-psychology`, `social-systems`, `state-formation`, `statistics`, `sustainability`

### computational-sciences
`Bayesian`, `Fourier-analysis`, `Markov-chains`, `Monte-Carlo`, `NP-hardness`, `Turing-machines`, `abstract-algebra`, `algorithms`, `applied-math`, `artificial-intelligence`, `automata`, `calculus`, `causal-inference`, `classification`, `clustering`, `complex-systems`, `complexity-theory`, `computational-math`, `computational-thinking`, `data-science`, `data-structures`, `differential-equations`, `dynamic-programming`, `dynamical-systems`, `formal-languages`, `hashing`, `inference`, `linear-algebra`, `linear-programming`, `logic`, `logic-programming`, `machine-learning`, `mathematics`, `modeling`, `network-analysis`, `network-theory`, `neural-networks`, `numerical-methods`, `operations-research`, `optimization`, `probabilistic-modeling`, `probability`, `proof-writing`, `python`, `regression`, `robotics`, `simulation`, `software-engineering`, `statistics`, `system-design`, `theory-of-computation`, `web-development`

### natural-sciences
`analytical-chemistry`, `applied-physics`, `atmospheric-science`, `biochemistry`, `biodiversity`, `bioethics`, `biology`, `biomedical`, `biophysics`, `biotechnology`, `cell-biology`, `chemistry`, `climate`, `climate-change`, `climate-modeling`, `computation`, `cosmology`, `data-analysis`, `ecology`, `electromagnetism`, `entropy`, `evolution`, `fluid-dynamics`, `gene-engineering`, `genetics`, `genomics`, `geology`, `gravity`, `information-theory`, `life-sciences`, `materials-science`, `molecular-biology`, `natural-selection`, `organic-chemistry`, `physics`, `planetary-science`, `quantum`, `quantum-mechanics`, `relativity`, `research-methods`, `statistics`, `sustainability`, `theoretical-physics`, `thermodynamics`

### business
`accounting`, `brand-management`, `brand-strategy`, `branding`, `budgeting`, `business-strategy`, `capital-allocation`, `capital-structure`, `consumer-behavior`, `consumer-psychology`, `corporate-finance`, `entrepreneurship`, `finance`, `financial-modeling`, `financial-planning`, `forecasting`, `fundraising`, `geopolitics`, `global-business`, `go-to-market`, `growth-strategy`, `hedging`, `innovation`, `investment`, `market-entry`, `market-research`, `marketing`, `operations`, `optimization`, `organizational-design`, `private-equity`, `product-analytics`, `product-design`, `product-development`, `risk-management`, `service-design`, `startup`, `strategy`, `supply-chain`, `systems-design`, `user-research`, `valuation`, `value-creation`, `venture-capital`

---

## Files Changed

| File | Action | What changes |
|---|---|---|
| `data/adventures.json` | **Author rewrites** | New story text, deeper tree, `tags` on choices, `requiredTags` on endings |
| `data/courses.json` | Transform script | Add `tags` field back from original `minerva_courses.json` |
| `data/adventures-template.json` | Create | Blank template with structure pre-built, `✏️` markers for author to fill |
| `docs/adventure-writing-guide.md` | Create | Lists all valid tags per school to help author write choices |
| `js/data.js` | Extend | Add `getMatchedCourses(schoolId, accumulatedTags)` |
| `js/app.js` | Extend | Add `state.accumulatedTags`, accumulate tags in `renderAdventureNode`, pass to `getMatchedCourses` |

---

## Matching Logic (`data.js`)

```js
async function getMatchedCourses(schoolId, accumulatedTags) {
  const all = await _load('courses');
  const schoolCourses = all.filter(c => c.school === schoolId);
  const matched = schoolCourses.filter(c =>
    c.tags.filter(t => accumulatedTags.includes(t)).length >= 2
  );
  return matched.length >= 3 ? matched : schoolCourses;
}
```

`accumulatedTags` = all `tags` from every choice the user made + `requiredTags` from the terminal node.

---

## State Changes (`app.js`)

Add to `state` object:
```js
accumulatedTags: [],   // tags collected across all choices in current adventure
```

Reset on `startAdventure()`. Accumulate in `renderAdventureNode()` when a choice is clicked:
```js
state.accumulatedTags.push(...choice.tags);
```

On terminal node, merge `requiredTags` before calling course match:
```js
const allTags = [...state.accumulatedTags, ...(node.requiredTags || [])];
await renderSchoolCard(node.unlocks, allTags);
```

---

## Adventure Writing Guide

The file `docs/adventure-writing-guide.md` will be created with:
- Tone guidelines (mix of realistic Minerva context + imaginative pixel world)
- Node structure explanation (start → branch → cluster → ending)
- Tag reference list per school (copy-paste friendly)
- Example filled-out adventure for 1 school to model from
- Tips: use 2–3 tags per choice, make tags specific enough to differentiate

---

## Out of Scope

- Changing the world map, summary screen, or localStorage logic
- AI-generated story content at runtime
- User-facing tag display (tags are invisible to students)
- Analytics on which paths are most popular
