// "Juridisk": law library / court archive. Ivory paper, black ink, burgundy accents. Cinzel caps for the
// name, small caps for secondary information, double borders, hairline double rules, a lozenge as separator,
// small squares as reference marks. Class letter = category (101-1xx -> A, 201-2xx -> B, ...).
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#15130f', BURG = '#6d1f2b', PAPER = '#f6f0df';
  const NAME = { family: F.cinzel, weight: 700, ls: 0.07 };
  const SC = { family: F.cormorantSC, weight: 600, ls: 0.14 };

  const pad = (n) => String(n || 0).padStart(3, '0');
  const klass = (no) => { const k = Math.floor((no || 0) / 100); return k >= 1 && k <= 26 ? String.fromCharCode(64 + k) : String(k || ''); };
  // lining figures for the reference numbers
  const num = (str) => str.replace('<text ', '<text style="font-variant-numeric:lining-nums" ');
  const square = (x, y, s, fill) => `<rect x="${(x - s / 2).toFixed(3)}" y="${(y - s / 2).toFixed(3)}" width="${s}" height="${s}" fill="${fill}"/>`;
  const lozenge = (x, y, s, fill) => `<path fill="${fill}" d="M${x},${y - s} l${s},${s} l${-s},${s} l${-s},${-s}z"/>`;
  // hairline double rule with a small lozenge in the middle
  const rule2 = (cx, y, reach, gap) =>
    `<path stroke="${BURG}" stroke-width="0.12" d="M${cx - gap - reach},${y} H${cx - gap} M${cx + gap},${y} H${cx + gap + reach} ` +
    `M${cx - gap - reach},${y + 0.55} H${cx - gap} M${cx + gap},${y + 0.55} H${cx + gap + reach}"/>` + lozenge(cx, y + 0.275, 0.9, BURG);

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    // line 1: name (+ variant when a Latin line follows); line 2: Latin name, or the variant when there is none
    const name = (item.sub && item.latin ? `${item.name}, ${item.sub}` : item.name).toUpperCase();
    const latin = item.latin || item.sub || '';
    const ref = item.no ? `Ref. ${pad(item.no)} · Class ${klass(item.no)}` : '';
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    // outer line on the label edge (neighbours share it: one cut), then a double border inside
    g += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="0.5"/>`;
    g += `<rect x="1.6" y="1.6" width="${W - 3.2}" height="${H - 3.2}" fill="none" stroke="${INK}" stroke-width="0.26"/>`;
    g += `<rect x="2.3" y="2.3" width="${W - 4.6}" height="${H - 4.6}" fill="none" stroke="${BURG}" stroke-width="0.1"/>`;
    [[1.6, 1.6], [W - 1.6, 1.6], [1.6, H - 1.6], [W - 1.6, H - 1.6]].forEach(([x, y]) => { g += square(x, y, 1.1, BURG); });
    const ns = S.fit.size(name, { ...NAME, width: 44, max: 6 });
    const ms = ref ? S.fit.size(ref, { ...SC, ls: 0.2, width: 44, max: 2.3 }) : 0;
    if (latin) {
      const ls = S.fit.size(latin, { ...SC, width: 44, max: 3.3 });
      g += S.text(name, { ...NAME, x: cx, y: 12.3, size: ns, fill: INK });
      g += S.text(latin, { ...SC, x: cx, y: 17.7, size: ls, fill: INK });
      g += rule2(cx, 20.6, 15, 1.9);
      if (ref) g += num(S.text(ref, { ...SC, ls: 0.2, x: cx, y: 25.4, size: ms, fill: BURG }));
    } else {
      g += S.text(name, { ...NAME, x: cx, y: 14.4, size: ns, fill: INK });
      g += rule2(cx, 18.4, 15, 1.9);
      if (ref) g += num(S.text(ref, { ...SC, ls: 0.2, x: cx, y: 23.6, size: ms, fill: BURG }));
    }
    return S.svg(W, H, g);
  }

  // Ø27 mm lid (1/4 cut-out top-right, optional 5 mm hole): reference number upper-left, name between two
  // hairlines in the lower half
  function circle(item, o) {
    const c = L.C, R = 12.3;
    let g = L.base(PAPER, o.notch);
    g += L.ring(13.0, o.notch, `stroke="${INK}" stroke-width="0.3"`);
    g += L.ring(12.3, o.notch, `stroke="${BURG}" stroke-width="0.12"`);
    if (item.no) {
      const orn = L.ornament(o);
      const t = `No. ${pad(item.no)}`;
      const s = S.fit.size(t, { ...SC, ls: 0.1, width: 8.2, max: 2.4 });
      g += num(S.text(t, { ...SC, ls: 0.1, x: orn.x + 0.7, y: orn.y + 1.0, size: s, fill: BURG }));
      g += square(orn.x + 0.7, orn.y + 2.6, 0.8, BURG);
    }
    const top = o.hole ? 3.5 : o.notch ? 2.6 : 1.8;      // upper hairline, distance below the centre
    const mid = top + 3.0;                                // name centre line
    const bot = top + 6.0;                                // lower hairline
    const half = (dy) => Math.sqrt(R * R - dy * dy) - 0.5;
    g += `<path stroke="${INK}" stroke-width="0.16" d="M${c - half(top)},${c + top} H${c + half(top)} M${c - half(bot)},${c + bot} H${c + half(bot)}"/>`;
    const str = item.name.toUpperCase();
    const size = S.fit.size(str, { ...NAME, ls: 0.04, width: L.width(R, mid + 1.5, 2.2), max: 3.7 });
    g += S.text(str, { ...NAME, ls: 0.04, x: c, y: c + mid + size * 0.36, size, fill: INK });
    g += lozenge(c, c + bot + 1.9, 0.6, BURG);
    g += L.hole(o.hole, '#8a7f70');
    return S.svg(L.D, L.D, g);
  }

  // Ø30 mm full circle: number and lozenge rule on top, name centred on the lower semicircle like a seal
  function circle30(item) {
    const l = S.lid30, c = l.C;
    let g = l.base(PAPER);
    g += l.ring(14.5, `stroke="${INK}" stroke-width="0.3"`);
    g += l.ring(13.7, `stroke="${BURG}" stroke-width="0.12"`);
    g += square(c - 14.1, c, 0.9, BURG) + square(c + 14.1, c, 0.9, BURG);
    if (item.no) {
      const t = `No. ${pad(item.no)}`;
      g += num(S.text(t, { ...SC, ls: 0.12, x: c, y: c - 5.6, size: 2.6, fill: BURG }));
    }
    g += rule2(c, c - 3.2, 5, 1.6);
    const rb = 10.6, str = item.name.toUpperCase();
    const size = S.fit.size(str, { ...NAME, width: S.arcLen(rb, 0.82), max: 3.7 });
    g += S.arcText(str, { ...NAME, cx: c, cy: c, r: rb, size, fill: INK });
    return S.svg(l.D, l.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.8" y="0.8" width="${W - 1.6}" height="${H - 1.6}" fill="none" stroke="${INK}" stroke-width="0.4"/>`;
    g += `<rect x="2.3" y="2.3" width="${W - 4.6}" height="${H - 4.6}" fill="none" stroke="${INK}" stroke-width="0.18"/>`;
    g += `<rect x="3" y="3" width="${W - 6}" height="${H - 6}" fill="none" stroke="${BURG}" stroke-width="0.1"/>`;
    [[2.3, 2.3], [W - 2.3, 2.3], [2.3, H - 2.3], [W - 2.3, H - 2.3]].forEach(([x, y]) => { g += square(x, y, 1.3, BURG); });
    const t = S.fit.lines(cat.name.toUpperCase(), { ...NAME, width: 56, max: 5.6, minSingle: 4.4 });
    const ts = t.lines.length > 1 ? Math.min(t.size, 4.4) : t.size;
    const ys = S.titleBaselines(t.lines.length, ts, 7, 17.4);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...NAME, x: cx, y: ys[k], size: ts, fill: INK }); });
    // class line: "Class B · Nos. 201–206"
    const n = cat.n || 0;
    if (n && items.length) {
      const line = `Class ${klass(n * 100)} · Nos. ${n * 100 + 1}–${n * 100 + items.length}`;
      const s = S.fit.size(line, { ...SC, ls: 0.16, width: 52, max: 2.5 });
      g += num(S.text(line, { ...SC, ls: 0.16, x: cx, y: 21.4, size: s, fill: BURG }));
    }
    g += rule2(cx, 23.6, 20, 2.2);
    g += S.boxRows(items, { x: 5, y: 26.6, w: 60, h: 39.4, ink: INK, rule: BURG, family: F.cormorant, weight: 600, nameW: 29 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'juridisk', name: 'Juridisk',
    blurb: 'Law-library archive: double borders, small caps, ref. numbers.',
    rect, circle, circle30, box,
  });
})(window.Spice);
