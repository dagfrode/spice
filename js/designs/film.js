// "Filmarkiv": film production / cinema archive. Warm white, black, charcoal, one muted tally red.
// Bold condensed caps for the name, monospace for everything else; restrained marks only: corner crop
// marks, registration marks, timecode-style tick rulers, perforation holes, a clapper-stripe block.
(function (S) {
  const F = S.fonts, L = S.lid;
  const PAPER = '#f4f1ea', INK = '#111111', CHAR = '#3a3a3c', RED = '#b23a2e';
  const NAME = { family: F.barlow, weight: 700, ls: 0.03 };
  const M = (w, ls) => ({ family: F.mono, weight: w, ls: ls == null ? 0.06 : ls });

  const two = (n) => String(n || 1).padStart(2, '0');
  // spice number as a production number (three digits, e.g. 201)
  const prod = (n) => String(n || 0).padStart(3, '0');

  // registration mark: ring + crosshair
  const reg = (x, y, r, stroke) =>
    `<g fill="none" stroke="${stroke}" stroke-width="0.18"><circle cx="${x}" cy="${y}" r="${r}"/>` +
    `<path d="M${x - r - 0.9},${y} H${x + r + 0.9} M${x},${y - r - 0.9} V${y + r + 0.9}"/></g>`;
  // ruler of timecode-style ticks, a longer one every fifth
  const ticks = (x0, x1, y, step, stroke) => {
    let d = '';
    for (let x = x0, k = 0; x <= x1 + 0.001; x += step, k++) d += `M${x.toFixed(2)},${y} v${k % 5 === 0 ? 1.3 : 0.7} `;
    return `<path stroke="${stroke}" stroke-width="0.14" d="${d}"/>`;
  };
  // small clapper-stripe block
  const clapper = (x, y, w, h) => {
    const s = h * 0.9;
    let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="0.16"/>`;
    for (let i = 0; x + 2 * s * i + s <= x + w - 0.01; i++) {
      const x0 = x + 2 * s * i;
      g += `<path fill="${INK}" d="M${x0},${y + h} h${s} l${s * 0.5},${-h} h${-s} z"/>`;
    }
    return g;
  };
  // production number in a small outlined slate box
  const slate = (cx, cy, w, h, text, size) =>
    `<rect x="${(cx - w / 2).toFixed(2)}" y="${(cy - h / 2).toFixed(2)}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="0.2"/>` +
    S.text(text, { ...M(700, 0.08), x: cx, y: cy + size * 0.35, size, fill: RED });

  function rect(item) {
    const W = 60, H = 30, cx = 30;
    const hasLatin = !!item.latin;
    const name = (item.sub && hasLatin ? `${item.name}, ${item.sub}` : item.name).toUpperCase();
    const second = (hasLatin ? item.latin : item.sub || '').toUpperCase();
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${INK}" stroke-width="0.5"/>`;
    // corner crop marks instead of a closed inner frame
    const i = 2.0, len = 3.4;
    g += `<path fill="none" stroke="${CHAR}" stroke-width="0.2" d="M${i},${i + len} V${i} H${i + len} M${W - i - len},${i} H${W - i} V${i + len} ` +
      `M${W - i},${H - i - len} V${H - i} H${W - i - len} M${i + len},${H - i} H${i} V${H - i - len}"/>`;
    g += clapper(5.2, 3.3, 10.4, 1.7);
    g += reg(W - 7.4, 4.2, 1.15, CHAR);
    g += ticks(8, 52, 26.6, 1.5, CHAR);

    const ns = S.fit.size(name, { ...NAME, width: 46, max: 9.4 });
    const ref = item.no ? `SCENE ${prod(item.no)} · TAKE ${two(item.take)}` : '';
    const rs = ref ? S.fit.size(ref, { ...M(500), ls: 0.1, width: 40, max: 2.3 }) : 0;
    const refText = (y) => {
      if (!ref) return '';
      const t = S.text(ref, { ...M(500), ls: 0.1, x: cx + 1.2, y, size: rs, fill: INK });
      const spans = `<tspan fill="${RED}">SCENE ${prod(item.no)}</tspan><tspan> · TAKE ${two(item.take)}</tspan>`;
      const w = S.fit.measure(ref, { ...M(500), ls: 0.1 }) * rs;
      return t.replace(S.esc(ref), spans) + `<circle cx="${(cx + 1.2 - w / 2 - 1.5).toFixed(2)}" cy="${(y - rs * 0.34).toFixed(2)}" r="0.55" fill="${RED}"/>`;
    };
    if (second) {
      const ss = S.fit.size(second, { ...M(500), ls: 0.14, width: 44, max: 2.7 });
      g += S.text(name, { ...NAME, x: cx, y: 14.9, size: ns, fill: INK });
      g += S.text(second, { ...M(500), ls: 0.14, x: cx, y: 19.4, size: ss, fill: CHAR });
      g += refText(23.9);
    } else {
      g += S.text(name, { ...NAME, x: cx, y: 16.6, size: ns, fill: INK });
      g += refText(23.4);
    }
    return S.svg(W, H, g);
  }

  // Ø27 lid (1/4 cut-out top-right, optional 5 mm hole): production number in a slate box upper-left, name in
  // the lower half, perforation ring around it all
  function circle(item, o) {
    const c = L.C, R = 11.7;
    let g = L.base(PAPER, o.notch);
    g += L.ring(13.0, o.notch, `stroke="${INK}" stroke-width="0.3"`);
    g += L.ring(12.0, o.notch, `stroke="${CHAR}" stroke-width="0.5" stroke-dasharray="0.9 0.75"`);
    if (item.no) {
      const orn = L.ornament(o);
      g += slate(orn.x + 0.6, orn.y + 1.3, 6.2, 2.9, prod(item.no), 2.2);
    }
    const top = o.hole ? 3.5 : o.notch ? 2.6 : 1.8;
    const mid = top + 2.9;
    const half = Math.sqrt(R * R - top * top) - 0.5;
    g += `<path stroke="${INK}" stroke-width="0.18" d="M${c - half},${c + top} H${c + half}"/>`;
    const str = item.name.toUpperCase();
    const size = S.fit.size(str, { ...NAME, width: L.width(R, mid + 1.9, 1.6), max: 5.4 });
    g += S.text(str, { ...NAME, x: c, y: c + mid + size * 0.35, size, fill: INK });
    g += L.hole(o.hole, '#888');
    return S.svg(L.D, L.D, g);
  }

  // Ø30 full circle: number in a slate box on top, registration target in the middle, name on the lower arc
  function circle30(item) {
    const l = S.lid30, c = l.C;
    let g = l.base(PAPER);
    g += l.ring(14.5, `stroke="${INK}" stroke-width="0.3"`);
    g += l.ring(13.4, `stroke="${CHAR}" stroke-width="0.5" stroke-dasharray="0.9 0.75"`);
    if (item.no) g += slate(c, c - 8.2, 7.4, 3.2, prod(item.no), 2.5);
    g += reg(c, c - 1.4, 1.5, CHAR);
    const rb = 10.4, str = item.name.toUpperCase();
    const size = S.fit.size(str, { ...NAME, width: S.arcLen(rb, 0.84), max: 4.8 });
    g += S.arcText(str, { ...NAME, cx: c, cy: c, r: rb, size, fill: INK });
    return S.svg(l.D, l.D, g);
  }

  function box(cat, items) {
    const W = 70, H = 70, cx = 35;
    let g = `<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    g += `<rect x="0.8" y="0.8" width="${W - 1.6}" height="${H - 1.6}" fill="none" stroke="${INK}" stroke-width="0.4"/>`;
    g += `<rect x="0.8" y="0.8" width="${W - 1.6}" height="17.4" fill="${INK}"/>`;
    for (let x = 4; x <= W - 6; x += 4.6) g += `<rect x="${x}" y="2.2" width="2.4" height="1.4" rx="0.35" fill="${PAPER}"/>`;
    const t = S.fit.lines(cat.name.toUpperCase(), { ...NAME, width: 58, max: 8.6, minSingle: 6 });
    const ts = t.lines.length > 1 ? Math.min(t.size, 5.6) : t.size;
    const ys = S.titleBaselines(t.lines.length, ts, 5.4, 16.6);
    t.lines.forEach((ln, k) => { g += S.text(ln, { ...NAME, x: cx, y: ys[k], size: ts, fill: PAPER }); });
    const n = cat.n || 0;
    if (n && items.length) {
      const line = `CAN ${two(n)} · ${n * 100 + 1}–${n * 100 + items.length}`;
      const s = S.fit.size(line, { ...M(500), ls: 0.14, width: 52, max: 2.4 });
      g += S.text(line, { ...M(500), ls: 0.14, x: cx, y: 22.8, size: s, fill: RED });
    }
    g += ticks(5, 65, 24.6, 1.5, CHAR);
    g += S.boxRows(items, { x: 5, y: 27.6, w: 60, h: 38.4, ink: INK, rule: CHAR, family: F.mono, weight: 500, nameW: 29, upper: true, ls: 0.04 });
    return S.svg(W, H, g);
  }

  S.designs.register({
    id: 'film', name: 'Filmarkiv',
    blurb: 'Slate and archive-box look: condensed caps, mono, perforations.',
    rect, circle, circle30, box,
  });
})(window.Spice);
