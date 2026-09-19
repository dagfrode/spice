// "Art Deco": symmetric, stepped corners, double frame, diamonds. Cream, black, muted gold.
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#15110e', GOLD = '#a98431', PAPER = '#f5ecd7', BROWN = '#5b4630';
  const NAME = { family: F.limelight, weight: 400, ls: 0.06 };
  const SUB = { family: F.cormorant, weight: 600, style: 'italic', ls: 0.06 };

  // Rectangle with two-step corners.
  const stepped = (x, y, w, h, s) =>
    `M${x + 2 * s},${y} H${x + w - 2 * s} V${y + s} H${x + w - s} V${y + 2 * s} H${x + w} V${y + h - 2 * s} H${x + w - s} V${y + h - s} ` +
    `H${x + w - 2 * s} V${y + h} H${x + 2 * s} V${y + h - s} H${x + s} V${y + h - 2 * s} H${x} V${y + 2 * s} H${x + s} V${y + s} H${x + 2 * s}Z`;
  const diamond = (x, y, s, fill) => `<path fill="${fill}" d="M${x},${y - s} l${s},${s} l${-s},${s} l${-s},${-s}z"/>`;
  // Diamond with a line running out to each side.
  const flank = (cx, y, reach, gap, stroke, s) =>
    `<path stroke="${stroke}" stroke-width="0.22" d="M${cx - gap - reach},${y} H${cx - gap} M${cx + gap},${y} H${cx + gap + reach}"/>` + diamond(cx, y, s, stroke);

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    const hasSub = !!item.sub;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<path fill="none" stroke="${INK}" stroke-width="0.4" d="${stepped(0.7, 0.7, W - 1.4, H - 1.4, 1.2)}"/>`;
    g += `<path fill="none" stroke="${GOLD}" stroke-width="0.22" d="${stepped(2.4, 2.4, W - 4.8, H - 4.8, 0.9)}"/>`;
    g += flank(cx, 5.3, 9, 2.2, GOLD, 1.1);
    const { str, size } = S.fitName(item.name, { ...NAME, width: 42, max: 7.4 });
    g += S.text(str, { ...NAME, x: cx, y: (hasSub ? 14.6 : 16.2) + size * 0.35, size, fill: INK });
    g += diamond(6.4, hasSub ? 14.6 : 16.2, 1, GOLD) + diamond(W - 6.4, hasSub ? 14.6 : 16.2, 1, GOLD);
    if (hasSub) {
      const ss = S.fit.size(item.sub, { ...SUB, width: 22, max: 3.4 });
      const w = S.fit.measure(item.sub, SUB) * ss;
      g += S.text(item.sub, { ...SUB, x: cx, y: 21.8, size: ss, fill: BROWN });
      g += `<path stroke="${GOLD}" stroke-width="0.22" d="M${cx - w / 2 - 9},${21.8 - ss * 0.3} h7 M${cx + w / 2 + 2},${21.8 - ss * 0.3} h7"/>`;
    }
    g += flank(cx, H - 5.3, 9, 2.2, GOLD, 1.1);
    return S.svg(W, H, g);
  }

  function circle(item, o) {
    const c = L.C;
    let g = L.base(PAPER, o.notch);
    g += L.ring(13.0, o.notch, `stroke="${INK}" stroke-width="0.34"`);
    g += L.ring(12.1, o.notch, `stroke="${GOLD}" stroke-width="0.2"`);
    if (o.notch) g += diamond(c, c - 12.55, 0.8, GOLD) + diamond(c + 12.55, c, 0.8, GOLD);
    const orn = L.ornament(o);
    g += diamond(orn.x, orn.y, 1.5, GOLD);
    g += `<path stroke="${GOLD}" stroke-width="0.22" d="M${orn.x - 4.6},${orn.y} H${orn.x - 2.2} M${orn.x + 2.2},${orn.y} H${orn.x + (o.notch ? 3.4 : 4.6)}"/>`;
    const hasSub = !!item.sub;
    const ty = L.textY(o) - (hasSub ? 0.9 : 0.2);
    const { str, size } = S.fitName(item.name, { ...NAME, width: L.width(12.1, ty - c + 1.6, 2.4), max: 4.1 });
    g += S.text(str, { ...NAME, x: c, y: ty + size * 0.35, size, fill: INK });
    if (hasSub) {
      const sy = ty + size * 0.35 + 2.7;
      const ss = S.fit.size(item.sub, { ...SUB, width: L.width(12.1, sy - c, 5), max: 2.4 });
      g += S.text(item.sub, { ...SUB, x: c, y: sy, size: ss, fill: BROWN });
    }
    g += L.hole(o.hole, GOLD);
    return S.svg(L.D, L.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<path fill="none" stroke="${INK}" stroke-width="0.45" d="${stepped(0.8, 0.8, W - 1.6, H - 1.6, 1.5)}"/>`;
    g += `<path fill="none" stroke="${GOLD}" stroke-width="0.25" d="${stepped(2.8, 2.8, W - 5.6, H - 5.6, 1)}"/>`;
    g += flank(cx, 6, 12, 2.4, GOLD, 1.2);
    const t = S.fit.lines(cat.name.toUpperCase(), { ...NAME, width: 54, max: 6.2, minSingle: 4.8 });
    const ys = S.titleBaselines(t.lines.length, t.size, 9, 19.6);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...NAME, x: cx, y: ys[k], size: t.size, fill: INK }); });
    g += flank(cx, 21.6, 20, 2.6, GOLD, 1.1);
    g += S.boxRows(items, { x: 6, y: 24.4, w: 58, h: 41, ink: INK, rule: BROWN, family: F.cormorant, weight: 600, nameW: 28 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'artdeco', name: 'Art Deco',
    blurb: 'Stepped corners, double frame, diamonds.',
    rect, circle, box,
  });
})(window.Spice);
