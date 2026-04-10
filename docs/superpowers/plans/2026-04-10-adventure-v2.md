# Adventure V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the adventure system to 3-level branching with tag-based interest matching so course recommendations reflect each student's choices.

**Architecture:** Each adventure choice accumulates interest tags; terminal nodes add `requiredTags`; `getMatchedCourses` filters courses where ≥ 2 of their tags appear in the student's accumulated set (falling back to all school courses if fewer than 3 match). The data layer gets a new function, the state machine gets `accumulatedTags`, and both JSON data files get a `tags` field.

**Tech Stack:** Vanilla ES6 JS, Python 3 (one-off data transform script), JSON, no build step.

---

### Task 1: Add tags to courses.json

**Files:**
- Create: `scripts/tag-courses.py`
- Modify: `data/courses.json`

- [ ] **Step 1: Create the scripts directory and tag-courses.py**

```python
# scripts/tag-courses.py
import json, os

COURSE_TAGS = {
    # Arts & Humanities
    'AH110': ['history', 'globalization', 'cross-cultural', 'comparative-history', 'migration'],
    'AH111': ['ethics', 'identity', 'justice', 'moral-philosophy', 'bioethics', 'feminist-ethics', 'applied-ethics'],
    'AH112': ['artistic-expression', 'visual-arts', 'literature', 'music', 'social-change', 'creative-expression'],
    'AH113': ['design', 'design-thinking', 'material-culture', 'technology', 'interdisciplinary'],
    'AH142': ['historiography', 'historical-analysis', 'evidence', 'methodology', 'digital-humanities'],
    'AH144': ['ethics', 'dilemmas', 'normative-ethics', 'applied-ethics', 'philosophy'],
    'AH146': ['art-analysis', 'literary-criticism', 'close-reading', 'aesthetics', 'form'],
    'AH152': ['comparative-history', 'sociology', 'cross-cultural', 'globalization', 'social-change'],
    'AH154': ['law', 'international-law', 'applied-ethics', 'global-justice', 'human-rights'],
    'AH156': ['socioeconomics', 'arts', 'literature', 'labor', 'institutions'],
    'AH162': ['public-history', 'history', 'digital-history', 'museums', 'methodology'],
    'AH164': ['political-philosophy', 'social-justice', 'democracy', 'justice', 'philosophy'],
    'AH166': ['artistic-expression', 'creative-writing', 'communication', 'narrative', 'media'],
    # Business
    'B110':  ['market-research', 'product-analytics', 'consumer-behavior', 'marketing', 'forecasting'],
    'B111':  ['financial-planning', 'budgeting', 'financial-modeling', 'forecasting', 'finance'],
    'B112':  ['entrepreneurship', 'business-strategy', 'global-business', 'operations', 'innovation'],
    'B113':  ['operations', 'systems-design', 'optimization', 'organizational-design', 'strategy'],
    'B144':  ['product-development', 'user-research', 'product-design', 'innovation', 'consumer-behavior'],
    'B145':  ['venture-capital', 'valuation', 'startup', 'entrepreneurship', 'fundraising'],
    'B146':  ['operations', 'supply-chain', 'business-strategy', 'organizational-design', 'risk-management'],
    'B154':  ['brand-strategy', 'brand-management', 'marketing', 'branding', 'consumer-psychology'],
    'B155':  ['capital-allocation', 'value-creation', 'investment', 'corporate-finance', 'capital-structure'],
    'B156':  ['systems-design', 'operations', 'optimization', 'organizational-design', 'strategy'],
    'B164':  ['brand-management', 'brand-strategy', 'branding', 'marketing', 'innovation'],
    'B165':  ['finance', 'global-business', 'corporate-finance', 'geopolitics', 'hedging'],
    'B166':  ['optimization', 'operations', 'supply-chain', 'systems-design', 'business-strategy'],
    'B199':  ['entrepreneurship', 'business-strategy', 'strategy', 'operations', 'innovation'],
    # Computational Sciences
    'CS110': ['algorithms', 'data-structures', 'computational-thinking', 'software-engineering', 'python'],
    'CS111': ['calculus', 'mathematics', 'applied-math', 'numerical-methods', 'differential-equations'],
    'CS113': ['linear-algebra', 'mathematics', 'applied-math', 'data-science', 'modeling'],
    'CS114': ['probability', 'statistics', 'mathematics', 'probabilistic-modeling', 'regression'],
    'CS130': ['statistics', 'regression', 'causal-inference', 'machine-learning', 'data-science'],
    'CS142': ['theory-of-computation', 'automata', 'formal-languages', 'complexity-theory', 'Turing-machines'],
    'CS144': ['mathematics', 'proof-writing', 'applied-math', 'logic', 'abstract-algebra'],
    'CS146': ['Bayesian', 'probabilistic-modeling', 'statistics', 'inference', 'machine-learning'],
    'CS152': ['artificial-intelligence', 'machine-learning', 'algorithms', 'neural-networks', 'data-science'],
    'CS154': ['differential-equations', 'numerical-methods', 'applied-math', 'modeling', 'calculus'],
    'CS156': ['machine-learning', 'data-science', 'classification', 'clustering', 'neural-networks'],
    'CS162': ['software-engineering', 'web-development', 'system-design', 'python', 'algorithms'],
    'CS164': ['optimization', 'linear-programming', 'operations-research', 'algorithms', 'mathematics'],
    'CS166': ['complex-systems', 'modeling', 'simulation', 'dynamical-systems', 'network-theory'],
    # Natural Sciences
    'NS110L': ['physics', 'biophysics', 'biology', 'applied-physics', 'thermodynamics'],
    'NS110U': ['physics', 'cosmology', 'gravity', 'relativity', 'theoretical-physics'],
    'NS111':  ['geology', 'climate', 'ecology', 'sustainability', 'atmospheric-science'],
    'NS112':  ['evolution', 'natural-selection', 'genetics', 'biodiversity', 'biology'],
    'NS113':  ['chemistry', 'organic-chemistry', 'molecular-biology', 'analytical-chemistry', 'biochemistry'],
    'NS125':  ['research-methods', 'statistics', 'data-analysis', 'biology', 'ecology'],
    'NS142':  ['quantum-mechanics', 'quantum', 'physics', 'materials-science', 'theoretical-physics'],
    'NS144':  ['genetics', 'genomics', 'cell-biology', 'molecular-biology', 'evolution'],
    'NS146':  ['climate', 'ecology', 'geology', 'sustainability', 'climate-change'],
    'NS152':  ['chemistry', 'analytical-chemistry', 'biochemistry', 'molecular-biology', 'organic-chemistry'],
    'NS154':  ['biochemistry', 'life-sciences', 'biology', 'cell-biology', 'molecular-biology'],
    'NS156':  ['climate-modeling', 'ecology', 'data-analysis', 'statistics', 'sustainability'],
    'NS162':  ['thermodynamics', 'physics', 'statistics', 'entropy', 'theoretical-physics'],
    'NS164':  ['biotechnology', 'gene-engineering', 'biomedical', 'biochemistry', 'life-sciences'],
    'NS166':  ['climate-change', 'sustainability', 'ecology', 'climate', 'atmospheric-science'],
    # Social Sciences
    'SS110': ['psychology', 'neuroscience', 'cognition', 'social-psychology', 'brain'],
    'SS111': ['economics', 'macroeconomics', 'markets', 'economic-policy', 'institutions'],
    'SS112': ['political-science', 'social-change', 'social-movements', 'democracy', 'political-theory'],
    'SS142': ['cognition', 'emotion', 'cognitive-science', 'psychology', 'neuroscience'],
    'SS144': ['microeconomics', 'macroeconomics', 'econometrics', 'markets', 'statistics'],
    'SS146': ['governance', 'institutions', 'political-systems', 'public-policy', 'rule-of-law'],
    'SS152': ['neuroscience', 'neural-computation', 'brain', 'cognitive-science', 'psychology'],
    'SS154': ['econometrics', 'economic-policy', 'regression', 'statistics', 'causal-inference'],
    'SS156': ['comparative-politics', 'political-systems', 'democracy', 'institutions', 'governance'],
    'SS162': ['psychology', 'motivation', 'social-psychology', 'behavior-change', 'health-psychology'],
    'SS164': ['development-economics', 'global-development', 'economics', 'inequality', 'public-policy'],
    'SS166': ['constitutional-law', 'comparative-law', 'constitution-making', 'rule-of-law', 'democracy'],
}

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
courses_path = os.path.join(root, 'data', 'courses.json')

with open(courses_path) as f:
    courses = json.load(f)

missing = []
for course in courses:
    tags = COURSE_TAGS.get(course['id'], [])
    course['tags'] = tags
    if not tags:
        missing.append(course['id'])

with open(courses_path, 'w') as f:
    json.dump(courses, f, indent=2)

print(f"Tagged {len(courses)} courses.")
if missing:
    print(f"WARNING — no tags for: {missing}")
else:
    print("All courses have tags ✓")
```

