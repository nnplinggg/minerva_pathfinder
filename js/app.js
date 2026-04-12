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

// School positions on map (percentage x/y, matching --nx/--ny in HTML)
const SCHOOL_POSITIONS = {
  'arts-humanities':        { x: 12, y: 18 },
  'social-sciences':        { x: 75, y: 15 },
  'computational-sciences': { x: 78, y: 65 },
  'natural-sciences':       { x: 10, y: 65 },
  'business':               { x: 42, y: 40 },
};
const PROXIMITY_THRESHOLD = 9; // percent distance to trigger chest

// ============================================================
// State
// ============================================================

const _NO_PUSH = {}; // sentinel: don't record this nav in history

const state = {
  screen: 'welcome',
  discovered: [],
  activeSchool: null,
  adventureNodes: [],
  currentNodeId: null,
  accumulatedTags: [],
  adventureHistory: [],  // [{ nodeId, tags }]
  miX: 52,   // Mi position on map (%)
  miY: 76,
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
// Map keyboard movement + proximity
// ============================================================

function moveMi(dx, dy) {
  state.miX = Math.max(4, Math.min(96, state.miX + dx));
  state.miY = Math.max(4, Math.min(92, state.miY + dy));

  const miEl = document.getElementById('map-mi');
  miEl.style.left = `${state.miX}%`;
  miEl.style.top  = `${state.miY}%`;

  checkProximity();
}

function checkProximity() {
  let nearest = null;
  let nearestDist = Infinity;

  for (const [id, pos] of Object.entries(SCHOOL_POSITIONS)) {
    const dx   = state.miX - pos.x;
    const dy   = state.miY - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const node = document.querySelector(`.map-node[data-school="${id}"]`);

    if (dist < PROXIMITY_THRESHOLD) {
      if (dist < nearestDist) { nearestDist = dist; nearest = { id, node }; }
      node.classList.add('nearby');
    } else {
      node.classList.remove('nearby');
    }
  }

  // Auto-open when very close (half threshold)
  if (nearest && nearestDist < PROXIMITY_THRESHOLD / 2) {
    nearest.node.classList.remove('nearby');
    startAdventure(nearest.id);
  }
}

function handleMapKeys(e) {
  if (state.screen !== 'map') return;
  const SPEED = 2.5;
  const moves = {
    ArrowUp:    [ 0, -SPEED],
    ArrowDown:  [ 0,  SPEED],
    ArrowLeft:  [-SPEED,  0],
    ArrowRight: [ SPEED,  0],
  };
  if (!moves[e.key]) return;
  e.preventDefault();
  moveMi(...moves[e.key]);
}

// ============================================================
// Welcome screen
// ============================================================

function renderWelcome() {
  showScreen('welcome');

  const btn    = document.getElementById('btn-start');
  const btnImg = document.getElementById('play-btn-img');

  // Swap to clicked image on press, back on release
  btn.addEventListener('mousedown',  () => { btnImg.src = 'assets/play-clicked.png'; });
  btn.addEventListener('touchstart', () => { btnImg.src = 'assets/play-clicked.png'; }, { passive: true });
  btn.addEventListener('mouseup',    () => { btnImg.src = 'assets/play-default.png'; });
  btn.addEventListener('mouseleave', () => { btnImg.src = 'assets/play-default.png'; });
  btn.addEventListener('touchend',   () => { btnImg.src = 'assets/play-default.png'; });

  btn.onclick = () => renderMap();
}

// ============================================================
// World map screen
// ============================================================

function renderMap() {
  showScreen('map');
  const count = state.discovered.length;

  // Reset Mi to safe starting position (bottom-center, away from all chests)
  state.miX = 50;
  state.miY = 84;
  const miEl = document.getElementById('map-mi');
  miEl.style.left = `${state.miX}%`;
  miEl.style.top  = `${state.miY}%`;

  // Clear any leftover nearby highlights
  document.querySelectorAll('.map-node.nearby').forEach(n => n.classList.remove('nearby'));

  // Update HUD
  document.getElementById('hud-count').textContent = `${count} / 5`;

  // School nodes
  Object.keys(SCHOOLS).forEach(id => {
    const node  = document.querySelector(`.map-node[data-school="${id}"]`);
    const stamp = document.getElementById(`stamp-${id}`);
    if (state.discovered.includes(id)) {
      node.classList.add('discovered');
      stamp.textContent = '✅';
    } else {
      node.classList.remove('discovered');
      stamp.textContent = '';
    }
    node.onclick = () => startAdventure(id);
  });

}

// ============================================================
// Adventure screen
// ============================================================

async function startAdventure(schoolId) {
  state.activeSchool = schoolId;
  state.accumulatedTags = [];
  state.adventureHistory = [];
  state.currentNodeId = null;
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

// historySnapshot: tags[] to save with the current node in history, or _NO_PUSH to skip recording
function renderAdventureNode(nodeId, historySnapshot = _NO_PUSH) {
  const node = state.adventureNodes.find(n => n.id === nodeId);
  if (!node) return;

  // Push current node + tag snapshot to history (so Back can restore it)
  if (historySnapshot !== _NO_PUSH && state.currentNodeId !== null) {
    state.adventureHistory.push({ nodeId: state.currentNodeId, tags: historySnapshot });
  }
  state.currentNodeId = nodeId;
  showScreen('adventure');

  // Show/hide Back button
  const backBtn = document.getElementById('btn-adventure-back');
  backBtn.hidden = state.adventureHistory.length === 0;

  document.getElementById('story-text').textContent = node.text;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  if (node.unlocks) {
    // Diagnosis node: show CTA instead of auto-navigating
    const allTags = [...state.accumulatedTags, ...(node.requiredTags || [])];
    const cta = document.createElement('button');
    cta.className = 'cta-discover';
    cta.innerHTML = '<span class="cta-discover__arrow">→</span>Discover your course suggestions';
    cta.onclick = () => unlockSchool(node.unlocks, allTags);
    choicesEl.appendChild(cta);
    return;
  }

  node.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.label;
    btn.onclick = () => {
      const prevTags = [...state.accumulatedTags]; // snapshot before this choice
      state.accumulatedTags.push(...(choice.tags || []));
      renderAdventureNode(choice.next, prevTags);
    };
    choicesEl.appendChild(btn);
  });
}

