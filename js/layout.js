// Pagination: turns the app state into A4 sheets (HTML strings).
// Rectangles sit edge to edge in one block and circles in another, so each group can be cut with
// a few straight guillotine cuts (rects) or a punch / scissors round the grid (circles).
window.Spice = window.Spice || {};
(function (S) {
  const RECT = { cols: 3, rows: 9 };    // 3 x 60 = 180 mm, 9 x 30 = 270 mm  -> 27 per sheet
  const CIRC = { cols: 6, rows: 9, pitch: 28 }; // 27 mm circles on a 28 mm pitch -> 54 per sheet
  const BOX = { cols: 2, rows: 3, gap: 5 };     // 70 mm boxes -> 6 per sheet

  const chunk = (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  };

  function sheet(kind, tag, body, style) {
    return `<div class="sheet-tag">${S.esc(tag)}</div>` +
      `<section class="sheet ${kind}"><div class="grid ${kind}-grid" style="${style}">${body}</div></section>`;
  }

  function build(st) {
    const d = S.designs.get(st.design);
    const cats = st.categories;
    const jars = [];
    cats.forEach((c) => c.items.forEach((line) => jars.push({ ...S.parseItem(line), no: jars.length + 1, cat: c.name })));
    let html = '';
    let sheetNo = 0;
    const lid = { hole: st.hole, notch: st.notch };

    if (st.jars && jars.length) {
      const rects = chunk(jars, RECT.cols * RECT.rows);
      rects.forEach((page, i) => {
        const body = page.map((it) => `<div class="lbl rect">${d.rect(it)}</div>`).join('');
        html += sheet('rects', `Jar labels ${i + 1}/${rects.length}`, body,
          `grid-template-columns:repeat(${RECT.cols},60mm);grid-auto-rows:30mm`);
      });
      const circs = chunk(jars, CIRC.cols * CIRC.rows);
      circs.forEach((page, i) => {
        const body = page.map((it) => `<div class="lbl circ">${d.circle(it, lid)}${S.lid.guide(st.notch)}</div>`).join('');
        html += sheet('circs', `Lid labels ${i + 1}/${circs.length}`, body,
          `grid-template-columns:repeat(${CIRC.cols},${CIRC.pitch}mm);grid-auto-rows:${CIRC.pitch}mm`);
      });
      sheetNo += rects.length + circs.length;
    }

    if (st.boxes) {
      const boxes = cats.filter((c) => c.box && c.items.length);
      const pages = chunk(boxes, BOX.cols * BOX.rows);
      pages.forEach((page, i) => {
        const body = page.map((c) => `<div class="lbl boxl">${d.box(c, c.items.map(S.parseItem))}</div>`).join('');
        html += sheet('boxes', `Box labels ${i + 1}/${pages.length}`, body,
          `grid-template-columns:repeat(${BOX.cols},70mm);grid-auto-rows:70mm;gap:${BOX.gap}mm`);
      });
      sheetNo += pages.length;
    }
    return { html, sheets: sheetNo, spices: jars.length };
  }

  S.layout = { build };
})(window.Spice);
