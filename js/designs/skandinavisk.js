// "Skandinavisk minimalisme": off-white, one plain sans, generous negative space, a single small line or dot.
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#26262a', SOFT = '#7a766f', PAPER = '#f6f2ea';
  const NAME = { family: F.jost, weight: 400, ls: 0.24 };
  const SUB = { family: F.jost, weight: 400, ls: 0.36 };

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    const { str, size } = S.fitName(item.name, { ...NAME, width: 44, max: 6 });
    const hasSub = !!item.sub;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="0.28"/>`;
    g += `<path d="M27.6,8.4 h4.8" stroke="${INK}" stroke-width="0.3"/>`;
    g += S.text(str, { ...NAME, x: cx, y: (hasSub ? 15.2 : 16.6) + size * 0.35, size, fill: INK });
    if (hasSub) {
      const sub = item.sub.toUpperCase();
      const ss = S.fit.size(sub, { ...SUB, width: 34, max: 2.3 });
      g += S.text(sub, { ...SUB, x: cx, y: 22.4, size: ss, fill: SOFT });
    }
    return S.svg(W, H, g);
  }

  function circle(item, o) {
    const c = L.C;
    let g = L.base(PAPER, o.notch);
    g += L.ring(12.7, o.notch, `stroke="${INK}" stroke-width="0.14"`);
    const orn = L.ornament(o);
    g += `<circle cx="${orn.x}" cy="${orn.y}" r="0.5" fill="${INK}"/>`;
    const hasSub = !!item.sub;
    const ty = L.textY(o) - (hasSub ? 0.7 : 0);
    const nm = { ...NAME, ls: 0.16 };
    const { str, size } = S.fitName(item.name, { ...nm, width: L.width(12.7, ty - c + 1.5, 2.2), max: 4 });
    g += S.text(str, { ...nm, x: c, y: ty + size * 0.35, size, fill: INK });
    if (hasSub) {
      const sub = item.sub.toUpperCase();
      const sy = ty + size * 0.35 + 2.6;
      const ss = S.fit.size(sub, { ...SUB, width: L.width(12.7, sy - c, 5), max: 1.7 });
      g += S.text(sub, { ...SUB, x: c, y: sy, size: ss, fill: SOFT });
    }
    g += L.hole(o.hole, '#999');
    return S.svg(L.D, L.D, g);
  }

  // Ø30 mm full-circle lid: one dot, tracked name centred on the lower arc
  function circle30(item) {
    const l = S.lid30, c = l.C;
    let g = l.base(PAPER);
    g += l.ring(14.2, `stroke="${INK}" stroke-width="0.14"`);
    g += `<circle cx="${c}" cy="${c - 5.6}" r="0.5" fill="${INK}"/>`;
    const rb = 10.2, str = item.name.toUpperCase();
    const nm = { ...NAME, ls: 0.2 };
    const size = S.fit.size(str, { ...nm, width: S.arcLen(rb, 0.8), max: 3.6 });
    g += S.arcText(str, { ...nm, cx: c, cy: c, r: rb, size, fill: INK });
    if (item.sub) {
      const sub = item.sub.toUpperCase();
      const ss = S.fit.size(sub, { ...SUB, width: 13, max: 1.8 });
      g += S.text(sub, { ...SUB, x: c, y: c + 2.4, size: ss, fill: SOFT });
    }
    return S.svg(l.D, l.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="1.6" y="1.6" width="${W - 3.2}" height="${H - 3.2}" fill="none" stroke="${INK}" stroke-width="0.14"/>`;
    const t = S.fit.lines(cat.name.toUpperCase(), { family: F.jost, weight: 500, ls: 0.22, width: 54, max: 5.4, minSingle: 4 });
    const ys = S.titleBaselines(t.lines.length, t.size, 4, 15.5);
    t.lines.forEach((ln, k) => { g += S.text(ln, { family: F.jost, weight: 500, ls: 0.22, x: cx, y: ys[k], size: t.size, fill: INK }); });
    g += `<path d="M${cx - 2.4},18.6 h4.8" stroke="${INK}" stroke-width="0.3"/>`;
    g += S.boxRows(items, { x: 5, y: 22, w: 60, h: 44, ink: INK, rule: '#a19d95', family: F.jost, weight: 400, nameW: 30, upper: true, ls: 0.1 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'skandinavisk', name: 'Skandinavisk',
    blurb: 'Quiet, airy, plain sans. One line, lots of space.',
    rect, circle, circle30, box,
  });
})(window.Spice);
