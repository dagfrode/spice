// Pagination: turns the app state into A4 sheets (HTML strings).
// Rectangles sit edge to edge in one block and circles in another, so each group can be cut with
// a few straight guillotine cuts (rects) or a punch / scissors round the grid (circles).
window.Spice = window.Spice || {};
(function (S) {
  const RECT = { cols: 3, rows: 9, x: 15, y: 13 };    // 3 x 60 = 180 mm, 9 x 30 = 270 mm  -> 27 per sheet
  const CIRC = { cols: 6, rows: 9, pitch: 28 }; // 27 mm circles on a 28 mm pitch -> 54 per sheet
  const CIRC30 = { cols: 6, rows: 8, pitch: 31, x: 12, y: 24 }; // Ø30 mm circles on a 31 mm pitch -> 48 per sheet
  const BOX = { cols: 2, rows: 3, gap: 5 };     // 70 mm boxes -> 6 per sheet

  const chunk = (arr, n) => {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  };

  function sheet(kind, tag, body, style, extra) {
    return `<div class="sheet-tag">${S.esc(tag)}</div>` +
      `<section class="sheet ${kind}"><div class="grid ${kind}-grid" style="${style}">${body}</div>${extra || ''}</section>`;
  }

  // Short ticks in the paper margin at every row/column line of the rectangle block: cut along the
  // ticks and nothing else (the labels touch, so there is nothing to trim in between).
  function cutMarks(n) {
    const rows = Math.ceil(n / RECT.cols);
    const x0 = RECT.x, y0 = RECT.y, x1 = x0 + RECT.cols * 60, y1 = y0 + rows * 30;
    let d = '';
    for (let i = 0; i <= RECT.cols; i++) { const x = x0 + i * 60; d += `M${x},${y0 - 5} V${y0 - 1.5} M${x},${y1 + 1.5} V${y1 + 5} `; }
    for (let j = 0; j <= rows; j++) { const y = y0 + j * 30; d += `M${x0 - 5},${y} H${x0 - 1.5} M${x1 + 1.5},${y} H${x1 + 5} `; }
    return `<svg class="marks" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 296" width="210mm" height="296mm">` +
      `<path d="${d}" fill="none" stroke="#777" stroke-width="0.15"/></svg>`;
  }

  // Every spice as a numbered, enriched item (number = category number * 100 + position).
  function items(st) {
    const out = [];
    const takes = {}; // "paprika" -> 2 once "Paprika / søt" and "Paprika / røkt" are both in
    st.categories.forEach((c) => c.items.forEach((line, i) => {
      const it = S.parseItem(line);
      const key = it.name.toLowerCase();
      takes[key] = (takes[key] || 0) + 1;
      out.push(S.enrich({ ...it, no: (c.n || 0) * 100 + i + 1, cat: c.name, take: takes[key], jar: c.jar !== false, lid: c.lid !== false }));
    }));
    return out;
  }

  // The lid artwork and cut guide for the chosen lid style (a design without circle30 falls back to a plain circle).
  function lidSvg(d, item, st) {
    return st.lidStyle === 'round30'
      ? (d.circle30 ? d.circle30(item) : d.circle(item, { hole: false, notch: false })) + S.lid30.guide()
      : d.circle(item, { hole: st.hole, notch: st.notch }) + S.lid.guide(st.notch);
  }

  function build(st) {
    const d = S.designs.get(st.design);
    const all = items(st); // numbered over every category, so unticking one never shifts the numbers
    const jars = st.jars ? all.filter((it) => it.jar) : [];
    const lids = st.lids ? all.filter((it) => it.lid) : [];
    const boxes = st.boxes ? st.categories.filter((c) => c.box && c.items.length) : [];
    let html = '';
    let sheetNo = 0;

    const rects = chunk(jars, RECT.cols * RECT.rows);
    rects.forEach((page, i) => {
      const body = page.map((it) => `<div class="lbl rect">${d.rect(it)}</div>`).join('');
      html += sheet('rects', `Jar labels ${i + 1}/${rects.length}`, body,
        `left:${RECT.x}mm;top:${RECT.y}mm;grid-template-columns:repeat(${RECT.cols},60mm);grid-auto-rows:30mm`, cutMarks(page.length));
    });

    const big = st.lidStyle === 'round30';
    const grid = big ? CIRC30 : CIRC;
    const circs = chunk(lids, grid.cols * grid.rows);
    circs.forEach((page, i) => {
      const body = page.map((it) => `<div class="lbl circ">${lidSvg(d, it, st)}</div>`).join('');
      html += sheet('circs', `Lid labels${big ? ' Ø30' : ''} ${i + 1}/${circs.length}`, body,
        `${big ? `left:${CIRC30.x}mm;top:${CIRC30.y}mm;` : ''}grid-template-columns:repeat(${grid.cols},${grid.pitch}mm);grid-auto-rows:${grid.pitch}mm`);
    });

    const boxPages = chunk(boxes, BOX.cols * BOX.rows);
    boxPages.forEach((page, i) => {
      const body = page.map((c) => `<div class="lbl boxl">${d.box(c, c.items.map(S.parseItem))}</div>`).join('');
      html += sheet('boxes', `Box labels ${i + 1}/${boxPages.length}`, body,
        `grid-template-columns:repeat(${BOX.cols},70mm);grid-auto-rows:70mm;gap:${BOX.gap}mm`);
    });

    sheetNo = rects.length + circs.length + boxPages.length;
    return { html, sheets: sheetNo, jars: jars.length, lids: lids.length, boxes: boxes.length };
  }

  S.layout = { build, lidSvg };
})(window.Spice);
