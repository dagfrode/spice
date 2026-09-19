// Persisted app state (localStorage, best-effort).
window.Spice = window.Spice || {};
(function (S) {
  const KEY = 'spice-labels-v1';

  const defaults = () => ({
    design: 'editorial',
    cuts: true,   // hairline cut guides around each label
    hole: true,   // 5 mm centre hole on the lid label
    notch: true,  // 1/4 cut-out (top right) on the lid label
    jars: true,   // print jar + lid labels
    boxes: true,  // print box labels
    categories: S.defaultCategories(),
  });

  function load() {
    const d = defaults();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && Array.isArray(saved.categories)) return Object.assign(d, saved);
    } catch (e) { /* private mode / corrupt data: fall back to defaults */ }
    return d;
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  S.state = { load, save, defaults };
})(window.Spice);
