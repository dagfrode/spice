// Text fitting via canvas measurement. Call after web fonts have loaded.
window.Spice = window.Spice || {};
(function (S) {
  const ctx = document.createElement('canvas').getContext('2d');

  // Width of `str` in em (including letter-spacing `ls`, also in em).
  function measure(str, o) {
    ctx.font = `${o.style || 'normal'} ${o.weight || 400} 100px ${o.family}`;
    return ctx.measureText(str).width / 100 + (o.ls || 0) * [...str].length;
  }

  // Largest font size (mm) <= o.max at which `str` fits in o.width (mm).
  function size(str, o) {
    const w = measure(str, o);
    return w > 0 ? Math.min(o.max, o.width / w) : o.max;
  }

  // Fit on one line if that yields >= o.minSingle, otherwise split at the most balanced space.
  function lines(str, o) {
    const one = size(str, o);
    if (one >= o.minSingle || !str.includes(' ')) return { lines: [str], size: one };
    const words = str.split(' ');
    let best = null;
    for (let k = 1; k < words.length; k++) {
      const a = words.slice(0, k).join(' ');
      const b = words.slice(k).join(' ');
      const s = Math.min(size(a, o), size(b, o));
      if (!best || s > best.size) best = { lines: [a, b], size: s };
    }
    return best;
  }

  S.fit = { measure, size, lines };
})(window.Spice);
