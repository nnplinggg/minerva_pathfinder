# Gamified School Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-art gamified adventure where mascot "Mi" guides students through 5 choose-your-own-adventure stories — one per Minerva school — revealing courses on completion, with a final summary card.

**Architecture:** Single-page app with 5 named screen states managed in `app.js`. All data (adventures + courses) loaded once at startup by `data.js` and cached in memory. Discovered schools saved to `localStorage`. No build step, no framework — vanilla HTML/CSS/JS served via local HTTP server or GitHub Pages.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, `box-shadow` pixel art, `@keyframes`), ES6 JavaScript (fetch, modules via script tags), localStorage, Google Fonts (`Press Start 2P`).

> **Local dev note:** `fetch()` is blocked on `file://` protocol. Always run via a local server:
> ```bash
> python3 -m http.server 8000
> # then open http://localhost:8000
> ```

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `data/adventures.json` | Create | All 5 school story trees (20 nodes) |
| `data/courses.json` | Place (user-provided) | Course entries per school |
| `js/data.js` | Create | Load + cache JSON, expose `getAdventure()` / `getCourses()` |
| `index.html` | Rewrite | All 5 screen containers (hidden/shown by JS) |
| `css/styles.css` | Extend | Game UI, pixel art mascot, animations, school colors |
| `js/app.js` | Rewrite | State machine + all render functions |

---

## Task 1: Create `data/adventures.json`

**Files:**
- Create: `data/adventures.json`

- [ ] **Step 1: Create the data directory and adventures file**

```bash
mkdir -p data
```

- [ ] **Step 2: Write `data/adventures.json` with all 5 school story trees**

