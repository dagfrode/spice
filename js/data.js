// Default spice list. Items may be written "Name / subtitle".
window.Spice = window.Spice || {};
window.Spice.defaultCategories = () => [
  { id: 'urter', name: 'Urter', box: true, items: [
    'Basilikum', 'Oregano', 'Timian', 'Rosmarin', 'Dill', 'Persille', 'Mynte', 'Laurbærblad',
  ] },
  { id: 'chili', name: 'Chili og paprika', box: true, items: [
    'Paprika / søt', 'Paprika / røkt', 'Cayenne', 'Piri piri', 'Chipotle', 'Chiliflak',
  ] },
  { id: 'pepper', name: 'Pepper', box: true, items: [
    'Sort pepper', 'Hvit pepper', 'Sichuanpepper',
  ] },
  { id: 'varme', name: 'Varme og aromatiske krydder', box: true, items: [
    'Spisskummen / cumin', 'Koriander', 'Gurkemeie / turmeric', 'Ingefær', 'Hvitløk',
    'Kanel', 'Kardemomme', 'Nellik', 'Muskat', 'Safran',
  ] },
  { id: 'fro', name: 'Frø', box: false, items: [
    'Valmuefrø',
  ] },
  { id: 'blandinger', name: 'Krydderblandinger', box: true, items: [
    'Garam masala', 'Indian curry / karriblanding', 'Gastromat', 'MSG',
  ] },
];
