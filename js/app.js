(function (S) {
  const $ = (sel, root) => (root || document).querySelector(sel);
  let st = S.state.load();
  const OPTIONS = [['cuts', '#opt-cuts'], ['hole', '#opt-hole'], ['notch', '#opt-notch'], ['jars', '#opt-jars'], ['lids', '#opt-lids'], ['boxes', '#opt-boxes']];

  const sheetsEl = $('#sheets');
  const scalerEl = $('#scaler');
  const paneEl = $('#preview');
  const A4_PX = (210 / 25.4) * 96;

  // ---- preview ---------------------------------------------------------------------------
  function renderSheets() {
    const out = S.layout.build(st);
    sheetsEl.innerHTML = out.html || '<p class="empty">Nothing to print. Tick jar, lid or box labels for at least one category.</p>';
    sheetsEl.classList.toggle('cuts', st.cuts);
    $('#summary').textContent = `${out.jars} jar · ${out.lids} lid · ${out.boxes} box labels on ${out.sheets} sheet${out.sheets === 1 ? '' : 's'}.`;
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
    const sample = S.enrich({ name: 'Paprika', sub: 'søt', origin: 'Spania', no: 201, cat: 'Chili og paprika' });
    $('#designs').innerHTML = S.designs.all().map((d) =>
      `<button type="button" class="design${d.id === st.design ? ' on' : ''}" data-id="${d.id}" aria-pressed="${d.id === st.design}">` +
      `<span class="minis"><span class="mini-rect">${d.rect(sample)}</span><span class="mini-circ">${S.layout.lidSvg(d, sample, st)}</span></span>` +
      `<span class="dname">${S.esc(d.name)}</span><span class="dblurb">${S.esc(d.blurb)}</span></button>`
    ).join('');
  }

  // ---- list editor -----------------------------------------------------------------------
  function renderEditor() {
    const chk = (cls, on, title, text) =>
      `<label class="chk" title="${title}"><input type="checkbox" class="${cls}"${on ? ' checked' : ''}> ${text}</label>`;
    $('#cats').innerHTML = st.categories.map((c, i) =>
      `<div class="cat${c.jar === false && c.lid === false && !c.box ? ' off' : ''}" data-i="${i}">` +
      `<div class="cat-head"><span class="cat-no" title="Category number: spices are numbered ${c.n}01, ${c.n}02, …">${c.n}xx</span>` +
      `<input class="cat-name" aria-label="Category name" value="${S.esc(c.name)}">` +
      `<button type="button" class="del" aria-label="Remove category" title="Remove category">×</button></div>` +
      `<div class="cat-opts">` +
      chk('cat-jar', c.jar !== false, 'Print a 60×30 mm jar label for each spice', 'jar') +
      chk('cat-lid', c.lid !== false, 'Print a lid label for each spice', 'lid') +
      chk('cat-box', c.box, 'Print a 7×7 cm box label for this category', 'box') +
      `</div>` +
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

  // The hole / cut-out switches only belong to the Ø27 style.
  function syncLidStyle() {
    document.querySelectorAll('input[name="lid-style"]').forEach((r) => { r.checked = r.value === st.lidStyle; });
    const round = st.lidStyle === 'round30';
    document.querySelectorAll('.opt.sub').forEach((l) => { l.classList.toggle('dim', round); l.querySelector('input').disabled = round; });
  }

  function bind() {
    document.querySelectorAll('input[name="lid-style"]').forEach((r) => r.addEventListener('change', () => {
      if (!r.checked) return;
      st.lidStyle = r.value;
      syncLidStyle();
      changed(true);
    }));
    $('#designs').addEventListener('click', (e) => {
      const b = e.target.closest('.design');
      if (!b) return;
      st.design = b.dataset.id;
      renderPicker();
      changed();
    });

    OPTIONS.forEach(([key, sel]) => {
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
      const cat = e.target.closest('.cat');
      if (!cat) return;
      const c = st.categories[+cat.dataset.i];
      if (e.target.matches('.cat-jar')) c.jar = e.target.checked;
      else if (e.target.matches('.cat-lid')) c.lid = e.target.checked;
      else if (e.target.matches('.cat-box')) c.box = e.target.checked;
      else return;
      cat.classList.toggle('off', c.jar === false && c.lid === false && !c.box);
      changed();
    });
    const setAll = (on) => { st.categories.forEach((c) => { c.jar = on; c.lid = on; c.box = on; }); renderEditor(); changed(); };
    $('#print-all').addEventListener('click', () => setAll(true));
    $('#print-none').addEventListener('click', () => setAll(false));
    cats.addEventListener('click', (e) => {
      if (!e.target.matches('.del')) return;
      const i = +e.target.closest('.cat').dataset.i;
      if (!confirm(`Remove "${st.categories[i].name}" and its spices?`)) return;
      st.categories.splice(i, 1);
      renderEditor();
      changed();
    });

    $('#add-cat').addEventListener('click', () => {
      st.categories.push({ id: 'c' + Date.now(), n: S.state.nextCategoryNumber(st.categories), name: 'New category', box: true, jar: true, lid: true, items: [] });
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
    OPTIONS.forEach(([key, sel]) => { $(sel).checked = !!st[key]; });
    syncLidStyle();
    renderPicker();
    renderEditor();
    renderSheets();
  }

  init();
  bind();
  // Re-render once web fonts are in: text fitting measures real glyph widths.
  loadFonts().then(() => { renderPicker(); renderSheets(); document.documentElement.classList.add('fonts-ready'); });
})(window.Spice);
