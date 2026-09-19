// "Apotek / laboratorium": monospace, sections split by thin rules, metadata fields, one muted accent.
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#1b1b1b', GREY = '#77726a', PAPER = '#f1ead6', ACCENT = '#9b3d24';
  const M = (w) => ({ family: F.mono, weight: w, ls: 0.04 });

  const pad = (n) => String(n || 0).padStart(3, '0');

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${INK}" stroke-width="0.35"/>`;
    g += `<path stroke="${INK}" stroke-width="0.22" d="M0.5,7.4 H${W - 0.5} M0.5,22.6 H${W - 0.5}"/>`;
    // top section: number left, category right
    g += `<rect x="0.5" y="0.5" width="1.6" height="6.9" fill="${ACCENT}"/>`;
    g += S.text(`NR. ${pad(item.no)}`, { ...M(500), x: 3.4, y: 5.1, size: 2.3, fill: INK, anchor: 'start' });
    if (item.cat) {
      const cat = `KATEGORI: ${item.cat.toUpperCase()}`;
      const s = S.fit.size(cat, { ...M(400), width: 36, max: 2.1 });
      g += S.text(cat, { ...M(400), x: W - 2.4, y: 5.1, size: s, fill: GREY, anchor: 'end' });
    }
    // middle: name
    const { str, size } = S.fitName(item.name, { ...M(700), width: 54, max: 8.4 });
    g += S.text(str, { ...M(700), x: cx, y: 15 + size * 0.36, size, fill: INK });
    // bottom: type + origin, or a ruler when there is nothing to say
    const parts = [];
    if (item.sub) parts.push(`TYPE: ${item.sub.toUpperCase()}`);
    if (item.origin) parts.push(`OPPRINNELSE: ${item.origin.toUpperCase()}`);
    if (parts.length) {
      parts.forEach((p, k) => {
        const s = S.fit.size(p, { ...M(400), width: parts.length === 1 ? 50 : 26, max: 2.3 });
        const right = parts.length === 2 && k === 1;
        g += S.text(p, { ...M(400), x: right ? W - 2.4 : 3.4, y: 27.3, size: s, fill: k === 0 ? INK : GREY, anchor: right ? 'end' : 'start' });
      });
    } else {
      let d = '';
      for (let x = 3.4, k = 0; x <= W - 3.4; x += 2, k++) d += `M${x},25.1 v${k % 5 === 0 ? 2.6 : 1.4}`;
      g += `<path stroke="${GREY}" stroke-width="0.2" d="${d}"/>`;
    }
    return S.svg(W, H, g);
  }

  function circle(item, o) {
    const c = L.C, R = 12.4;
    let g = L.base(PAPER, o.notch);
    g += L.ring(13.0, o.notch, `stroke="${INK}" stroke-width="0.3"`);
    // number in the upper-left quadrant
    const orn = L.ornament(o);
    g += S.text(`NR. ${pad(item.no)}`, { ...M(500), x: orn.x, y: orn.y + 0.7, size: 1.9, fill: INK });
    g += `<rect x="${orn.x - 1.2}" y="${orn.y + 2}" width="2.4" height="0.7" fill="${ACCENT}"/>`;
    // sections (top to bottom): number | rule | name | rule | type
    const top = o.hole ? 3.6 : o.notch ? 2.4 : 1.4;
    const rule = (dy) => {
      const h = Math.sqrt(R * R - dy * dy) - 0.4;
      return `<path stroke="${INK}" stroke-width="0.2" d="M${c - h},${c + dy} H${c + h}"/>`;
    };
    const hasSub = !!item.sub;
    const nameMid = top + (hasSub ? 2.7 : 3.4);
    g += rule(top);
    const { str, size } = S.fitName(item.name, { ...M(700), width: L.width(R, nameMid + 1.5, 1.8), max: 3.8 });
    g += S.text(str, { ...M(700), x: c, y: c + nameMid + size * 0.36, size, fill: INK });
    if (hasSub) {
      g += rule(top + 5.3);
      const t = `TYPE: ${item.sub.toUpperCase()}`;
      const dy = top + 7.4;
      const s = S.fit.size(t, { ...M(400), width: L.width(R, dy + 0.5, 1.8), max: 1.9 });
      g += S.text(t, { ...M(400), x: c, y: c + dy, size: s, fill: GREY });
    } else {
      g += rule(top + 6.8);
    }
    g += L.hole(o.hole, GREY);
    return S.svg(L.D, L.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.6" y="0.6" width="${W - 1.2}" height="${H - 1.2}" fill="none" stroke="${INK}" stroke-width="0.4"/>`;
    g += `<path stroke="${INK}" stroke-width="0.22" d="M0.6,6.6 H${W - 0.6} M0.6,22.6 H${W - 0.6}"/>`;
    g += `<rect x="0.6" y="0.6" width="1.8" height="6" fill="${ACCENT}"/>`;
    g += S.text('KATEGORI', { ...M(500), x: 4, y: 4.7, size: 2.3, fill: INK, anchor: 'start' });
    g += S.text(`${items.length} STK`, { ...M(400), x: W - 3, y: 4.7, size: 2.1, fill: GREY, anchor: 'end' });
    const t = S.fit.lines(cat.name.toUpperCase(), { ...M(700), width: 60, max: 6.4, minSingle: 4.6 });
    const ys = S.titleBaselines(t.lines.length, t.size, 7.2, 22.2);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...M(700), x: cx, y: ys[k], size: t.size, fill: INK }); });
    g += S.boxRows(items, { x: 5, y: 24.8, w: 60, h: 41, ink: INK, rule: GREY, family: F.mono, weight: 500, nameW: 29, upper: true });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'apotek', name: 'Apotek',
    blurb: 'Mono type, ruled sections, NR. / TYPE / KATEGORI fields.',
    rect, circle, box,
  });
})(window.Spice);