- [ ] **Step 2: Run the script**

```bash
mkdir -p scripts
# paste the script above into scripts/tag-courses.py, then:
python3 scripts/tag-courses.py
```

Expected output:
```
Tagged 68 courses.
All courses have tags ✓
```

- [ ] **Step 3: Verify the output**

```bash
python3 -c "
import json
with open('data/courses.json') as f:
    c = json.load(f)
no_tags = [x['id'] for x in c if not x.get('tags')]
print('No tags:', no_tags if no_tags else 'none — all good ✓')
print('Sample:', c[0]['id'], '->', c[0]['tags'])
"
```

Expected: `No tags: none — all good ✓` and a sample tag list.

- [ ] **Step 4: Commit**

```bash
git add scripts/tag-courses.py data/courses.json
git commit -m "feat: add interest tags to all 68 courses"
```

---

### Task 2: Add getMatchedCourses to data.js

**Files:**
- Modify: `js/data.js`

- [ ] **Step 1: Replace js/data.js with the updated version**

```js
// js/data.js — loads and caches all JSON data at startup

(function () {
  const _cache = {};

  function _load(file) {
    if (!(file in _cache)) {
      _cache[file] = fetch(`data/${file}.json`).then(res => {
        if (!res.ok) throw new Error(`Failed to load data/${file}.json`);
        return res.json();
      });
    }
    return _cache[file];
  }

  window.getAdventure = async function (schoolId) {
    const all = await _load('adventures');
    return all.filter(node => node.school === schoolId);
  };

  window.getCourses = async function (schoolId) {
    const all = await _load('courses');
    return all.filter(course => course.school === schoolId);
  };

  window.getMatchedCourses = async function (schoolId, accumulatedTags) {
    const all = await _load('courses');
    const schoolCourses = all.filter(c => c.school === schoolId);
    const matched = schoolCourses.filter(c =>
      (c.tags || []).filter(t => accumulatedTags.includes(t)).length >= 2
    );
    return matched.length >= 3 ? matched : schoolCourses;
  };
})();
```

- [ ] **Step 2: Verify in browser console**

Serve the project: `python3 -m http.server 8080` then open `http://localhost:8080`.

In the browser console, paste:
```js
// Should return ≥ 3 matched courses when tags overlap
getMatchedCourses('computational-sciences', ['machine-learning', 'data-science', 'algorithms'])
  .then(r => console.log('Matched CS courses:', r.length, r.map(c => c.title)));

// Should fall back to all courses (< 3 matches expected for unrelated tags)
getMatchedCourses('computational-sciences', ['painting', 'jazz', 'sculpture'])
  .then(r => console.log('Fallback courses:', r.length));

// Fallback count should equal total courses for that school (14)
getCourses('computational-sciences')
  .then(r => console.log('Total CS courses:', r.length));
```

Expected:
- First call: 3+ matched courses with titles like "Machine Learning", "Statistical Modeling", etc.
- Second call: 14 (fallback to all)
- Third call: 14

- [ ] **Step 3: Commit**

```bash
git add js/data.js
git commit -m "feat: add getMatchedCourses with tag overlap matching and fallback"
```

---

### Task 3: Update app.js — tag accumulation and course matching

**Files:**
- Modify: `js/app.js`

Five targeted changes. Apply each one in order.

- [ ] **Step 1: Add accumulatedTags to the state object**

Replace:
```js
const state = {
  screen: 'welcome',
  discovered: [],
  activeSchool: null,
  adventureNodes: [],
  currentNodeId: null,
};
```

With:
```js
const state = {
  screen: 'welcome',
  discovered: [],
  activeSchool: null,
  adventureNodes: [],
  currentNodeId: null,
  accumulatedTags: [],
};
```

- [ ] **Step 2: Reset accumulatedTags in startAdventure**

Replace the entire `startAdventure` function:
```js
async function startAdventure(schoolId) {
  state.activeSchool = schoolId;
  try {
    state.adventureNodes = await getAdventure(schoolId);
  } catch (err) {
    console.error('[Pathfinder] Failed to load adventure for', schoolId, err);
    return;
  }
  if (!state.adventureNodes.length) {
    console.error('[Pathfinder] No adventure nodes found for', schoolId);
    return;
  }
  renderAdventureNode(state.adventureNodes[0].id);
}
```

With:
```js
async function startAdventure(schoolId) {
  state.activeSchool = schoolId;
  state.accumulatedTags = [];
  try {
    state.adventureNodes = await getAdventure(schoolId);
  } catch (err) {
    console.error('[Pathfinder] Failed to load adventure for', schoolId, err);
    return;
  }
  if (!state.adventureNodes.length) {
    console.error('[Pathfinder] No adventure nodes found for', schoolId);
    return;
  }
  renderAdventureNode(state.adventureNodes[0].id);
}
```

