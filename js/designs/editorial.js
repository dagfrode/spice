// "Klassisk / editorial": the reference screenshot. Ivory paper, fine double frame, high-contrast serif,
// a thin rule either side of the italic variant, one small fleur-de-lis.
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#1a1714', PAPER = '#fdfcf8', SOFT = '#6f6a62';
  const NAME = { family: F.bodoni, weight: 400, ls: 0.03 };
  const SUB = { family: F.cormorant, weight: 500, style: 'italic' };

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    const { str, size } = S.fitName(item.name, { ...NAME, width: 46, max: 9 });
    const hasSub = !!item.sub;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.6" y="0.6" width="${W - 1.2}" height="${H - 1.2}" fill="none" stroke="${INK}" stroke-width="0.3"/>`;
    // inner frame: corner brackets that break around the ornaments
    const i = 2.4, gap = 8, len = 4;
    g += `<path fill="none" stroke="${INK}" stroke-width="0.22" d="` +
      `M${i + len},${H - i} H${i} V${H - i - len} M${i},${i + len} V${i} H${cx - gap} M${cx + gap},${i} H${W - i} V${i + len} ` +
      `M${W - i},${H - i - len} V${H - i} H${cx + gap} M${cx - gap},${H - i} H${i + len}"/>`;
    g += S.fleur(cx, 4.9, 5, INK);
    g += S.fleur(cx, H - 4.5, 4.2, INK, true);
    g += S.text(str, { ...NAME, x: cx, y: (hasSub ? 15.0 : 16.6) + size * 0.35, size, fill: INK });
    if (hasSub) {
      const ss = S.fit.size(item.sub, { ...SUB, width: 20, max: 3.6 });
      const w = S.fit.measure(item.sub, SUB) * ss;
      g += S.text(item.sub, { ...SUB, x: cx, y: 22.4, size: ss, fill: INK });
      const ry = 22.4 - ss * 0.3;
      g += `<path stroke="${INK}" stroke-width="0.2" d="M${cx - w / 2 - 12},${ry} h9 M${cx + w / 2 + 3},${ry} h9"/>`;
    }
    return S.svg(W, H, g);
  }

  function circle(item, o) {
    const c = L.C;
    let g = L.base(PAPER, o.notch);
    g += L.ring(13.1, o.notch, `stroke="${INK}" stroke-width="0.28"`);
    g += L.ring(12.3, o.notch, `stroke="${INK}" stroke-width="0.2"`);
    const orn = L.ornament(o);
    g += S.fleur(orn.x, orn.y, 4.4, INK);
    g += `<circle cx="${orn.x}" cy="${orn.y + 3.4}" r="0.28" fill="${INK}"/><circle cx="${orn.x}" cy="${orn.y + 4.2}" r="0.22" fill="${INK}"/>`;
    const ty = L.textY(o) - (o.hole ? 0.4 : 0);
    const nm = { ...NAME, ls: 0.02 };
    const { str, size } = S.fitName(item.name, { ...nm, width: L.width(12.3, ty - c + 1.6), max: 4.6 });
    g += S.text(str, { ...nm, x: c, y: ty + size * 0.35, size, fill: INK });
    if (o.hole || o.notch) g += S.fleur(c, c + 10, 3, INK, true);
    else g += S.fleur(c, c + 7.8, 4.2, INK, true);
    g += L.hole(o.hole, '#8a8a8a');
    return S.svg(L.D, L.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.8" y="0.8" width="${W - 1.6}" height="${H - 1.6}" fill="none" stroke="${INK}" stroke-width="0.35"/>`;
    const i = 2.6, gap = 8;
    g += `<path fill="none" stroke="${INK}" stroke-width="0.22" d="M${cx - gap},${i} H${i} V${H - i} H${W - i} V${i} H${cx + gap}"/>`;
    g += S.fleur(cx, 5, 5, INK);
    const t = S.fit.lines(cat.name.toUpperCase(), { ...NAME, width: 56, max: 6.4, minSingle: 5 });
    const ys = S.titleBaselines(t.lines.length, t.size, 8, 19.5);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...NAME, x: cx, y: ys[k], size: t.size, fill: INK }); });
    g += `<path stroke="${INK}" stroke-width="0.2" d="M8,21.2 H${cx - 2.2} M${cx + 2.2},21.2 H${W - 8}"/>`;
    g += `<path fill="${INK}" d="M${cx},19.9 l1.1,1.3 l-1.1,1.3 l-1.1,-1.3z"/>`;
    g += S.boxRows(items, { x: 5, y: 23.4, w: 60, h: 42.4, ink: INK, rule: SOFT, family: F.cormorant, weight: 500, nameW: 29 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'editorial', name: 'Klassisk',
    blurb: 'Editorial serif, thin double frame, one fleur.',
    rect, circle, box,
  });
})(window.Spice);
