// "Botanisk": botanical specimen label meets apothecary archive. Cream paper, black ink, thin borders,
// elegant serif with italic Latin names, one tiny sprig as the only ornament.
(function (S) {
  const F = S.fonts, L = S.lid;
  const INK = '#1c1a17', SOFT = '#6b655a', PAPER = '#f7f1e1';
  const NAME = { family: F.cormorant, weight: 600, ls: 0.02 };
  const LATIN = { family: F.cormorant, weight: 500, style: 'italic', ls: 0.01 };
  const META = { family: F.cormorant, weight: 600, ls: 0.16 };

  // Cormorant's default numerals are old-style ("014" reads as "o14"); force lining figures.
  const num = (str) => str.replace('<text ', '<text style="font-variant-numeric:lining-nums" ');
  const pad = (n) => String(n || 0).padStart(3, '0');

  const leaf = (x, y, s, rot, fill) =>
    `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${fill}" d="M0,-1.6 C1,-0.7 1,0.7 0,1.6 C-1,0.7 -1,-0.7 0,-1.6Z"/>`;
  // two small leaves on a stem: the only ornament
  const sprig = (cx, y, s, ink) =>
    leaf(cx - 1.5 * s, y - 0.2 * s, s, -62, ink) + leaf(cx + 1.5 * s, y - 0.2 * s, s, 62, ink) +
    `<path stroke="${ink}" stroke-width="0.18" d="M${cx},${y - 0.6 * s} V${y + 1.5 * s}"/>`;
  // hairline rule with the sprig in the middle
  const rule = (cx, y, reach, gap, ink) =>
    `<path stroke="${ink}" stroke-width="0.14" d="M${cx - gap - reach},${y} H${cx - gap} M${cx + gap},${y} H${cx + gap + reach}"/>` + sprig(cx, y, 0.9, ink);

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    const name = item.sub ? `${item.name}, ${item.sub}` : item.name;
    const latin = item.latin || '';
    const meta = [item.no ? `No. ${pad(item.no)}` : '', item.family || (item.cat || '').toUpperCase()].filter(Boolean).join(' · ');
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="0.5"/>`;
    g += `<rect x="1.4" y="1.4" width="${W - 2.8}" height="${H - 2.8}" fill="none" stroke="${INK}" stroke-width="0.1"/>`;
    const ns = S.fit.size(name, { ...NAME, width: 46, max: 7.8 });
    const ms = S.fit.size(meta, { ...META, width: 44, max: 2.1 });
    if (latin) {
      const ls = S.fit.size(latin, { ...LATIN, width: 44, max: 4 });
      g += S.text(name, { ...NAME, x: cx, y: 12.6, size: ns, fill: INK });
      g += S.text(latin, { ...LATIN, x: cx, y: 18.3, size: ls, fill: INK });
      g += rule(cx, 21.9, 12, 2.6, SOFT);
      g += num(S.text(meta, { ...META, x: cx, y: 26.1, size: ms, fill: SOFT }));
    } else {
      g += S.text(name, { ...NAME, x: cx, y: 14.6, size: ns, fill: INK });
      g += rule(cx, 19.6, 12, 2.6, SOFT);
      g += num(S.text(meta, { ...META, x: cx, y: 24.2, size: ms, fill: SOFT }));
    }
    return S.svg(W, H, g);
  }

  function circle(item, o) {
    const c = L.C;
    let g = L.base(PAPER, o.notch);
    g += L.ring(13.0, o.notch, `stroke="${INK}" stroke-width="0.22"`);
    g += L.ring(12.3, o.notch, `stroke="${INK}" stroke-width="0.1"`);
    // catalogue number, upper-left
    if (item.no) {
      const orn = L.ornament(o);
      const s = S.fit.size(`No. ${pad(item.no)}`, { ...META, ls: 0.1, width: 8.2, max: 2.3 });
      g += num(S.text(`No. ${pad(item.no)}`, { ...META, ls: 0.1, x: orn.x + 0.7, y: orn.y + 1.0, size: s, fill: INK }));
    }
    // name follows the lower half-circle (baseline on the arc, letter tops toward the centre)
    const rb = 9.3;
    const str = item.name.toUpperCase();
    const nm = { family: F.cormorant, weight: 600, ls: 0.14 };
    const size = S.fit.size(str, { ...nm, width: S.arcLen(rb, 0.74), max: 3.4 });
    g += S.arcText(str, { ...nm, cx: c, cy: c, r: rb, size, fill: INK });
    g += leaf(c, c + 11.1, 0.55, 0, INK);
    g += L.hole(o.hole, '#8a8478');
    return S.svg(L.D, L.D, g);
  }

  // Ø30 mm full-circle lid: sprig and number centred on top, name centred on the lower semicircle
  function circle30(item) {
    const l = S.lid30, c = l.C;
    let g = l.base(PAPER);
    g += l.ring(14.4, `stroke="${INK}" stroke-width="0.22"`);
    g += l.ring(13.6, `stroke="${INK}" stroke-width="0.1"`);
    g += sprig(c, c - 7.4, 0.9, INK);
    if (item.no) g += num(S.text(`No. ${pad(item.no)}`, { ...META, ls: 0.12, x: c, y: c - 1.2, size: 2.4, fill: INK }));
    const rb = 10.8, str = item.name.toUpperCase();
    const nm = { family: F.cormorant, weight: 600, ls: 0.14 };
    const size = S.fit.size(str, { ...nm, width: S.arcLen(rb, 0.82), max: 3.8 });
    g += S.arcText(str, { ...nm, cx: c, cy: c, r: rb, size, fill: INK });
    g += leaf(c, c + 12.3, 0.55, 0, INK);
    return S.svg(l.D, l.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.8" y="0.8" width="${W - 1.6}" height="${H - 1.6}" fill="none" stroke="${INK}" stroke-width="0.3"/>`;
    g += `<rect x="2.3" y="2.3" width="${W - 4.6}" height="${H - 4.6}" fill="none" stroke="${INK}" stroke-width="0.12"/>`;
    g += sprig(cx, 6.4, 1.1, INK);
    const t = S.fit.lines(cat.name, { ...NAME, ls: 0.04, width: 56, max: 6.8, minSingle: 5 });
    const ts = t.lines.length > 1 ? Math.min(t.size, 5) : t.size;
    const ys = S.titleBaselines(t.lines.length, ts, 9.4, 19);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...NAME, ls: 0.04, x: cx, y: ys[k], size: ts, fill: INK }); });
    g += rule(cx, 22.4, 20, 2.6, SOFT);
    g += S.boxRows(items, { x: 5, y: 25.2, w: 60, h: 40.8, ink: INK, rule: SOFT, family: F.cormorant, weight: 500, nameW: 29 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'botanisk', name: 'Botanisk',
    blurb: 'Specimen label: serif, italic Latin names, archive line.',
    rect, circle, circle30, box,
  });
})(window.Spice);
