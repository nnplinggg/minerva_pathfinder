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
