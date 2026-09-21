// Built-in botanical names + plant families for common spices (used by the "Botanisk" design).
// Keys are lower-case Norwegian/English names. Unknown spices (and blends) simply get no Latin line.
window.Spice = window.Spice || {};
(function (S) {
  const T = {
    'basilikum': ['Ocimum basilicum', 'LAMIACEAE'],
    'oregano': ['Origanum vulgare', 'LAMIACEAE'],
    'timian': ['Thymus vulgaris', 'LAMIACEAE'],
    'rosmarin': ['Salvia rosmarinus', 'LAMIACEAE'],
    'mynte': ['Mentha spicata', 'LAMIACEAE'],
    'dill': ['Anethum graveolens', 'APIACEAE'],
    'persille': ['Petroselinum crispum', 'APIACEAE'],
    'laurbærblad': ['Laurus nobilis', 'LAURACEAE'],
    'paprika': ['Capsicum annuum', 'SOLANACEAE'],
    'paprikapulver': ['Capsicum annuum', 'SOLANACEAE'],
    'røkt paprika': ['Capsicum annuum', 'SOLANACEAE'],
    'cayenne': ['Capsicum annuum', 'SOLANACEAE'],
    'chipotle': ['Capsicum annuum', 'SOLANACEAE'],
    'chiliflak': ['Capsicum annuum', 'SOLANACEAE'],
    'chili': ['Capsicum annuum', 'SOLANACEAE'],
    'piri piri': ['Capsicum frutescens', 'SOLANACEAE'],
    'sort pepper': ['Piper nigrum', 'PIPERACEAE'],
    'hvit pepper': ['Piper nigrum', 'PIPERACEAE'],
    'pepper': ['Piper nigrum', 'PIPERACEAE'],
    'sichuanpepper': ['Zanthoxylum bungeanum', 'RUTACEAE'],
    'spisskummen': ['Cuminum cyminum', 'APIACEAE'],
    'cumin': ['Cuminum cyminum', 'APIACEAE'],
    'koriander': ['Coriandrum sativum', 'APIACEAE'],
    'gurkemeie': ['Curcuma longa', 'ZINGIBERACEAE'],
    'turmeric': ['Curcuma longa', 'ZINGIBERACEAE'],
    'ingefær': ['Zingiber officinale', 'ZINGIBERACEAE'],
    'kardemomme': ['Elettaria cardamomum', 'ZINGIBERACEAE'],
    'hvitløk': ['Allium sativum', 'AMARYLLIDACEAE'],
    'kanel': ['Cinnamomum verum', 'LAURACEAE'],
    'nellik': ['Syzygium aromaticum', 'MYRTACEAE'],
    'muskat': ['Myristica fragrans', 'MYRISTICACEAE'],
    'safran': ['Crocus sativus', 'IRIDACEAE'],
    'valmuefrø': ['Papaver somniferum', 'PAPAVERACEAE'],
  };

  // Adds { latin, family } to an item when the spice is known.
  S.enrich = (item) => {
    const e = T[item.name.trim().toLowerCase()];
    return Object.assign({}, item, e ? { latin: e[0], family: e[1] } : { latin: '', family: '' });
  };
})(window.Spice);
