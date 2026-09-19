(function (S) {
  const $ = (sel, root) => (root || document).querySelector(sel);
  let st = S.state.load();

  const sheetsEl = $('#sheets');
  const scalerEl = $('#scaler');
  const paneEl = $('#preview');
  const A4_PX = (210 / 25.4) * 96;

  // ---- preview ---------------------------------------------------------------------------
  function renderSheets() {
    const out = S.layout.build(st);
    sheetsEl.innerHTML = out.html || '<p class="empty">Nothing to print. Add spices or switch a label type on.</p>';
    sheetsEl.classList.toggle('cuts', st.cuts);
    $('#summary').textContent = `${out.spices} spices · ${out.sheets} sheet${out.sheets === 1 ? '' : 's'}`;
    fitPreview();
  }

  function fitPreview() {
    const avail = paneEl.clientWidth - 32;
    const s = Math.min(1, avail / A4_PX);
    sheetsEl.style.transform = `scale(${s})`;
    scalerEl.style.width = `${A4_PX * s}px`;
    scalerEl.style.height = `${sheetsEl.offsetHeight * s}px`;
  }

  // ---- design picker ---------------------------------------------------------------------
  function renderPicker() {
    const sample = { name: 'Paprika', sub: 'søt', origin: 'Spania', no: 14, cat: 'Chili og paprika' };
    $('#designs').innerHTML = S.designs.all().map((d) =>
      `<button type="button" class="design${d.id === st.design ? ' on' : ''}" data-id="${d.id}" aria-pressed="${d.id === st.design}">` +
      `<span class="minis"><span class="mini-rect">${d.rect(sample)}</span><span class="mini-circ">${d.circle(sample, { hole: st.hole, notch: st.notch })}</span></span>` +
      `<span class="dname">${S.esc(d.name)}</span><span class="dblurb">${S.esc(d.blurb)}</span></button>`
    ).join('');
  }

  // ---- list editor -----------------------------------------------------------------------
  function renderEditor() {
    $('#cats').innerHTML = st.categories.map((c, i) =>
      `<div class="cat" data-i="${i}">` +
      `<div class="cat-head"><input class="cat-name" aria-label="Category name" value="${S.esc(c.name)}">` +
      `<label class="chk" title="Print a 7×7 cm box label for this category"><input type="checkbox" class="cat-box"${c.box ? ' checked' : ''}> box</label>` +
      `<button type="button" class="del" aria-label="Remove category" title="Remove category">×</button></div>` +
      `<textarea aria-label="Spices in ${S.esc(c.name)}" rows="${Math.max(2, c.items.length + 1)}" spellcheck="false">${S.esc(c.items.join('\n'))}</textarea></div>`
    ).join('');
  }

  let timer;
  function changed(rebuildPicker) {
    S.state.save(st);
    clearTimeout(timer);
    timer = setTimeout(() => { renderSheets(); }, 120);
    if (rebuildPicker) renderPicker();
  }

  function bind() {
    $('#designs').addEventListener('click', (e) => {
      const b = e.target.closest('.design');
      if (!b) return;
      st.design = b.dataset.id;
      renderPicker();
      changed();
    });

    [['cuts', '#opt-cuts'], ['hole', '#opt-hole'], ['notch', '#opt-notch'], ['jars', '#opt-jars'], ['boxes', '#opt-boxes']].forEach(([key, sel]) => {
      const el = $(sel);
      el.checked = !!st[key];
      el.addEventListener('change', () => { st[key] = el.checked; changed(key === 'hole' || key === 'notch'); });
    });

    const cats = $('#cats');
    cats.addEventListener('input', (e) => {
      const cat = e.target.closest('.cat');
      if (!cat) return;
      const c = st.categories[+cat.dataset.i];
      if (e.target.matches('.cat-name')) c.name = e.target.value;
      else if (e.target.matches('textarea')) c.items = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
      changed();
    });
    cats.addEventListener('change', (e) => {
      if (!e.target.matches('.cat-box')) return;
      st.categories[+e.target.closest('.cat').dataset.i].box = e.target.checked;
      changed();
    });
    cats.addEventListener('click', (e) => {
      if (!e.target.matches('.del')) return;
      const i = +e.target.closest('.cat').dataset.i;
      if (!confirm(`Remove "${st.categories[i].name}" and its spices?`)) return;
      st.categories.splice(i, 1);
      renderEditor();
      changed();
    });

    $('#add-cat').addEventListener('click', () => {
      st.categories.push({ id: 'c' + Date.now(), name: 'New category', box: true, items: [] });
      renderEditor();
      changed();
      const last = cats.querySelector('.cat:last-child .cat-name');
      last.focus(); last.select();
    });
    $('#reset').addEventListener('click', () => {
      if (!confirm('Reset everything to the default spice list and settings?')) return;
      st = S.state.defaults();
      S.state.save(st);
      init();
    });
    $('#print').addEventListener('click', () => window.print());
    window.addEventListener('resize', fitPreview);
    window.addEventListener('beforeprint', () => { sheetsEl.style.transform = 'none'; });
    window.addEventListener('afterprint', fitPreview);
  }

  // ---- boot ------------------------------------------------------------------------------
  function loadFonts() {
    const all = Promise.all(S.fontSpecs.map((s) => document.fonts.load(s).catch(() => [])));
    return Promise.race([all, new Promise((res) => setTimeout(res, 4000))]);
  }

  function init() {
    [['cuts', '#opt-cuts'], ['hole', '#opt-hole'], ['notch', '#opt-notch'], ['jars', '#opt-jars'], ['boxes', '#opt-boxes']]
      .forEach(([key, sel]) => { $(sel).checked = !!st[key]; });
    renderPicker();
    renderEditor();
    renderSheets();
  }

  init();
  bind();
  // Re-render once web fonts are in: text fitting measures real glyph widths.
  loadFonts().then(() => { renderPicker(); renderSheets(); document.documentElement.classList.add('fonts-ready'); });
})(window.Spice);