```json
[
  {
    "id": "ah-start",
    "school": "arts-humanities",
    "text": "Mi arrives at a colorful gallery wall covered in ancient symbols, poetry, and art from dozens of cultures. What do you explore first?",
    "choices": [
      { "label": "Decode the ancient symbols", "next": "ah-2a" },
      { "label": "Write a poem about what you see", "next": "ah-2b" }
    ]
  },
  {
    "id": "ah-2a",
    "school": "arts-humanities",
    "text": "The symbols form a philosophical argument about how humans perceive beauty. How do you respond?",
    "choices": [
      { "label": "Challenge it with your own theory", "next": "ah-end" },
      { "label": "Sketch it as a visual argument", "next": "ah-end" }
    ]
  },
  {
    "id": "ah-2b",
    "school": "arts-humanities",
    "text": "Your poem sparks a debate about storytelling across cultures. What do you do?",
    "choices": [
      { "label": "Compare narratives from different traditions", "next": "ah-end" },
      { "label": "Explore how music shapes emotion", "next": "ah-end" }
    ]
  },
  {
    "id": "ah-end",
    "school": "arts-humanities",
    "text": "Mi cheers! You've uncovered the heart of Arts & Humanities — a school where ideas, creativity, and culture collide.",
    "unlocks": "arts-humanities"
  },
  {
    "id": "ss-start",
    "school": "social-sciences",
    "text": "Mi lands in a bustling city square where people are loudly debating a new policy. What do you do?",
    "choices": [
      { "label": "Survey the crowd about their opinions", "next": "ss-2a" },
      { "label": "Study the historical patterns behind the debate", "next": "ss-2b" }
    ]
  },
  {
    "id": "ss-2a",
    "school": "social-sciences",
    "text": "The survey data reveals surprising divides along economic lines. How do you dig deeper?",
    "choices": [
      { "label": "Build a model to predict future trends", "next": "ss-end" },
      { "label": "Interview community leaders for context", "next": "ss-end" }
    ]
  },
  {
    "id": "ss-2b",
    "school": "social-sciences",
    "text": "History shows this argument has repeated for centuries. What's your next move?",
    "choices": [
      { "label": "Map the economic forces driving the cycle", "next": "ss-end" },
      { "label": "Design a policy experiment to test a solution", "next": "ss-end" }
    ]
  },
  {
    "id": "ss-end",
    "school": "social-sciences",
    "text": "Mi does a happy dance! You've found Social Sciences — where data, history, and human behavior meet.",
    "unlocks": "social-sciences"
  },
  {
    "id": "cs-start",
    "school": "computational-sciences",
    "text": "Mi enters a glowing server room. Screens flicker with mysterious data patterns and half-finished code. What do you do?",
    "choices": [
      { "label": "Debug the anomaly in the data stream", "next": "cs-2a" },
      { "label": "Visualize the data to find hidden structure", "next": "cs-2b" }
    ]
  },
  {
    "id": "cs-2a",
    "school": "computational-sciences",
    "text": "The bug leads to an unexpected but elegant algorithm. What do you do with it?",
    "choices": [
      { "label": "Prove mathematically why it works", "next": "cs-end" },
      { "label": "Build a system that uses it at scale", "next": "cs-end" }
    ]
  },
  {
    "id": "cs-2b",
    "school": "computational-sciences",
    "text": "The visualization reveals a pattern no one has noticed before. What next?",
    "choices": [
      { "label": "Write a formal proof of the pattern", "next": "cs-end" },
      { "label": "Train a model to predict where it appears next", "next": "cs-end" }
    ]
  },
  {
    "id": "cs-end",
    "school": "computational-sciences",
    "text": "Mi blinks in awe! You've discovered Computational Sciences — the school of systems, logic, and elegant solutions.",
    "unlocks": "computational-sciences"
  },
  {
    "id": "ns-start",
    "school": "natural-sciences",
    "text": "Mi discovers a strange glowing specimen in a jungle clearing. No one has ever seen anything like it. What do you do?",
    "choices": [
      { "label": "Collect samples and run experiments", "next": "ns-2a" },
      { "label": "Observe its behavior without disturbing it", "next": "ns-2b" }
    ]
  },
  {
    "id": "ns-2a",
    "school": "natural-sciences",
    "text": "The samples show unusual chemical properties unlike anything in the literature. What next?",
    "choices": [
      { "label": "Model the molecular structure", "next": "ns-end" },
      { "label": "Test whether the compound has medical uses", "next": "ns-end" }
    ]
  },
  {
    "id": "ns-2b",
    "school": "natural-sciences",
    "text": "You notice it responds to temperature changes in a totally unexpected way. What do you explore?",
    "choices": [
      { "label": "Study how it evolved this adaptation", "next": "ns-end" },
      { "label": "Measure what happens to the ecosystem if it disappears", "next": "ns-end" }
    ]
  },
  {
    "id": "ns-end",
    "school": "natural-sciences",
    "text": "Mi leaps with excitement! You've unlocked Natural Sciences — where curiosity and the scientific method meet the unknown.",
    "unlocks": "natural-sciences"
  },
  {
    "id": "biz-start",
    "school": "business",
    "text": "Mi walks into a student startup pitch competition. Three teams are presenting wildly different ideas. What do you do?",
    "choices": [
      { "label": "Evaluate which business model is most viable", "next": "biz-2a" },
      { "label": "Spot the gap in the market none of them see", "next": "biz-2b" }
    ]
  },
  {
    "id": "biz-2a",
    "school": "business",
    "text": "One team's financials don't add up — their unit economics are off. How do you respond?",
    "choices": [
      { "label": "Build a revised model showing a better strategy", "next": "biz-end" },
      { "label": "Research comparable companies to benchmark", "next": "biz-end" }
    ]
  },
  {
    "id": "biz-2b",
    "school": "business",
    "text": "You see a clear underserved customer segment all three teams are ignoring. What do you do?",
    "choices": [
      { "label": "Sketch a go-to-market strategy on the spot", "next": "biz-end" },
      { "label": "Identify exactly who the overlooked customer is", "next": "biz-end" }
    ]
  },
  {
    "id": "biz-end",
    "school": "business",
    "text": "Mi claps! You've found the Business school — where strategy, entrepreneurship, and global markets come alive.",
    "unlocks": "business"
  }
]
```

- [ ] **Step 3: Place your `courses.json` in the `data/` folder**

