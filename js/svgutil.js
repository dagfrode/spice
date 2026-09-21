// Shared helpers for label designs. All geometry is in millimetres.
window.Spice = window.Spice || {};
(function (S) {
  const r = (n) => Math.round(n * 1000) / 1000;

  S.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // "Spisskummen / cumin / India" -> { name: "Spisskummen", sub: "cumin", origin: "India" }
  S.parseItem = (line) => {
    const [name, sub, origin] = line.split(' / ').map((p) => p.trim());
    return { name: name || '', sub: sub || '', origin: origin || '' };
  };

  S.fonts = {
    bodoni: "'Bodoni Moda', 'Didot', 'Bodoni 72', serif",
    cormorant: "'Cormorant Garamond', 'Garamond', serif",
    barlow: "'Barlow Condensed', 'Arial Narrow', 'Oswald', sans-serif",
    cormorantSC: "'Cormorant SC', 'Cormorant Garamond', 'Garamond', serif",
    jost: "'Jost', 'Helvetica Neue', Arial, sans-serif",
    mono: "'IBM Plex Mono', 'Courier New', monospace",
    anton: "'Anton', 'Impact', 'Arial Narrow', sans-serif",
    limelight: "'Limelight', 'Poiret One', serif",
    cinzel: "'Cinzel', 'Trajan Pro', serif",
  };
  // Everything the labels and the page need; loaded before the first render so text fitting is exact.
  S.fontSpecs = [
    "400 20px 'Jost'", "500 20px 'Jost'",
    "400 20px 'IBM Plex Mono'", "500 20px 'IBM Plex Mono'", "700 20px 'IBM Plex Mono'",
    "400 20px 'Anton'", "400 20px 'Limelight'", "400 20px 'Bodoni Moda'",
    "500 20px 'Cormorant Garamond'", "600 20px 'Cormorant Garamond'", "italic 500 20px 'Cormorant Garamond'",
    "500 20px 'Cinzel'", "700 20px 'Cinzel'", "500 20px 'Cormorant SC'", "600 20px 'Cormorant SC'", "700 20px 'Barlow Condensed'",
  ];

  S.svg = (w, h, inner) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm" style="display:block">${inner}</svg>`;

  // Text helper. `ls` is letter-spacing in em.
  S.text = (str, o) => {
    const ls = o.ls || 0;
    const anchor = o.anchor || 'middle';
    // SVG adds spacing after every glyph, including the last: shift to stay optically centred.
    const x = anchor === 'middle' ? o.x + (ls * o.size) / 2 : o.x;
    return `<text x="${r(x)}" y="${r(o.y)}" font-size="${r(o.size)}" font-family="${o.family}" ` +
      `font-weight="${o.weight || 400}" font-style="${o.style || 'normal'}" fill="${o.fill}" ` +
      `text-anchor="${anchor}" letter-spacing="${r(ls * o.size)}">${S.esc(str)}</text>`;
  };

  // Fleur-de-lis, ~12 units tall in local space, centred on (x, y). `h` is the drawn height in mm.
  S.fleur = (x, y, h, ink, flip) => {
    const s = h / 12;
    return `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s)} ${flip ? -r(s) : r(s)})" fill="${ink}" stroke="none">` +
      `<path d="M0,-6 C1.7,-3.8 1.9,-1.2 0,1.4 C-1.9,-1.2 -1.7,-3.8 0,-6Z"/>` +
      `<path d="M0.6,1.5 C3.8,2 6,-0.2 5.4,-3.6 C4.7,-2.5 3.7,-1.9 2.5,-1.6 C1.6,-1.3 1,-0.6 0.6,0.5Z"/>` +
      `<path d="M-0.6,1.5 C-3.8,2 -6,-0.2 -5.4,-3.6 C-4.7,-2.5 -3.7,-1.9 -2.5,-1.6 C-1.6,-1.3 -1,-0.6 -0.6,0.5Z"/>` +
      `<rect x="-2" y="2.2" width="4" height="0.7" rx="0.2"/>` +
      `<circle cx="0" cy="4.6" r="0.55"/><circle cx="0" cy="6.3" r="0.4"/>` +
      `</g>`;
  };

  // Vertical placement of a (possibly two-line) title so the block is centred in [top, bottom].
  S.titleBaselines = (n, size, top, bottom) => {
    const lh = size * 1.28;
    const cap = size * 0.7;
    const block = (n - 1) * lh + cap;
    const first = (top + bottom) / 2 - block / 2 + cap;
    return Array.from({ length: n }, (_, i) => first + i * lh);
  };

  // Writing rows for box labels: name on the left, blank dry-erase space + "g" on the right.
  // o: x, y, w, h (area), ink, rule, family, weight, panel, panelStroke, nameW
  S.boxRows = (items, o) => {
    const n = items.length;
    if (!n) return '';
    const rowH = Math.min(6.6, o.h / n);
    const max = Math.min(3.3, rowH * 0.58);
    let out = '';
    if (o.panel) {
      out += `<rect x="${o.x}" y="${r(o.y)}" width="${o.w}" height="${r(rowH * n + 0.8)}" rx="0.8" ` +
        `fill="${o.panel}" stroke="${o.panelStroke || 'none'}" stroke-width="0.2"/>`;
    }
    items.forEach((it, i) => {
      const base = o.y + 0.4 + rowH * (i + 1) - rowH * 0.24;
      const full = it.sub ? `${it.name} (${it.sub})` : it.name;
      const label = o.upper ? full.toUpperCase() : full;
      const fs = S.fit.size(label, { family: o.family, weight: o.weight, ls: o.ls, width: o.nameW, max });
      out += S.text(label, { x: o.x + 1.8, y: base, size: fs, family: o.family, weight: o.weight, ls: o.ls, fill: o.ink, anchor: 'start' });
      out += `<line x1="${r(o.x + o.nameW + 4)}" x2="${r(o.x + o.w - 5.4)}" y1="${r(base)}" y2="${r(base)}" ` +
        `stroke="${o.rule}" stroke-width="0.2" stroke-dasharray="0.7 0.7"/>`;
      out += S.text('g', { x: o.x + o.w - 1.8, y: base, size: Math.min(fs, 2.8), family: o.family, weight: o.weight, style: 'italic', fill: o.rule, anchor: 'end' });
    });
    return out;
  };

  // Wide-tracked, capitalised name that fits a given width.
  S.fitName = (name, o) => {
    const str = name.toUpperCase();
    return { str, size: S.fit.size(str, o) };
  };

  // ---- lid label geometry (27 mm round; optional 1/4 cut-out top-right; optional 5 mm centre hole) ----
  const D = 27, C = 13.5;
  S.lid = {
    D, C,
    // paper shape
    base: (fill, notch) => notch
      ? `<path d="M${C},${C} V0 A${C},${C} 0 1 0 ${D},${C}Z" fill="${fill}"/>`
      : `<circle cx="${C}" cy="${C}" r="${C}" fill="${fill}"/>`,
    // concentric ring; open at the cut-out when there is one
    ring: (r, notch, attrs) => notch
      ? `<path d="M${C},${C - r} A${r},${r} 0 1 0 ${C + r},${C}" fill="none" ${attrs}/>`
      : `<circle cx="${C}" cy="${C}" r="${r}" fill="none" ${attrs}/>`,
    // dashed punch guide for the centre hole (nothing is printed inside it)
    hole: (on, stroke) => on
      ? `<circle cx="${C}" cy="${C}" r="2.5" fill="none" stroke="${stroke}" stroke-width="0.15" stroke-dasharray="0.5 0.4"/>` : '',
    // where a small ornament goes: upper-left quadrant when the top-right is cut away
    ornament: (o) => (o.notch ? { x: C - 6.2, y: C - 6.2 } : { x: C, y: C - 7.6 }),
    // vertical centre of the name text (always in the lower half, clear of the hole)
    textY: (o) => C + (o.hole ? 6.2 : o.notch ? 4.8 : 0.8),
    // usable text width at a given vertical offset from the centre, inside a ring of radius R
    width: (R, dy, margin) => 2 * Math.sqrt(Math.max(R * R - dy * dy, 1)) - (margin == null ? 1.8 : margin),
    // hairline cut guide following the real outline (shown only when "cut guides" is on)
    guide: (notch) => `<svg class="guide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}" width="${D}mm" height="${D}mm">` +
      (notch
        ? `<path d="M${C},${C} V0 A${C},${C} 0 1 0 ${D},${C}Z" fill="none" stroke="#b5b5b5" stroke-width="0.12"/>`
        : `<circle cx="${C}" cy="${C}" r="${C}" fill="none" stroke="#b5b5b5" stroke-width="0.12"/>`) + '</svg>',
  };

  // ---- lid style 2: Ø30 mm full circle (no hole, no cut-out) ----
  const D30 = 30, C30 = 15;
  S.lid30 = {
    D: D30, C: C30,
    base: (fill) => `<circle cx="${C30}" cy="${C30}" r="${C30}" fill="${fill}"/>`,
    ring: (r, attrs) => `<circle cx="${C30}" cy="${C30}" r="${r}" fill="none" ${attrs}/>`,
    guide: () => `<svg class="guide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D30} ${D30}" width="${D30}mm" height="${D30}mm">` +
      `<circle cx="${C30}" cy="${C30}" r="${C30}" fill="none" stroke="#b5b5b5" stroke-width="0.12"/></svg>`,
  };

  // Text centred on a half-circle. lower (default): reads left to right along the bottom, letter tops toward
  // the centre. upper: along the top, letter tops outward. `r` is the baseline radius. Each call gets a unique
  // path id because many SVGs share one document.
  let arcSeq = 0;
  S.arcLen = (r, frac) => Math.PI * r * (frac || 0.82); // usable text length on a half-circle of radius r
  S.arcText = (str, o) => {
    const id = `arc-${++arcSeq}`;
    const { cx, cy, r } = o;
    const d = o.upper ? `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}` : `M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy}`;
    return `<path id="${id}" fill="none" d="${d}"/>` +
      `<text font-size="${o.size.toFixed(3)}" font-family="${o.family}" font-weight="${o.weight || 400}" font-style="${o.style || 'normal'}" ` +
      `fill="${o.fill}" letter-spacing="${((o.ls || 0) * o.size).toFixed(3)}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${S.esc(str)}</textPath></text>`;
  };
})(window.Spice);
