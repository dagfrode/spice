// Persisted app state (localStorage, best-effort).
window.Spice = window.Spice || {};
(function (S) {
  const KEY = 'spice-labels-v1';

  const defaults = () => ({
    design: 'editorial',
    cuts: true,   // hairline cut guides around each label
    lidStyle: 'notch27', // 'notch27' = Ø27 mm with 1/4 cut-out | 'round30' = Ø30 mm full circle
    hole: true,   // 5 mm centre hole on the lid label (Ø27 style only)
    notch: true,  // 1/4 cut-out (top right) on the lid label
    jars: true,   // print jar labels
    lids: true,   // print lid labels
    boxes: true,  // print box labels
    categories: S.defaultCategories(),
  });

  // Give every category a permanent, unique number (older saved lists have none).
  function ensureNumbers(cats) {
    let max = cats.reduce((m, c) => Math.max(m, c.n || 0), 0);
    cats.forEach((c) => {
      if (!c.n) c.n = ++max;
      if (c.print === false) { c.jar = false; c.lid = false; } // older combined flag
      delete c.print;
    });
    return cats;
  }

  function load() {
    const d = defaults();
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && Array.isArray(saved.categories)) {
        const st = Object.assign(d, saved);
        ensureNumbers(st.categories);
        return st;
      }
    } catch (e) { /* private mode / corrupt data: fall back to defaults */ }
    return d;
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  S.state = { load, save, defaults, nextCategoryNumber: (cats) => cats.reduce((m, c) => Math.max(m, c.n || 0), 0) + 1 };
})(window.Spice);