Move or copy your hand-curated file to `data/courses.json`. Verify the schema matches:
```json
[
  {
    "id": "ah-example",
    "school": "arts-humanities",
    "title": "Course Title",
    "description": "One or two sentence description."
  }
]
```
Valid `school` values: `"arts-humanities"`, `"social-sciences"`, `"computational-sciences"`, `"natural-sciences"`, `"business"`.

- [ ] **Step 4: Commit**

```bash
git add data/
git commit -m "feat: add adventure story trees and courses data"
```

---

## Task 2: Create `js/data.js`

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: Write `js/data.js`**

```js
// js/data.js — loads and caches all JSON data at startup

const _cache = {};

async function _load(file) {
  if (_cache[file]) return _cache[file];
  const res = await fetch(`data/${file}.json`);
  if (!res.ok) throw new Error(`Failed to load data/${file}.json`);
  _cache[file] = await res.json();
  return _cache[file];
}

async function getAdventure(schoolId) {
  const all = await _load('adventures');
  return all.filter(node => node.school === schoolId);
}

async function getCourses(schoolId) {
  const all = await _load('courses');
  return all.filter(course => course.school === schoolId);
}
```

- [ ] **Step 2: Verify in browser console**

Start the server: `python3 -m http.server 8000` and open `http://localhost:8000`.

In browser DevTools → Console:
```js
// Paste temporarily to test (remove after):
fetch('data/adventures.json').then(r => r.json()).then(d => console.log('adventures loaded:', d.length, 'nodes'));
fetch('data/courses.json').then(r => r.json()).then(d => console.log('courses loaded:', d.length, 'entries'));
```
Expected output:
```
adventures loaded: 20 nodes
courses loaded: [N] entries   ← whatever count your courses.json has
```

- [ ] **Step 3: Commit**

```bash
git add js/data.js
git commit -m "feat: add data.js loader with getAdventure and getCourses"
```

---

## Task 3: Rewrite `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html` with all screen containers**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minerva Pathfinder</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

  <!-- SCREEN: Welcome -->
  <div id="screen-welcome" class="screen active">
    <div class="screen-inner">
      <div class="mascot" id="mascot"></div>
      <h1 class="pixel-title">Minerva<br>Pathfinder</h1>
      <p class="pixel-sub">Meet Mi — your guide to Minerva's 5 schools.</p>
      <button class="btn-pixel" id="btn-start">Start Adventure</button>
    </div>
  </div>

  <!-- SCREEN: World Map -->
  <div id="screen-map" class="screen">
    <div class="screen-inner">
      <div class="mascot mascot--idle" id="mascot-map"></div>
      <h2 class="pixel-title pixel-title--sm">Choose a School</h2>
      <div class="school-grid" id="school-grid">
        <button class="zone-tile" data-school="arts-humanities">
          <span class="zone-icon">🎨</span>
          <span class="zone-name">Arts &amp; Humanities</span>
          <span class="zone-lock" id="lock-arts-humanities">🔒</span>
        </button>
        <button class="zone-tile" data-school="social-sciences">
          <span class="zone-icon">🌍</span>
          <span class="zone-name">Social Sciences</span>
          <span class="zone-lock" id="lock-social-sciences">🔒</span>
        </button>
        <button class="zone-tile" data-school="computational-sciences">
          <span class="zone-icon">⚡</span>
          <span class="zone-name">Computational Sciences</span>
          <span class="zone-lock" id="lock-computational-sciences">🔒</span>
        </button>
        <button class="zone-tile" data-school="natural-sciences">
          <span class="zone-icon">🌿</span>
          <span class="zone-name">Natural Sciences</span>
          <span class="zone-lock" id="lock-natural-sciences">🔒</span>
        </button>
        <button class="zone-tile" data-school="business">
          <span class="zone-icon">📈</span>
          <span class="zone-name">Business</span>
          <span class="zone-lock" id="lock-business">🔒</span>
        </button>
      </div>
    </div>
  </div>

  <!-- SCREEN: Adventure -->
  <div id="screen-adventure" class="screen">
    <div class="screen-inner adventure-inner">
      <div class="mascot" id="mascot-adventure"></div>
      <div class="story-box">
        <p class="story-text" id="story-text"></p>
      </div>
      <div class="choices" id="choices"></div>
    </div>
  </div>

  <!-- SCREEN: School Card -->
  <div id="screen-school-card" class="screen">
    <div class="screen-inner">
      <div class="mascot mascot--celebrate" id="mascot-card"></div>
      <div class="school-card card">
        <h2 class="school-card__name" id="card-name"></h2>
        <p class="school-card__desc" id="card-desc"></p>
        <h3 class="school-card__courses-title">Courses you might take:</h3>
        <ul class="course-list" id="course-list"></ul>
      </div>
      <button class="btn-pixel btn-pixel--secondary" id="btn-return-map">Back to Map</button>
    </div>
  </div>

  <!-- SCREEN: Summary -->
  <div id="screen-summary" class="screen">
    <div class="screen-inner">
      <div class="mascot mascot--celebrate"></div>
      <h1 class="pixel-title pixel-title--sm">You discovered<br>all of Minerva!</h1>
      <div class="badge-row" id="badge-row"></div>
      <div class="summary-blurb card" id="summary-blurb"></div>
      <p class="screenshot-cue">📸 Screenshot this to share your path!</p>
    </div>
  </div>

  <footer>
    <div class="container footer-content">
      <div class="copyright">&copy; 2026 Minerva University Student Project</div>
      <div class="ai-disclosure">
        <span class="badge">AI-Assisted</span>
        Developed with Claude Code &amp; Minerva AI Framework
      </div>
    </div>
  </footer>

  <script src="js/data.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify screens exist in browser**