- [ ] **Step 3: Accumulate tags on choice click; pass allTags to unlockSchool on terminal node** (js/app.js:120–143)

Replace the entire `renderAdventureNode` function:
```js
function renderAdventureNode(nodeId) {
  const node = state.adventureNodes.find(n => n.id === nodeId);
  if (!node) return;
  state.currentNodeId = nodeId;
  showScreen('adventure');

  document.getElementById('story-text').textContent = node.text;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  if (node.unlocks) {
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

With:
```js
function renderAdventureNode(nodeId) {
  const node = state.adventureNodes.find(n => n.id === nodeId);
  if (!node) return;
  state.currentNodeId = nodeId;
  showScreen('adventure');

  document.getElementById('story-text').textContent = node.text;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  if (node.unlocks) {
    const allTags = [...state.accumulatedTags, ...(node.requiredTags || [])];
    setTimeout(() => unlockSchool(node.unlocks, allTags), 1200);
    return;
  }

  node.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.label;
    btn.onclick = () => {
      state.accumulatedTags.push(...(choice.tags || []));
      renderAdventureNode(choice.next);
    };
    choicesEl.appendChild(btn);
  });
}
```

- [ ] **Step 4: Update unlockSchool to accept and forward allTags** (js/app.js:149–155)

Replace:
```js
async function unlockSchool(schoolId) {
  if (!state.discovered.includes(schoolId)) {
    state.discovered.push(schoolId);
    saveDiscovered(state.discovered);
  }
  await renderSchoolCard(schoolId);
}
```

With:
```js
async function unlockSchool(schoolId, allTags = []) {
  if (!state.discovered.includes(schoolId)) {
    state.discovered.push(schoolId);
    saveDiscovered(state.discovered);
  }
  await renderSchoolCard(schoolId, allTags);
}
```

- [ ] **Step 5: Update renderSchoolCard to use getMatchedCourses**

Replace the entire `renderSchoolCard` function:
```js
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

