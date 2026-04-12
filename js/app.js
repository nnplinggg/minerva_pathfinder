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

const LS_KEY        = 'minerva-pathfinder-discovered';
const LS_KEY_CHESTS = 'minerva-pathfinder-chests';

const CHESTS = [
  {
    id: 'chest-1',
    unlocksAt: 1,
    fact: 'Minerva students live and study in 6 global cities across 4 years — the most internationally mobile university program in the world.',
    linkLabel: 'Learn about city immersions →',
    url: '#',
  },
  {
    id: 'chest-2',
    unlocksAt: 2,
    fact: 'Minerva has no traditional lecture halls. Every class is a live, active-learning seminar — capped at 20 students — held via a custom video platform.',
    linkLabel: 'See how classes work →',
    url: '#',
  },
  {
    id: 'chest-3',
    unlocksAt: 3,
    fact: '100% of Minerva graduates complete at least one internship or applied project before graduating — connecting coursework directly to real-world problems.',
    linkLabel: 'Explore outcomes →',
    url: '#',
  },
];

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
  openedChests: [],
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

function loadOpenedChests() {
  try {
    const raw = localStorage.getItem(LS_KEY_CHESTS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveOpenedChests(opened) {
  localStorage.setItem(LS_KEY_CHESTS, JSON.stringify(opened));
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
  const count = state.discovered.length;

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

  // Treasure chests
  document.querySelectorAll('.map-chest').forEach(el => {
    const chestNum = parseInt(el.dataset.chest, 10);
    const chest    = CHESTS[chestNum - 1];
    const isOpen   = state.openedChests.includes(chest.id);
    const canOpen  = count >= chest.unlocksAt;

    el.classList.toggle('unlocked', canOpen && !isOpen);
    el.classList.toggle('opened',   isOpen);
    el.classList.remove('just-unlocked');

    el.onclick = (canOpen && !isOpen) ? () => openChest(chest, el) : null;
  });
}

function openChest(chest, chestEl) {
  if (!state.openedChests.includes(chest.id)) {
    state.openedChests.push(chest.id);
    saveOpenedChests(state.openedChests);
  }

  chestEl.classList.remove('unlocked');
  chestEl.classList.add('opened');

  document.getElementById('modal-fact').textContent = chest.fact;
  const link = document.getElementById('modal-link');
  link.textContent = chest.linkLabel;
  link.href        = chest.url;

  const modal = document.getElementById('chest-modal');
  modal.hidden = false;
  modal.querySelector('.chest-modal__box').focus();
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
  state.discovered   = loadDiscovered();
  state.openedChests = loadOpenedChests();

  // Wire modal close button
  document.getElementById('modal-close').onclick = () => {
    document.getElementById('chest-modal').hidden = true;
  };

  renderWelcome();
}

document.addEventListener('DOMContentLoaded', init);