Open `http://localhost:8000`. You should see a blank page with the footer (only the welcome screen is visible, and it has no styles yet — that's fine). No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add all 5 screen containers to index.html"
```

---

## Task 4: Add game styles to `css/styles.css`

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Append game styles to the end of `css/styles.css`**

```css
/* ============================================================
   GAME UI — Minerva Pathfinder
   ============================================================ */

/* School accent colors */
:root {
  --school-ah:  #b05ec4;   /* Arts & Humanities — purple */
  --school-ss:  #2e86c1;   /* Social Sciences — blue */
  --school-cs:  #1a9e6e;   /* Computational Sciences — teal */
  --school-ns:  #27ae60;   /* Natural Sciences — green */
  --school-biz: #e67e22;   /* Business — orange */
  --pixel-font: 'Press Start 2P', monospace;
}

/* Screen system */
.screen { display: none; min-height: 100vh; }
.screen.active { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.screen-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  max-width: 600px;
  width: 100%;
}

/* Pixel typography */
.pixel-title {
  font-family: var(--pixel-font);
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: center;
  color: var(--mu-obsidian);
}
.pixel-title--sm { font-size: 0.85rem; }
.pixel-sub {
  font-family: var(--pixel-font);
  font-size: 0.55rem;
  text-align: center;
  color: var(--mu-slate);
  line-height: 1.8;
}

/* Pixel buttons */
.btn-pixel {
  font-family: var(--pixel-font);
  font-size: 0.6rem;
  background: var(--mu-obsidian);
  color: var(--mu-bone);
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  image-rendering: pixelated;
  box-shadow: 4px 4px 0 var(--mu-clay);
  transition: transform 0.1s, box-shadow 0.1s;
}
.btn-pixel:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--mu-clay); }
.btn-pixel:active { transform: translate(4px, 4px); box-shadow: none; }
.btn-pixel--secondary {
  background: var(--mu-bone);
  color: var(--mu-obsidian);
  box-shadow: 4px 4px 0 var(--mu-charcoal);
}

/* Mascot — CSS pixel art "Mi" (16x16 sprite via box-shadow) */
.mascot {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  transform: scale(6);
  margin: 2rem 0;
  /* Body pixel: a small round head + body */
  background: var(--mu-goldenrod);
  border-radius: 2px;
  box-shadow:
    /* head row 1 */
    0px -16px 0 var(--mu-goldenrod),
    16px -16px 0 var(--mu-goldenrod),
    -16px -16px 0 var(--mu-goldenrod),
    /* eyes */
    -4px -12px 0 var(--mu-obsidian),
    4px -12px 0 var(--mu-obsidian),
    /* smile */
    -4px -8px 0 var(--mu-obsidian),
    0px -6px 0 var(--mu-obsidian),
    4px -8px 0 var(--mu-obsidian),
    /* body */
    0px 0px 0 var(--mu-clay),
    -8px 8px 0 var(--mu-clay),
    8px 8px 0 var(--mu-clay),
    /* legs */
    -8px 16px 0 var(--mu-charcoal),
    8px 16px 0 var(--mu-charcoal);
}