With:
```js
async function renderSchoolCard(schoolId, accumulatedTags = []) {
  showScreen('school-card');
  document.getElementById('card-name').textContent = SCHOOLS[schoolId].name;
  document.getElementById('card-desc').textContent = SCHOOL_DESCS[schoolId];

  const courses = await getMatchedCourses(schoolId, accumulatedTags);
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

- [ ] **Step 6: Verify in browser**

Serve: `python3 -m http.server 8080`

Play through the CS adventure making 3 choices. After the school card appears, open the console and check:
```js
console.log('Accumulated tags:', state.accumulatedTags);
// Should see 6–9 tags from 3 choices + requiredTags
```

Also verify the courses shown on the card are relevant to the choices made (not always all 14 CS courses).

- [ ] **Step 7: Commit**

```bash
git add js/app.js
git commit -m "feat: accumulate interest tags during adventure, pass to course matching"
```

---

### Task 4: Rewrite adventures.json with new 3-level schema

**Files:**
- Modify: `data/adventures.json`

This replaces the 20-node flat file with a 50-node branching file (10 nodes per school: 1 start + 3 branches + 3 clusters + 3 endings). Story text is functional — enhance it freely after the code works.

- [ ] **Step 1: Replace data/adventures.json with the following content**

```json
[
  {
    "id": "ah-start",
    "school": "arts-humanities",
    "text": "Mi drifts into an enormous archive — walls of manuscripts, song recordings, and projected films all playing at once. A glowing sign reads: 'Every culture speaks. What calls to you?'",
    "choices": [
      { "label": "Decode the ancient manuscript", "next": "ah-branch-a", "tags": ["history", "literature", "evidence"] },
      { "label": "Follow the protest song echoing from the hall", "next": "ah-branch-b", "tags": ["music", "social-change", "artistic-expression"] },
      { "label": "Watch the silent film from 1920", "next": "ah-branch-c", "tags": ["film", "visual-arts", "narrative"] }
    ]
  },
  {
    "id": "ah-branch-a",
    "school": "arts-humanities",
    "text": "The manuscript is a philosophical treatise on justice — and two scholars have scrawled contradictory notes in the margins in different centuries.",
    "choices": [
      { "label": "Argue with one of their positions", "next": "ah-cluster-1", "tags": ["philosophy", "normative-ethics", "moral-philosophy"] },
      { "label": "Trace how the argument changed over time", "next": "ah-cluster-2", "tags": ["historiography", "comparative-history", "historical-analysis"] }
    ]
  },
  {
    "id": "ah-branch-b",
    "school": "arts-humanities",
    "text": "The song is from a 1960s labor movement in Nairobi. It's half-poem, half-call-to-arms — and it still works.",
    "choices": [
      { "label": "Study the historical forces that created it", "next": "ah-cluster-1", "tags": ["history", "social-movements", "political-philosophy"] },
      { "label": "Analyze how the music amplifies the message", "next": "ah-cluster-3", "tags": ["music", "persuasion", "communication"] }
    ]
  },
  {
    "id": "ah-branch-c",
    "school": "arts-humanities",
    "text": "The film shows the same street corner in 1920, 1960, and 2020. Each version is denser, louder, stranger. And somehow more beautiful.",
    "choices": [
      { "label": "Write a comparative essay across the three eras", "next": "ah-cluster-2", "tags": ["narrative", "comparative-history", "close-reading"] },
      { "label": "Recreate the 1960 version in a new medium", "next": "ah-cluster-3", "tags": ["creative-expression", "design", "artistic-expression"] }
    ]
  },
  {
    "id": "ah-cluster-1",
    "school": "arts-humanities",
    "text": "Mi watches you connect an abstract argument with a real historical struggle. You're asking: 'What makes a just society?' — not as a thought experiment, but as a research question.",
    "choices": [
      { "label": "Follow the thread into political philosophy", "next": "ah-end-x", "tags": ["democracy", "ideology", "political-philosophy"] },
      { "label": "Follow it into historical evidence and method", "next": "ah-end-x", "tags": ["evidence", "methodology", "historical-analysis"] }
    ]
  },
  {
    "id": "ah-cluster-2",
    "school": "arts-humanities",
    "text": "You keep finding the same pattern: stories that legitimize power, and other stories that resist it. In literature, film, history — the structure repeats.",
    "choices": [
      { "label": "Map the patterns across cultures and centuries", "next": "ah-end-y", "tags": ["cultural-studies", "identity", "cross-cultural"] },
      { "label": "Apply a theoretical framework to explain them", "next": "ah-end-y", "tags": ["cultural-theory", "literary-criticism", "aesthetics"] }
    ]
  },
  {
    "id": "ah-cluster-3",
    "school": "arts-humanities",
    "text": "You realize that form carries meaning — how something is said shapes what is heard. Protest, poetry, design: all communication. All arguments.",
    "choices": [
      { "label": "Study the rhetoric behind art that persuades", "next": "ah-end-z", "tags": ["persuasion", "media", "propaganda"] },
      { "label": "Make something that embodies your argument", "next": "ah-end-z", "tags": ["creative-writing", "structure", "design-thinking"] }
    ]
  },
  {
    "id": "ah-end-x",
    "school": "arts-humanities",
    "text": "Mi cheers! You're drawn to the big questions — justice, power, how societies justify themselves. A&H gives you philosophy, history, and theory as your toolkit.",
    "unlocks": "arts-humanities",
    "requiredTags": ["justice", "political-philosophy", "history"]
  },
  {
    "id": "ah-end-y",
    "school": "arts-humanities",
    "text": "Mi leaps! You're a pattern-finder across cultures and time. A&H will give you the frameworks to see how identity, power, and meaning are constructed — and contested.",
    "unlocks": "arts-humanities",
    "requiredTags": ["cultural-studies", "literature", "identity"]
  },
  {
    "id": "ah-end-z",
    "school": "arts-humanities",
    "text": "Mi spins! You're a maker-thinker — ideas feel incomplete until they take a form. A&H gives you both the theory and the creative practice.",
    "unlocks": "arts-humanities",
    "requiredTags": ["creative-expression", "communication", "artistic-expression"]
  },

  {
    "id": "ss-start",
    "school": "social-sciences",
    "text": "Mi lands in a global crisis room. Three screens show: a rising inequality graph, a protest that became a revolution, and a brain scan of a world leader making a bad decision. Where do you look first?",
    "choices": [
      { "label": "Analyze the inequality data", "next": "ss-branch-a", "tags": ["economics", "inequality", "statistics"] },
      { "label": "Investigate what turned protest into revolution", "next": "ss-branch-b", "tags": ["political-science", "social-movements", "democracy"] },
      { "label": "Study how the brain made that decision", "next": "ss-branch-c", "tags": ["neuroscience", "cognition", "behavioral-science"] }
    ]
  },
  {
    "id": "ss-branch-a",
    "school": "social-sciences",
    "text": "The data shows wealth concentration spiked every time a specific policy changed — but correlation isn't causation. How do you find the real mechanism?",
    "choices": [
      { "label": "Run a causal inference analysis", "next": "ss-cluster-1", "tags": ["causal-inference", "econometrics", "regression"] },
      { "label": "Compare countries that took different policy paths", "next": "ss-cluster-2", "tags": ["comparative-politics", "development-economics", "public-policy"] }
    ]
  },
  {
    "id": "ss-branch-b",
    "school": "social-sciences",
    "text": "The revolution followed decades of eroding institutional trust. Scholars disagree: did the institutions fail, or did the people?",
    "choices": [
      { "label": "Build a model of how institutional trust collapses", "next": "ss-cluster-1", "tags": ["institutions", "governance", "political-systems"] },
      { "label": "Survey community members about their grievances", "next": "ss-cluster-3", "tags": ["social-psychology", "research-methods", "social-systems"] }
    ]
  },
  {
    "id": "ss-branch-c",
    "school": "social-sciences",
    "text": "The brain scan shows fear activated before the 'rational' regions. The decision was emotional before it was logical.",
    "choices": [
      { "label": "Design a nudge to guide better decisions", "next": "ss-cluster-2", "tags": ["behavioral-economics", "nudging", "decision-making"] },
      { "label": "Study how emotion shapes political behavior at scale", "next": "ss-cluster-3", "tags": ["emotion", "psychology", "political-theory"] }
    ]
  },
  {
    "id": "ss-cluster-1",
    "school": "social-sciences",
    "text": "Mi grins. You keep asking 'why does this pattern persist?' and you won't settle for correlation. That's the social scientist's instinct: find the mechanism, then test it.",
    "choices": [
      { "label": "Formalize the mechanism as a mathematical model", "next": "ss-end-x", "tags": ["game-theory", "Nash-equilibrium", "macroeconomics"] },
      { "label": "Test it with a natural experiment", "next": "ss-end-x", "tags": ["statistics", "public-policy", "causal-inference"] }
    ]
  },
  {
    "id": "ss-cluster-2",
    "school": "social-sciences",
    "text": "You've noticed that different societies made the same mistake — not because they're irrational, but because the structure of the choice made the wrong answer feel right.",
    "choices": [
      { "label": "Study how behavioral biases aggregate to systemic outcomes", "next": "ss-end-y", "tags": ["behavioral-science", "market-failures", "markets"] },
      { "label": "Design institutions that correct for the bias", "next": "ss-end-y", "tags": ["policy", "governance", "rule-of-law"] }
    ]
  },
  {
    "id": "ss-cluster-3",
    "school": "social-sciences",
    "text": "The answers live in what people say, what they feel, and what they do — and those three things don't always match. You want to understand the gap.",
    "choices": [
      { "label": "Build a psychological model of political behavior", "next": "ss-end-z", "tags": ["social-psychology", "motivation", "behavior-change"] },
      { "label": "Study how collective memory shapes group identity", "next": "ss-end-z", "tags": ["memory", "social-systems", "state-formation"] }
    ]
  },
  {
    "id": "ss-end-x",
    "school": "social-sciences",
    "text": "Mi claps! You're a rigorous analyst — you want to know why, and you won't stop until you've found something you can test. Social Sciences has the tools you need.",
    "unlocks": "social-sciences",
    "requiredTags": ["economics", "statistics", "causal-inference"]
  },
  {
    "id": "ss-end-y",
    "school": "social-sciences",
    "text": "Mi dances! You see the structural patterns behind individual choices. Behavioral economics, institutions, and comparative politics — Social Sciences has your name on it.",
    "unlocks": "social-sciences",
    "requiredTags": ["behavioral-economics", "governance", "policy"]
  },
  {
    "id": "ss-end-z",
    "school": "social-sciences",
    "text": "Mi gasps! You want to understand people — what they feel, how their history shapes them. Social psychology and political theory are waiting for you.",
    "unlocks": "social-sciences",
    "requiredTags": ["psychology", "social-psychology", "memory"]
  },

  {
    "id": "cs-start",
    "school": "computational-sciences",
    "text": "Mi enters a glowing server room. Screens flicker with mysterious data patterns and three alerts flash simultaneously. Which do you investigate?",
    "choices": [
      { "label": "The memory leak causing system failures", "next": "cs-branch-a", "tags": ["algorithms", "software-engineering", "computational-thinking"] },
      { "label": "The unexplained pattern in the data stream", "next": "cs-branch-b", "tags": ["data-science", "modeling", "statistics"] },
      { "label": "The formal proof of correctness that keeps failing", "next": "cs-branch-c", "tags": ["logic", "proof-writing", "mathematics"] }
    ]
  },
  {
    "id": "cs-branch-a",
    "school": "computational-sciences",
    "text": "The memory leak traces back to an unexpected recursive pattern. It's elegant — and shouldn't be possible at this scale.",
    "choices": [
      { "label": "Analyze its computational complexity", "next": "cs-cluster-1", "tags": ["complexity-theory", "algorithms", "NP-hardness"] },
      { "label": "Optimize it with dynamic programming", "next": "cs-cluster-2", "tags": ["dynamic-programming", "optimization", "data-structures"] }
    ]
  },
  {
    "id": "cs-branch-b",
    "school": "computational-sciences",
    "text": "The data pattern has a self-similar structure that grows at every resolution level. It shouldn't appear in this kind of data.",
    "choices": [
      { "label": "Build a model to predict where it appears next", "next": "cs-cluster-1", "tags": ["machine-learning", "probabilistic-modeling", "inference"] },
      { "label": "Map the network structure behind the pattern", "next": "cs-cluster-3", "tags": ["network-theory", "network-analysis", "complex-systems"] }
    ]
  },
  {
    "id": "cs-branch-c",
    "school": "computational-sciences",
    "text": "The proof fails at the same step every time — not because the logic is wrong, but because the system has an edge case no one anticipated.",
    "choices": [
      { "label": "Formalize the edge case with abstract algebra", "next": "cs-cluster-2", "tags": ["abstract-algebra", "formal-languages", "theory-of-computation"] },
      { "label": "Write a theorem prover to handle it automatically", "next": "cs-cluster-3", "tags": ["logic-programming", "automata", "Turing-machines"] }
    ]
  },
  {
    "id": "cs-cluster-1",
    "school": "computational-sciences",
    "text": "Mi watches as you build something rigorous — a tool that doesn't just solve the problem, but proves why the solution works and predicts when it won't.",
    "choices": [
      { "label": "Extend it to handle real-world scale", "next": "cs-end-x", "tags": ["system-design", "python", "software-engineering"] },
      { "label": "Prove tight upper and lower bounds on its performance", "next": "cs-end-x", "tags": ["proof-writing", "mathematics", "linear-algebra"] }
    ]
  },
  {
    "id": "cs-cluster-2",
    "school": "computational-sciences",
    "text": "You've found a mathematical structure that keeps appearing across apparently unrelated problems. It's not a coincidence. There's a deeper pattern.",
    "choices": [
      { "label": "Show it's connected to computational complexity", "next": "cs-end-y", "tags": ["complexity-theory", "theory-of-computation", "Turing-machines"] },
      { "label": "Find a polynomial-time solution using the structure", "next": "cs-end-y", "tags": ["optimization", "linear-programming", "operations-research"] }
    ]
  },
  {
    "id": "cs-cluster-3",
    "school": "computational-sciences",
    "text": "The logical system you've built has unexpected expressive power — more than you designed it to have. That usually means you found something real.",
    "choices": [
      { "label": "Connect it to what's theoretically computable", "next": "cs-end-z", "tags": ["Turing-machines", "formal-languages", "automata"] },
      { "label": "Apply it to analyze network behavior at scale", "next": "cs-end-z", "tags": ["network-analysis", "simulation", "dynamical-systems"] }
    ]
  },
  {
    "id": "cs-end-x",
    "school": "computational-sciences",
    "text": "Mi blinks in awe! You're a builder — you see systems and ask 'how can this scale, and how do I prove it's correct?' CS at Minerva will give you the depth to do both.",
    "unlocks": "computational-sciences",
    "requiredTags": ["software-engineering", "python", "system-design"]
  },
  {
    "id": "cs-end-y",
    "school": "computational-sciences",
    "text": "Mi does a little spin! You're a theorist — you want to know the deep why behind computation, not just the how. CS theory and algorithms are where you'll live.",
    "unlocks": "computational-sciences",
    "requiredTags": ["complexity-theory", "mathematics", "optimization"]
  },
  {
    "id": "cs-end-z",
    "school": "computational-sciences",
    "text": "Mi gasps! You're a logician-builder — you think in formal systems and want to make them do useful things. CS at Minerva lets you work from foundations to applications.",
    "unlocks": "computational-sciences",
    "requiredTags": ["logic", "automata", "theory-of-computation"]
  },

  {
    "id": "ns-start",
    "school": "natural-sciences",
    "text": "Mi discovers a glowing specimen in a jungle clearing — nothing in any field guide even comes close. Three scientists rush in. Which do you follow?",
    "choices": [
      { "label": "The biochemist setting up a sample kit", "next": "ns-branch-a", "tags": ["biochemistry", "chemistry", "molecular-biology"] },
      { "label": "The ecologist mapping the surrounding habitat", "next": "ns-branch-b", "tags": ["ecology", "biodiversity", "evolution"] },
      { "label": "The physicist measuring its energy output", "next": "ns-branch-c", "tags": ["physics", "thermodynamics", "applied-physics"] }
    ]
  },
  {
    "id": "ns-branch-a",
    "school": "natural-sciences",
    "text": "The samples show a chemical structure unlike anything in the literature. It responds to light in a way that violates thermodynamic expectations.",
    "choices": [
      { "label": "Model its molecular structure computationally", "next": "ns-cluster-1", "tags": ["molecular-biology", "biophysics", "computation"] },
      { "label": "Test whether it could have pharmaceutical potential", "next": "ns-cluster-2", "tags": ["biomedical", "biotechnology", "organic-chemistry"] }
    ]
  },
  {
    "id": "ns-branch-b",
    "school": "natural-sciences",
    "text": "The specimen is at the center of an invisible food web. If it disappeared, three other species would collapse. How did no one find it until now?",
    "choices": [
      { "label": "Model the ecosystem cascade if it vanishes", "next": "ns-cluster-1", "tags": ["ecology", "climate-modeling", "biodiversity"] },
      { "label": "Trace its evolutionary lineage", "next": "ns-cluster-3", "tags": ["evolution", "genetics", "natural-selection"] }
    ]
  },
  {
    "id": "ns-branch-c",
    "school": "natural-sciences",
    "text": "The energy readings are rhythmic — as if the specimen is computing. The physicist suspects quantum coherence at biological temperatures.",
    "choices": [
      { "label": "Design an experiment to test the quantum hypothesis", "next": "ns-cluster-2", "tags": ["quantum-mechanics", "applied-physics", "research-methods"] },
      { "label": "Compare it to other known biophysical anomalies", "next": "ns-cluster-3", "tags": ["biophysics", "thermodynamics", "information-theory"] }
    ]
  },
  {
    "id": "ns-cluster-1",
    "school": "natural-sciences",
    "text": "Mi watches intently as you work across scales — from molecular structure to ecosystem dynamics. You want the mechanism, at the deepest level.",
    "choices": [
      { "label": "Develop a predictive model of the system", "next": "ns-end-x", "tags": ["statistics", "data-analysis", "climate"] },
      { "label": "Design experiments to validate the model", "next": "ns-end-x", "tags": ["research-methods", "biology", "life-sciences"] }
    ]
  },
  {
    "id": "ns-cluster-2",
    "school": "natural-sciences",
    "text": "You're at the intersection of physics and life. What looks like a biological mystery might be a window into universal chemical principles.",
    "choices": [
      { "label": "Synthesize the compound in a laboratory", "next": "ns-end-y", "tags": ["analytical-chemistry", "organic-chemistry", "biochemistry"] },
      { "label": "Publish a theoretical framework for other researchers", "next": "ns-end-y", "tags": ["theoretical-physics", "quantum", "materials-science"] }
    ]
  },
  {
    "id": "ns-cluster-3",
    "school": "natural-sciences",
    "text": "You keep asking: what rules govern this thing's existence? Not just what it does, but why it's possible at all. That's the physicist-biologist's question.",
    "choices": [
      { "label": "Map its genome to understand what built it", "next": "ns-end-z", "tags": ["genomics", "genetics", "cell-biology"] },
      { "label": "Model how it could have evolved from simpler forms", "next": "ns-end-z", "tags": ["evolution", "entropy", "life-sciences"] }
    ]
  },
  {
    "id": "ns-end-x",
    "school": "natural-sciences",
    "text": "Mi shouts with joy! You're a modeler — you see systems as governed by underlying rules that can be formalized and tested. Natural Sciences will give you the tools to find them.",
    "unlocks": "natural-sciences",
    "requiredTags": ["biology", "ecology", "data-analysis"]
  },
  {
    "id": "ns-end-y",
    "school": "natural-sciences",
    "text": "Mi bounces excitedly! You're drawn to the boundary between physics and chemistry — where the rules of the universe show up in molecules and materials. This is where Natural Sciences lives.",
    "unlocks": "natural-sciences",
    "requiredTags": ["chemistry", "biochemistry", "physics"]
  },
  {
    "id": "ns-end-z",
    "school": "natural-sciences",
    "text": "Mi gasps! You want to understand life at its deepest level — the code that writes organisms, the physics that makes them possible. Natural Sciences will blow your mind.",
    "unlocks": "natural-sciences",
    "requiredTags": ["genetics", "evolution", "biology"]
  },

  {
    "id": "biz-start",
    "school": "business",
    "text": "Mi walks into a global startup pitch competition. Three teams present wildly different ideas. Which pulls your attention first?",
    "choices": [
      { "label": "A fintech startup promising to bank the unbanked", "next": "biz-branch-a", "tags": ["finance", "innovation", "global-business"] },
      { "label": "A consumer brand that's profitable in year one", "next": "biz-branch-b", "tags": ["marketing", "consumer-behavior", "entrepreneurship"] },
      { "label": "A B2B software company with no revenue but elite users", "next": "biz-branch-c", "tags": ["business-strategy", "venture-capital", "startup"] }
    ]
  },
  {
    "id": "biz-branch-a",
    "school": "business",
    "text": "The fintech pitch has a compelling mission but the unit economics don't add up. The revenue model depends on assumptions that look very optimistic.",
    "choices": [
      { "label": "Rebuild the financial model from first principles", "next": "biz-cluster-1", "tags": ["financial-modeling", "valuation", "corporate-finance"] },
      { "label": "Identify which assumption is most likely to fail", "next": "biz-cluster-2", "tags": ["risk-management", "forecasting", "capital-structure"] }
    ]
  },
  {
    "id": "biz-branch-b",
    "school": "business",
    "text": "The brand is profitable because customer acquisition is almost entirely word-of-mouth. But it won't scale without spending money — and spending money might break what makes it special.",
    "choices": [
      { "label": "Design a growth strategy that protects the brand", "next": "biz-cluster-1", "tags": ["growth-strategy", "brand-strategy", "marketing"] },
      { "label": "Research the psychology behind the product's appeal", "next": "biz-cluster-3", "tags": ["consumer-psychology", "user-research", "product-design"] }
    ]
  },
  {
    "id": "biz-branch-c",
    "school": "business",
    "text": "The company has no revenue but three Fortune 500 companies use the product for free. They're waiting for the right moment to monetize — classic land-and-expand.",
    "choices": [
      { "label": "Map the go-to-market strategy for monetization", "next": "biz-cluster-2", "tags": ["go-to-market", "market-entry", "strategy"] },
      { "label": "Analyze which customers to charge first and how", "next": "biz-cluster-3", "tags": ["market-research", "product-analytics", "operations"] }
    ]
  },
  {
    "id": "biz-cluster-1",
    "school": "business",
    "text": "Mi watches you work backwards from numbers to strategy. You're not just asking 'what's the plan?' — you're asking 'what would have to be true for this to work?'",
    "choices": [
      { "label": "Model three scenarios: pessimistic, base, optimistic", "next": "biz-end-x", "tags": ["financial-planning", "forecasting", "capital-allocation"] },
      { "label": "Calculate the startup's intrinsic value", "next": "biz-end-x", "tags": ["valuation", "investment", "private-equity"] }
    ]
  },
  {
    "id": "biz-cluster-2",
    "school": "business",
    "text": "You see the business as a system of moving parts. The product works. The question is whether the market will reward the right behavior at the right time.",
    "choices": [
      { "label": "Build the full go-to-market playbook", "next": "biz-end-y", "tags": ["go-to-market", "marketing", "market-entry"] },
      { "label": "Design the operations that make it executable", "next": "biz-end-y", "tags": ["supply-chain", "operations", "optimization"] }
    ]
  },
  {
    "id": "biz-cluster-3",
    "school": "business",
    "text": "You keep coming back to the customer. What do they actually want? Why this product over that one? What are they willing to pay for?",
    "choices": [
      { "label": "Run a rapid customer discovery sprint", "next": "biz-end-z", "tags": ["user-research", "consumer-behavior", "product-development"] },
      { "label": "Build a brand that wins the customer's imagination", "next": "biz-end-z", "tags": ["branding", "brand-management", "consumer-psychology"] }
    ]
  },
  {
    "id": "biz-end-x",
    "school": "business",
    "text": "Mi claps loudly! You're a finance-and-strategy thinker — you want to know if it's viable and how to make it more so. The Business school will sharpen your analytical edge.",
    "unlocks": "business",
    "requiredTags": ["finance", "strategy", "valuation"]
  },
  {
    "id": "biz-end-y",
    "school": "business",
    "text": "Mi spins! You're an operator — you understand that great strategy is worthless without execution. You want to build the machine, not just design it.",
    "unlocks": "business",
    "requiredTags": ["strategy", "operations", "marketing"]
  },
  {
    "id": "biz-end-z",
    "school": "business",
    "text": "Mi gasps with delight! You're a builder with a user-first brain — you think in products, brands, and customer relationships. The Business school wants you.",
    "unlocks": "business",
    "requiredTags": ["entrepreneurship", "marketing", "product-development"]
  }
]
```

- [ ] **Step 2: Verify the JSON structure is valid**

```bash
python3 -c "
import json
with open('data/adventures.json') as f:
    nodes = json.load(f)
