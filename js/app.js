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
  screen: 'welcome',
  discovered: [],
  activeSchool: null,
  adventureNodes: [],
  currentNodeId: null,
  accumulatedTags: [],
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
// World map screen
// ============================================================

function renderMap() {
  showScreen('map');
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
  document.querySelectorAll('.zone-tile').forEach(tile => {
    tile.onclick = () => startAdventure(tile.dataset.school);
  });
}

// ============================================================
// Adventure screen
// ============================================================

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

// ============================================================
// Summary screen
// ============================================================

function renderSummary() {
  showScreen('summary');

  const badgeRow = document.getElementById('badge-row');
  badgeRow.innerHTML = '';
  state.discovered.forEach(id => {
    const badge = document.createElement('div');
    badge.className = 'school-badge';
    badge.textContent = `${SCHOOLS[id].icon} ${SCHOOLS[id].name}`;
    badgeRow.appendChild(badge);
  });

  const firstSchool = state.discovered[0];
  const blurbEl = document.getElementById('summary-blurb');
  blurbEl.innerHTML = `<p>${SUMMARY_BLURBS[firstSchool]}</p>`;
}

// ============================================================
// Init
// ============================================================

async function init() {
  state.discovered = loadDiscovered();
  renderWelcome();
}

document.addEventListener('DOMContentLoaded', init);