/* Mascot animations */
@keyframes idle-bounce {
  0%, 100% { transform: scale(6) translateY(0); }
  50% { transform: scale(6) translateY(-3px); }
}
@keyframes celebrate {
  0%, 100% { transform: scale(6) rotate(0deg); }
  25% { transform: scale(6) rotate(-8deg); }
  75% { transform: scale(6) rotate(8deg); }
}
.mascot--idle { animation: idle-bounce 1.2s ease-in-out infinite; }
.mascot--celebrate { animation: celebrate 0.4s ease-in-out 3; }

/* World map school grid */
.school-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}
@media (max-width: 480px) {
  .school-grid { grid-template-columns: 1fr; }
}
.zone-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.2rem 0.8rem;
  background: var(--mu-white);
  border: 3px solid var(--mu-obsidian);
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--mu-charcoal);
  transition: transform 0.1s, box-shadow 0.1s;
}
.zone-tile:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--mu-charcoal); }
.zone-tile.discovered { border-color: var(--mu-goldenrod); background: #fffbe6; }
.zone-icon { font-size: 2rem; }
.zone-name {
  font-family: var(--pixel-font);
  font-size: 0.4rem;
  text-align: center;
  line-height: 1.8;
  color: var(--mu-charcoal);
}
.zone-lock { font-size: 1rem; }

/* Adventure screen */
.adventure-inner { justify-content: flex-start; padding-top: 3rem; }
.story-box {
  background: var(--mu-white);
  border: 3px solid var(--mu-obsidian);
  padding: 1.5rem;
  width: 100%;
  box-shadow: 4px 4px 0 var(--mu-charcoal);
}
.story-text {
  font-family: var(--pixel-font);
  font-size: 0.55rem;
  line-height: 2;
  color: var(--mu-obsidian);
  margin: 0;
}
.choices {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}
.choice-btn {
  font-family: var(--pixel-font);
  font-size: 0.5rem;
  background: var(--mu-bone);
  color: var(--mu-obsidian);
  border: 2px solid var(--mu-obsidian);
  padding: 0.9rem 1rem;
  cursor: pointer;
  text-align: left;
  line-height: 1.8;
  box-shadow: 3px 3px 0 var(--mu-charcoal);
  transition: transform 0.1s, box-shadow 0.1s;
}
.choice-btn:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--mu-charcoal); background: var(--mu-goldenrod); }

/* School card screen */
.school-card {
  width: 100%;
  border: 3px solid var(--mu-obsidian);
  box-shadow: 6px 6px 0 var(--mu-charcoal);
}
.school-card__name {
  font-family: var(--pixel-font);
  font-size: 0.7rem;
  color: var(--mu-clay);
  margin-bottom: 1rem;
}
.school-card__desc {
  font-size: 0.95rem;
  color: var(--mu-charcoal);
  margin-bottom: 1.25rem;
}
.school-card__courses-title {
  font-family: var(--pixel-font);
  font-size: 0.45rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  color: var(--mu-slate);
}
.course-list { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.course-item { border-left: 3px solid var(--mu-goldenrod); padding-left: 0.75rem; }
.course-item__title {
  font-family: var(--pixel-font);
  font-size: 0.45rem;
  color: var(--mu-obsidian);
  margin-bottom: 0.3rem;
}
.course-item__desc { font-size: 0.85rem; color: var(--mu-slate); margin: 0; }

/* Summary screen */
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.school-badge {
  font-family: var(--pixel-font);
  font-size: 0.4rem;
  background: var(--mu-goldenrod);
  color: var(--mu-obsidian);
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--mu-obsidian);
  box-shadow: 2px 2px 0 var(--mu-charcoal);
}
.summary-blurb {
  width: 100%;
  border: 3px solid var(--mu-goldenrod);
  box-shadow: 4px 4px 0 var(--mu-clay);
  text-align: center;
}
.summary-blurb p {
  font-family: var(--pixel-font);
  font-size: 0.5rem;
  line-height: 2;
  color: var(--mu-charcoal);
  margin: 0;
}
.screenshot-cue {
  font-family: var(--pixel-font);
  font-size: 0.45rem;
  color: var(--mu-slate);
  text-align: center;
  animation: idle-bounce 2s ease-in-out infinite;
}

