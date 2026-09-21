// Default spice list. Items may be written "Name / variant" or "Name / variant / origin".
// Each category has a permanent number `n`; a spice is numbered n*100 + its position in the category
// (Urter 101-108, Chili 201-206, ...), so adding a spice never renumbers other categories.
window.Spice = window.Spice || {};
window.Spice.defaultCategories = () => [
  { id: 'urter', n: 1, name: 'Urter', box: true, items: [
    'Basilikum', 'Oregano', 'Timian', 'Rosmarin', 'Dill', 'Persille', 'Mynte', 'Laurbærblad',
  ] },
  { id: 'chili', n: 2, name: 'Chili og paprika', box: true, items: [
    'Paprika / søt', 'Paprika / røkt', 'Cayenne', 'Piri piri', 'Chipotle', 'Chiliflak',
  ] },
  { id: 'pepper', n: 3, name: 'Pepper', box: true, items: [
    'Sort pepper', 'Hvit pepper', 'Sichuanpepper',
  ] },
  { id: 'varme', n: 4, name: 'Varme og aromatiske krydder', box: true, items: [
    'Spisskummen / cumin', 'Koriander', 'Gurkemeie / turmeric', 'Ingefær', 'Hvitløk',
    'Kanel', 'Kardemomme', 'Nellik', 'Muskat', 'Safran',
  ] },
  { id: 'fro', n: 5, name: 'Frø', box: false, items: [
    'Valmuefrø',
  ] },
  { id: 'blandinger', n: 6, name: 'Krydderblandinger', box: true, items: [
    'Garam masala', 'Indian curry / karriblanding', 'Gastromat', 'MSG',
  ] },
];