by_school = {}
for n in nodes:
    by_school.setdefault(n['school'], []).append(n['id'])
for school, ids in by_school.items():
    print(f'{school}: {len(ids)} nodes')
    # Check all non-terminal nodes have choices with tags
    for n in nodes:
        if n['school'] == school and 'choices' in n:
            for c in n['choices']:
                if 'tags' not in c:
                    print(f'  WARNING: {n[\"id\"]} choice missing tags')
    # Check all terminal nodes have requiredTags
    for n in nodes:
        if n['school'] == school and 'unlocks' in n:
            if 'requiredTags' not in n:
                print(f'  WARNING: {n[\"id\"]} missing requiredTags')
print('Validation complete.')
"
```

Expected: each school shows 10 nodes, no warnings.

- [ ] **Step 3: Play through one adventure in the browser to verify branching**

Serve: `python3 -m http.server 8080`. Open the app, enter the CS adventure. Verify:
- Start shows 3 choices
- Each branch leads to a new scenario
- Clusters lead to endings
- School card appears after ending with relevant courses

- [ ] **Step 4: Commit**

```bash
git add data/adventures.json
git commit -m "feat: rewrite adventures.json with 3-level branching and interest tags"
```

---

### Task 5: Create data/adventures-template.json

**Files:**
- Create: `data/adventures-template.json`

This file is a blank scaffold authors use when writing a new school's adventure. It is not loaded by the app.

- [ ] **Step 1: Create data/adventures-template.json**

```json
[
  {
    "id": "SCHOOL-start",
    "school": "SCHOOL-ID",
    "text": "✏️ Opening scenario. Mi arrives somewhere. What does the student see? Offer 3 choices that split into different intellectual directions.",
    "choices": [
      { "label": "✏️ Choice A label", "next": "SCHOOL-branch-a", "tags": ["✏️tag1", "✏️tag2", "✏️tag3"] },
      { "label": "✏️ Choice B label", "next": "SCHOOL-branch-b", "tags": ["✏️tag1", "✏️tag2", "✏️tag3"] },
      { "label": "✏️ Choice C label", "next": "SCHOOL-branch-c", "tags": ["✏️tag1", "✏️tag2", "✏️tag3"] }
    ]
  },
  {
    "id": "SCHOOL-branch-a",
    "school": "SCHOOL-ID",
    "text": "✏️ Branch A scenario. What does the student discover or encounter?",
    "choices": [
      { "label": "✏️ Choice leads to cluster-1", "next": "SCHOOL-cluster-1", "tags": ["✏️tag1", "✏️tag2"] },
      { "label": "✏️ Choice leads to cluster-2", "next": "SCHOOL-cluster-2", "tags": ["✏️tag1", "✏️tag2"] }
    ]
  },
  {
    "id": "SCHOOL-branch-b",
    "school": "SCHOOL-ID",
    "text": "✏️ Branch B scenario.",
    "choices": [
      { "label": "✏️ Choice leads to cluster-1", "next": "SCHOOL-cluster-1", "tags": ["✏️tag1", "✏️tag2"] },
      { "label": "✏️ Choice leads to cluster-3", "next": "SCHOOL-cluster-3", "tags": ["✏️tag1", "✏️tag2"] }
    ]
  },
  {
    "id": "SCHOOL-branch-c",
    "school": "SCHOOL-ID",
    "text": "✏️ Branch C scenario.",
    "choices": [
      { "label": "✏️ Choice leads to cluster-2", "next": "SCHOOL-cluster-2", "tags": ["✏️tag1", "✏️tag2"] },
      { "label": "✏️ Choice leads to cluster-3", "next": "SCHOOL-cluster-3", "tags": ["✏️tag1", "✏️tag2"] }
    ]
  },
  {
    "id": "SCHOOL-cluster-1",
    "school": "SCHOOL-ID",
    "text": "✏️ Cluster 1 scenario. Both branch-a and branch-b can reach here. All choices here lead to end-x.",
    "choices": [
      { "label": "✏️ Choice leads to end-x", "next": "SCHOOL-end-x", "tags": ["✏️tag1", "✏️tag2"] },
      { "label": "✏️ Choice also leads to end-x (different tags)", "next": "SCHOOL-end-x", "tags": ["✏️tag1", "✏️tag2"] }
    ]
  },
  {
    "id": "SCHOOL-cluster-2",
    "school": "SCHOOL-ID",
    "text": "✏️ Cluster 2 scenario. Both branch-a and branch-c can reach here. All choices here lead to end-y.",
    "choices": [
      { "label": "✏️ Choice leads to end-y", "next": "SCHOOL-end-y", "tags": ["✏️tag1", "✏️tag2"] },
      { "label": "✏️ Choice also leads to end-y (different tags)", "next": "SCHOOL-end-y", "tags": ["✏️tag1", "✏️tag2"] }
    ]
  },
  {
    "id": "SCHOOL-cluster-3",
    "school": "SCHOOL-ID",
    "text": "✏️ Cluster 3 scenario. Both branch-b and branch-c can reach here. All choices here lead to end-z.",
    "choices": [
      { "label": "✏️ Choice leads to end-z", "next": "SCHOOL-end-z", "tags": ["✏️tag1", "✏️tag2"] },
      { "label": "✏️ Choice also leads to end-z (different tags)", "next": "SCHOOL-end-z", "tags": ["✏️tag1", "✏️tag2"] }
    ]
  },
  {
    "id": "SCHOOL-end-x",
    "school": "SCHOOL-ID",
    "text": "✏️ Ending X. Mi reacts. Describe this student's intellectual identity — what makes them uniquely suited to this school. This is the payoff.",
    "unlocks": "SCHOOL-ID",
    "requiredTags": ["✏️tag1", "✏️tag2", "✏️tag3"]
  },
  {
    "id": "SCHOOL-end-y",
    "school": "SCHOOL-ID",
    "text": "✏️ Ending Y. A different intellectual identity from ending X.",
    "unlocks": "SCHOOL-ID",
    "requiredTags": ["✏️tag1", "✏️tag2", "✏️tag3"]
  },
  {
    "id": "SCHOOL-end-z",
    "school": "SCHOOL-ID",
    "text": "✏️ Ending Z. A third intellectual identity.",
    "unlocks": "SCHOOL-ID",
    "requiredTags": ["✏️tag1", "✏️tag2", "✏️tag3"]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add data/adventures-template.json
git commit -m "docs: add adventure authoring template with node structure scaffold"
```

---

### Task 6: Create docs/adventure-writing-guide.md

**Files:**
- Create: `docs/adventure-writing-guide.md`

- [ ] **Step 1: Create docs/adventure-writing-guide.md**

```markdown
# Adventure Writing Guide — Minerva Pathfinder

Use this guide when writing or rewriting adventure stories for the 5 Minerva schools.

---

## Tone

**Mix of realistic and fantastical.** Mi is a pixel explorer in an imaginary world, but the intellectual content is real Minerva. A node might be set in a "data dimension" or a "jungle clearing" but the choices should reflect genuine academic questions that Minerva students actually grapple with.

- Scenarios: imaginative, sensory, specific ("a wall of manuscripts" not "a library")
- Choices: concrete intellectual actions ("Run a causal inference analysis" not "Think about causes")
- Endings: Mi celebrates; the student receives a short identity label ("You're a theorist", "You're a builder")

---

## Tree Structure

Each school has 10 nodes in this pattern:

```
start (3 choices) → branch-a, branch-b, branch-c
branch-a (2 choices) → cluster-1, cluster-2
branch-b (2 choices) → cluster-1, cluster-3
branch-c (2 choices) → cluster-2, cluster-3
cluster-1 (2 choices) → end-x   (all choices go to same ending)
cluster-2 (2 choices) → end-y
cluster-3 (2 choices) → end-z
end-x, end-y, end-z: terminal nodes (no choices)
```

**Key insight:** The ending (x/y/z) is determined at the *branch → cluster* step. The cluster's choices all lead to the same ending but accumulate different tags — so they affect which courses appear, not which story branch.

---

## Tags

Use 2–3 tags per choice. Use the tag lists below. Tags are invisible to students — they determine course recommendations behind the scenes.

**Tips:**
- Use specific tags over general ones: `machine-learning` beats `technology`
- Tags at the cluster and ending levels should overlap with the most relevant courses
- Each ending's `requiredTags` should reflect what that intellectual identity cares most about

---

## Tag Reference by School

### arts-humanities
`aesthetics` `anthropology` `applied-ethics` `art-analysis` `art-history` `artistic-expression` `arts` `bioethics` `civil-disobedience` `close-reading` `communication` `comparative-history` `constitutional-theory` `creative-expression` `creative-writing` `cross-cultural` `cultural-studies` `cultural-theory` `data-ethics` `democracy` `design` `design-thinking` `digital-history` `digital-humanities` `dilemmas` `empire` `environment` `environmental-ethics` `ethics` `evidence` `feminist-ethics` `film` `form` `gender` `global` `global-justice` `global-perspectives` `globalization` `historical-analysis` `historiography` `history` `human-rights` `identity` `ideology` `institutions` `interdisciplinary` `international-law` `justice` `labor` `law` `literary-criticism` `literature` `material-culture` `media` `memory` `methodology` `migration` `moral-philosophy` `museums` `music` `narrative` `nationalism` `normative-ethics` `persuasion` `philosophy` `policy` `political-philosophy` `politics` `positionality` `propaganda` `public-history` `social-change` `social-justice` `social-movements` `socioeconomics` `sociology` `structure` `sustainability` `technology` `visual-arts`

### social-sciences
`AI` `Nash-equilibrium` `behavior-change` `behavioral-economics` `behavioral-science` `brain` `causal-inference` `central-banking` `cognition` `cognitive-science` `comparative-law` `comparative-politics` `constitution-making` `constitutional-law` `corruption` `creativity` `decision-making` `democracy` `development-economics` `econometrics` `economic-policy` `economics` `education` `emotion` `game-theory` `global-development` `governance` `health-psychology` `healthcare` `inequality` `institutions` `international-relations` `international-trade` `macroeconomics` `market-failures` `markets` `memory` `mental-health` `microeconomics` `motivation` `neural-computation` `neuroscience` `nudging` `persuasion` `policy` `political-science` `political-systems` `political-theory` `psychology` `public-policy` `regression` `research-methods` `rule-of-law` `social-change` `social-movements` `social-psychology` `social-systems` `state-formation` `statistics` `sustainability`

### computational-sciences
`Bayesian` `Fourier-analysis` `Markov-chains` `Monte-Carlo` `NP-hardness` `Turing-machines` `abstract-algebra` `algorithms` `applied-math` `artificial-intelligence` `automata` `calculus` `causal-inference` `classification` `clustering` `complex-systems` `complexity-theory` `computational-math` `computational-thinking` `data-science` `data-structures` `differential-equations` `dynamic-programming` `dynamical-systems` `formal-languages` `hashing` `inference` `linear-algebra` `linear-programming` `logic` `logic-programming` `machine-learning` `mathematics` `modeling` `network-analysis` `network-theory` `neural-networks` `numerical-methods` `operations-research` `optimization` `probabilistic-modeling` `probability` `proof-writing` `python` `regression` `robotics` `simulation` `software-engineering` `statistics` `system-design` `theory-of-computation` `web-development`

### natural-sciences
`analytical-chemistry` `applied-physics` `atmospheric-science` `biochemistry` `biodiversity` `bioethics` `biology` `biomedical` `biophysics` `biotechnology` `cell-biology` `chemistry` `climate` `climate-change` `climate-modeling` `computation` `cosmology` `data-analysis` `ecology` `electromagnetism` `entropy` `evolution` `fluid-dynamics` `gene-engineering` `genetics` `genomics` `geology` `gravity` `information-theory` `life-sciences` `materials-science` `molecular-biology` `natural-selection` `organic-chemistry` `physics` `planetary-science` `quantum` `quantum-mechanics` `relativity` `research-methods` `statistics` `sustainability` `theoretical-physics` `thermodynamics`

### business
`accounting` `brand-management` `brand-strategy` `branding` `budgeting` `business-strategy` `capital-allocation` `capital-structure` `consumer-behavior` `consumer-psychology` `corporate-finance` `entrepreneurship` `finance` `financial-modeling` `financial-planning` `forecasting` `fundraising` `geopolitics` `global-business` `go-to-market` `growth-strategy` `hedging` `innovation` `investment` `market-entry` `market-research` `marketing` `operations` `optimization` `organizational-design` `private-equity` `product-analytics` `product-design` `product-development` `risk-management` `service-design` `startup` `strategy` `supply-chain` `systems-design` `user-research` `valuation` `value-creation` `venture-capital`

---

## Example: CS adventure (fully worked)

See `data/adventures.json` — the `cs-*` nodes are a complete example of the structure, tag usage, and tone to model from.

The CS adventure uses `cs-start` → three branches based on whether the student gravitates toward engineering, data analysis, or formal theory → clusters that refine within each direction → endings that give the student a label (builder, theorist, logician-builder).

---

## Node writing checklist

- [ ] Scenario is specific and sensory (not generic)
- [ ] Each choice is a concrete intellectual action
- [ ] Tags come from the school's tag list above
- [ ] 2–3 tags per choice
- [ ] Cluster choices all point to the same ending
- [ ] Ending text names the student's intellectual identity
- [ ] `requiredTags` reflect what makes that identity distinct
```

- [ ] **Step 2: Commit**

```bash
git add docs/adventure-writing-guide.md
git commit -m "docs: add adventure writing guide with tag reference and example"
```