/* Footer override for game pages */
footer { margin-top: 0; }
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
```

- [ ] **Step 2: Verify styles load**

Reload `http://localhost:8000`. The welcome screen should now show with a dark background feel — the `.screen.active` class makes it fill the viewport. No console errors.

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat: add pixel art game styles, mascot Mi, and screen layout"
```

---

## Task 5: Build `js/app.js` — state machine + welcome screen

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Replace `js/app.js` with the state machine and welcome screen**

```js
// js/app.js — Minerva Pathfinder state machine

// ============================================================
// Constants
// ============================================================

const SCHOOLS = {
  'arts-humanities':        { name: 'Arts & Humanities',       icon: '🎨' },
  'social-sciences':        { name: 'Social Sciences',          icon: '🌍' },
  'computational-sciences': { name: 'Computational Sciences',   icon: '⚡' },
  'natural-sciences':       { name: 'Natural Sciences',         icon: '🌿' },
  'business':               { name: 'Business',                 icon: '📈' },
};

const SCHOOL_DESCS = {
  'arts-humanities':        'Explore human expression across culture, history, philosophy, and the arts. Learn to think critically about how meaning is made — and how to make it yourself.',
  'social-sciences':        'Understand how societies, economies, and political systems work. Use data, theory, and fieldwork to tackle the world\'s most complex human challenges.',
  'computational-sciences': 'Master the mathematical and computational foundations that power technology. From formal logic to machine learning, build systems that scale.',
  'natural-sciences':       'Investigate the living and physical world through rigorous experimentation. Develop scientific intuition and the skills to answer questions no one has answered yet.',
  'business':               'Learn how organizations create and capture value. From strategy to entrepreneurship, develop the judgment to lead in a complex global economy.',
};

const SUMMARY_BLURBS = {
  'arts-humanities':        'You led with curiosity and creativity — your mind naturally seeks meaning in the world. Arts & Humanities might be your intellectual home at Minerva.',
  'social-sciences':        'You gravitated toward people, systems, and society first. Social Sciences could be your foundation for changing the world.',
  'computational-sciences': 'You dove into logic and structure first — a systems thinker at heart. Computational Sciences might be your home base at Minerva.',
  'natural-sciences':       'You started by asking "how does this work?" — the instinct of a natural scientist. Minerva\'s Natural Sciences school is built for minds like yours.',
  'business':               'You spotted the opportunity and thought about strategy first. The Business school at Minerva will sharpen that instinct into a superpower.',
};

const LS_KEY = 'minerva-pathfinder-discovered';

// ============================================================
// State
// ============================================================

const state = {
  screen: 'welcome',         // current screen name
  discovered: [],            // array of unlocked school IDs (order matters — first = primary)
  activeSchool: null,        // school ID currently being adventured
  adventureNodes: [],        // all nodes for the active school
  currentNodeId: null,       // current story node ID
};

// ============================================================
// localStorage helpers
// ============================================================

function loadDiscovered() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDiscovered(discovered) {
  localStorage.setItem(LS_KEY, JSON.stringify(discovered));
}

// ============================================================
// Screen helpers
// ============================================================

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  state.screen = name;
}

// ============================================================
// Welcome screen
// ============================================================

function renderWelcome() {
  showScreen('welcome');
  document.getElementById('btn-start').onclick = () => renderMap();
}

// ============================================================
// Init
// ============================================================

