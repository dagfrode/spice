// Design registry. To add a design: create js/designs/<id>.js calling Spice.designs.register({...})
// with rect(item), circle(item, {hole, notch}) (Ø27 lid), circle30(item) (Ø30 full-circle lid) and
// box(category, items), then add a <script> tag in index.html.
window.Spice = window.Spice || {};
(function (S) {
  const list = [];
  S.designs = {
    register(d) { list.push(d); },
    all() { return list; },
    get(id) { return list.find((d) => d.id === id) || list[0]; },
  };
})(window.Spice);
