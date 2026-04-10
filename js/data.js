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
