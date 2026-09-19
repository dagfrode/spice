// "Brutalistisk typografi": one heavy compressed face, name as large as it will go, off-centre. No ornament.
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#0a0a0a', PAPER = '#f3efe4', GREY = '#8a877d';
  const CAP = 0.88; // Anton cap height / em
  const BASE = { family: F.anton, weight: 400, ls: 0.01 };
  const TINY = { family: F.anton, weight: 400, ls: 0.34 };

  // Name set as big as it can go: width-fit first, then stretched vertically up to `cap` mm tall.
  function slab(str, o) {
    const em = S.fit.size(str, { ...BASE, width: o.width, max: o.cap / CAP });
    const sy = Math.max(1, Math.min(o.maxSy || 2.4, o.cap / (em * CAP)));
    const x = o.x;
    return `<text transform="translate(${x} ${o.y}) scale(1 ${sy.toFixed(3)})" font-size="${em.toFixed(3)}" ` +
      `font-family="${BASE.family}" fill="${INK}" text-anchor="${o.anchor || 'start'}" letter-spacing="${(0.01 * em).toFixed(3)}">${S.esc(str)}</text>`;
  }

  function rect(item) {
    const W = 60, H = 30;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += slab(item.name.toUpperCase(), { x: 1.8, y: 28, width: 56.4, cap: 19.5 });
    if (item.sub) {
      const sub = item.sub.toUpperCase();
      const s = S.fit.size(sub, { ...TINY, width: 30, max: 2.7 });
      g += S.text(sub, { ...TINY, x: W - 2, y: 5.6, size: s, fill: INK, anchor: 'end' });
    }
    return S.svg(W, H, g);
  }

  function circle(item, o) {
    const c = L.C;
    let g = L.base(PAPER, o.notch);
    // name in the lower half, squeezed and stretched to fill it
    const base = c + (o.hole ? 9.6 : o.notch ? 9.6 : 7.6);
    const top = c + (o.hole ? 4.2 : 1.6);
    const width = L.width(13.2, base - c - 0.3, 3);
    g += slab(item.name.toUpperCase(), { x: c - width / 2, y: base, width, cap: base - top, maxSy: 3 });
    if (item.sub) {
      const sub = item.sub.toUpperCase();
      const s = S.fit.size(sub, { ...TINY, width: 10, max: 2.2 });
      g += `<g transform="translate(${c - 9.6} ${c}) rotate(-90)">` + S.text(sub, { ...TINY, x: 0, y: 0, size: s, fill: INK }) + '</g>';
    }
    g += L.hole(o.hole, GREY);
    return S.svg(L.D, L.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    const t = S.fit.lines(cat.name.toUpperCase(), { ...BASE, width: 62, max: 15, minSingle: 8.5 });
    const ys = S.titleBaselines(t.lines.length, t.size * 1.0, 3, 20.6);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...BASE, x: 4, y: ys[k] + t.size * 0.03, size: t.size, fill: INK, anchor: 'start' }); });
    g += `<rect x="0" y="22" width="${W}" height="1.3" fill="${INK}"/>`;
    g += S.boxRows(items, { x: 3, y: 25, w: 64, h: 41, ink: INK, rule: GREY, family: F.anton, weight: 400, nameW: 30, upper: true, ls: 0.05 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'brutalist', name: 'Brutalistisk',
    blurb: 'Huge compressed type pushed to the edge.',
    rect, circle, box,
  });
})(window.Spice);