async function init() {
  state.discovered = loadDiscovered();
  renderWelcome();
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 2: Verify welcome screen in browser**

Reload `http://localhost:8000`. You should see:
- Pixel mascot "Mi" centered on screen
- "Minerva Pathfinder" title in pixel font
- "Start Adventure" button
- Clicking the button does nothing yet (renderMap not defined) — check console shows no errors except possibly `renderMap is not defined`

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: app.js state machine with welcome screen and localStorage helpers"
```

---

## Task 6: Add world map screen to `js/app.js`

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add `renderMap()` before the `init` function**

```js
// ============================================================
// World map screen
// ============================================================

function renderMap() {
  showScreen('map');
  // Update lock/stamp icons
  Object.keys(SCHOOLS).forEach(id => {
    const lockEl = document.getElementById(`lock-${id}`);
    const tileEl = document.querySelector(`.zone-tile[data-school="${id}"]`);
    if (state.discovered.includes(id)) {
      lockEl.textContent = '✅';
      tileEl.classList.add('discovered');
    } else {
      lockEl.textContent = '🔒';
      tileEl.classList.remove('discovered');
    }
  });
  // Attach click handlers
  document.querySelectorAll('.zone-tile').forEach(tile => {
    tile.onclick = () => startAdventure(tile.dataset.school);
  });
}
```

- [ ] **Step 2: Verify map screen**

Reload and click "Start Adventure". You should see:
- 5 school zone tiles in a 2-column grid
- All tiles show 🔒
- Clicking a tile does nothing yet (startAdventure not defined)

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: world map screen with school zone tiles and lock icons"
```

---

## Task 7: Add adventure engine to `js/app.js`

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add `startAdventure()` and `renderAdventureNode()` before `init`**

```js
// ============================================================
// Adventure screen
// ============================================================

async function startAdventure(schoolId) {
  state.activeSchool = schoolId;
  state.adventureNodes = await getAdventure(schoolId);
  // First node in the filtered array is always the start node
  renderAdventureNode(state.adventureNodes[0].id);
}

function renderAdventureNode(nodeId) {
  const node = state.adventureNodes.find(n => n.id === nodeId);
  if (!node) return;
  state.currentNodeId = nodeId;
  showScreen('adventure');

  document.getElementById('story-text').textContent = node.text;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  if (node.unlocks) {
    // Terminal node — unlock the school
    setTimeout(() => unlockSchool(node.unlocks), 1200);
    return;
  }

  node.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.label;
    btn.onclick = () => renderAdventureNode(choice.next);
    choicesEl.appendChild(btn);
  });
}
```

- [ ] **Step 2: Verify adventure flow**

Reload → Start Adventure → click any school tile. You should:
- See the adventure screen with story text
- See 2 choice buttons
- Be able to click through 3 nodes
- After the final node the screen briefly pauses (unlockSchool not defined yet)

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: adventure engine — story node traversal and choice rendering"
```

---

## Task 8: Add school card screen to `js/app.js`

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add `unlockSchool()` and `renderSchoolCard()` before `init`**

```js
// ============================================================
// School card screen
// ============================================================

async function unlockSchool(schoolId) {
  if (!state.discovered.includes(schoolId)) {
    state.discovered.push(schoolId);
    saveDiscovered(state.discovered);
  }
  await renderSchoolCard(schoolId);
}

async function renderSchoolCard(schoolId) {
  showScreen('school-card');
  document.getElementById('card-name').textContent = SCHOOLS[schoolId].name;
  document.getElementById('card-desc').textContent = SCHOOL_DESCS[schoolId];

  const courses = await getCourses(schoolId);
  const listEl = document.getElementById('course-list');
  listEl.innerHTML = '';
  courses.forEach(course => {
    const li = document.createElement('li');
    li.className = 'course-item';
    li.innerHTML = `
      <div class="course-item__title">${course.title}</div>
      <p class="course-item__desc">${course.description}</p>
    `;
    listEl.appendChild(li);
  });

  document.getElementById('btn-return-map').onclick = () => {
    if (state.discovered.length === 5) {
      renderSummary();
    } else {
      renderMap();
    }
  };
}
```

- [ ] **Step 2: Verify school card**

Complete an adventure for any school. You should see:
- School name and description
- List of courses from your `courses.json`
- "Back to Map" button
- Returning to map shows ✅ for the discovered school

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: school card screen with course list and unlock logic"
```

---

## Task 9: Add summary screen to `js/app.js`

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Add `renderSummary()` before `init`**

```js
// ============================================================
// Summary screen
// ============================================================

function renderSummary() {
  showScreen('summary');

  // Badge row — one badge per discovered school
  const badgeRow = document.getElementById('badge-row');
  badgeRow.innerHTML = '';
  state.discovered.forEach(id => {
    const badge = document.createElement('div');
    badge.className = 'school-badge';
    badge.textContent = `${SCHOOLS[id].icon} ${SCHOOLS[id].name}`;
    badgeRow.appendChild(badge);
  });

  // Personalized blurb based on first school discovered
  const firstSchool = state.discovered[0];
  const blurbEl = document.getElementById('summary-blurb');
  blurbEl.innerHTML = `<p>${SUMMARY_BLURBS[firstSchool]}</p>`;
}
```

- [ ] **Step 2: Verify full flow end-to-end**

Complete all 5 school adventures. After clicking "Back to Map" on the 5th school card, the summary screen should appear with:
- 5 school badges in a row
- A personalized blurb based on the first school you discovered
- "📸 Screenshot this to share your path!" cue

- [ ] **Step 3: Verify localStorage persistence**

After discovering 2+ schools, refresh the page. Click "Start Adventure" → the map should show ✅ on already-discovered schools. Confirm in DevTools → Application → localStorage key `minerva-pathfinder-discovered`.

- [ ] **Step 4: Commit**

```bash
git add js/app.js
git commit -m "feat: summary screen with school badges and personalized blurb"
```

---

## Task 10: Final polish + SCRATCHPAD update

**Files:**
- Modify: `SCRATCHPAD.md`
- Modify: `index.html` (title only)

- [ ] **Step 1: Update app title in `index.html`**

Change line 6:
```html
<title>Minerva Pathfinder</title>
```
(Already correct — verify it reads "Minerva Pathfinder", not the old placeholder.)

- [ ] **Step 2: Do a full walkthrough test**

Open `http://localhost:8000` in an incognito window (clears localStorage). Run through all 5 adventures in different orders. Verify:
- [ ] Welcome screen renders with mascot and button
- [ ] Map shows all 5 tiles locked
- [ ] Each adventure runs 3 nodes → terminal → school card
- [ ] School card shows name, description, and courses
- [ ] Map shows ✅ after returning
- [ ] After 5th school → summary appears with 5 badges + blurb
- [ ] Refresh mid-session → progress preserved

- [ ] **Step 3: Mark M2 and M3 complete in `SCRATCHPAD.md`**

Update the milestone checkboxes for M2 and M3:
```markdown
### M2 — Blueprint & Data Structure
- [x] Feature specifications finalized
- [x] Data model (JSON structures) defined for courses
- [x] Initial static data files created

### M3 — Interface & Interaction
- [x] Searchable course curriculum by interest area
- [x] Adventure-based school discovery (gamified)
- [x] Mobile-first responsive UI
```

Also add a session log entry under `## Session Log`:
```markdown
### 2026-04-10: M2 + M3 Implementation

**AI Tool(s) Used**: Claude Code (claude-sonnet-4-6)
**Purpose**: Full implementation of gamified school explorer — pixel mascot Mi, 5 CYOA adventures, courses display, world map, summary card.
**Modifications & Verification**: Built 6 files from spec. Manual browser walkthrough of all 5 school paths. localStorage persistence verified.
**Learning Reflection**: Designing a state machine in vanilla JS without a framework required explicit screen management — each screen is a distinct render function.
**Session Link/Context**: Gamification design spec at docs/superpowers/specs/2026-04-10-gamification-design.md
```

- [ ] **Step 4: Final commit and push**

```bash
git add SCRATCHPAD.md index.html
git commit -m "feat: complete gamified school explorer — Mi mascot, 5 adventures, courses, summary"
git push origin main
```

After pushing, your live site at `https://nnplinggg.github.io/admissions1` will update within ~2 minutes.
