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