function goBackAdventure() {
  const prev = state.adventureHistory.pop();
  if (!prev) return;
  state.accumulatedTags = [...prev.tags];
  renderAdventureNode(prev.nodeId); // _NO_PUSH default — won't re-record
}

// ============================================================
// School card screen
// ============================================================

async function unlockSchool(schoolId, allTags = []) {
  if (!state.discovered.includes(schoolId)) {
    state.discovered.push(schoolId);
    saveDiscovered(state.discovered);
  }
  await renderSchoolCard(schoolId, allTags);
}

async function renderSchoolCard(schoolId, accumulatedTags = []) {
  showScreen('school-card');
  document.getElementById('card-name').textContent = SCHOOLS[schoolId].name;
  document.getElementById('card-desc').textContent = SCHOOL_DESCS[schoolId];

  // Reset tooltip
  const tooltipBox = document.getElementById('tooltip-box');
  tooltipBox.hidden = true;
  document.getElementById('tooltip-btn').onclick = () => { tooltipBox.hidden = !tooltipBox.hidden; };

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

  // Catalog link (remove old one first to avoid duplicates on revisit)
  document.getElementById('catalog-link')?.remove();
  const link = document.createElement('a');
  link.id = 'catalog-link';
  link.className = 'catalog-link';
  link.href = 'https://course-resources.minerva.edu/uploaded_files/mu/00392403-0617/course-catalog-rev-352.pdf';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = '📚 Browse full course catalog →';
  listEl.after(link);

  document.getElementById('btn-return-map').onclick = () => renderMap();
}

// ============================================================
// Init
// ============================================================

async function init() {
  state.discovered = loadDiscovered();

  // Keyboard movement on map
  document.addEventListener('keydown', handleMapKeys);

  // Adventure navigation
  document.getElementById('btn-adventure-back').onclick = goBackAdventure;
  document.getElementById('btn-adventure-exit').onclick = () => renderMap();

  renderWelcome();
}

document.addEventListener('DOMContentLoaded', init);
