const fs = require('fs');

const ratings = {
  "elantris": 4.19,
  "the-hope-of-elantris": 3.91,
  "mistborn-1": 4.47,
  "mistborn-2": 4.38,
  "alcatraz-versus-the-evil-librarians": 3.96,
  "mistborn-3": 4.51,
  "alcatraz-versus-the-scrivener-s-bones": 4.09,
  "defending-elysium": 4.12,
  "firstborn": 4.05,
  "warbreaker": 4.38,
  "alcatraz-versus-the-knights-of-crystallia": 4.16,
  "the-gathering-storm": 4.43,
  "the-way-of-kings": 4.65,
  "towers-of-midnight": 4.52,
  "alcatraz-versus-the-shattered-lens": 4.23,
  "i-hate-dragons": 3.86,
  "infinity-blade-awakening": 3.91,
  "the-alloy-of-law": 4.19,
  "the-eleventh-metal": 3.96,
  "heuristic-algorithm-and-reasoning-response-engine": 3.85,
  "legion": 4.21,
  "the-emperor-s-soul": 4.46,
  "a-memory-of-light": 4.56,
  "the-rithmatist": 4.22,
  "river-of-souls": 4.15,
  "infinity-blade-redemption": 4.11,
  "steelheart": 4.13,
  "mitosis": 3.75,
  "shadows-for-silence-in-the-forests-of-hell": 4.24,
  "words-of-radiance": 4.75,
  "dreamer": 3.52,
  "sixth-of-the-dusk": 4.30,
  "allomancer-jak-and-the-pits-of-eltania": 3.90,
  "the-way-of-kings-prime-excerpt": 4.30,
  "legion-skin-deep": 4.20,
  "firefight": 4.25,
  "perfect-state": 4.18,
  "shadows-of-self": 4.31,
  "elantris-10th-anniversary-edition": 4.22,
  "the-bands-of-mourning": 4.40,
  "mistborn-secret-history": 4.39,
  "calamity": 4.20,
  "white-sand-volume-1": 3.85,
  "the-dark-talent": 4.28,
  "arcanum-unbounded": 4.54,
  "edgedancer": 4.25,
  "snapshot": 3.95,
  "oathbringer": 4.62,
  "white-sand-volume-2": 3.90,
  "legion-lies-of-the-beholder": 4.15,
  "legion-the-many-lives-of-stephen-leeds": 4.25,
  "skyward": 4.52,
  "children-of-the-nameless": 4.33,
  "a-fire-within-the-ways": 4.10,
  "white-sand-volume-3": 4.02,
  "starsight": 4.38,
  "dark-one-book-1": 4.14,
  "the-way-of-kings-prime": 4.35,
  "the-original": 3.92,
  "dawnshard": 4.50,
  "rhythm-of-war": 4.61,
  "lux": 4.26,
  "sunreach": 4.28,
  "redawn": 4.31,
  "cytonic": 4.28,
  "evershore": 4.42,
  "skyward-flight": 4.47,
  "stephen-leeds-death-faxes": 4.12,
  "bastille-versus-the-evil-librarians": 4.38,
  "the-lost-metal": 4.55,
  "white-sand-omnibus": 4.25,
  "tress-of-the-emerald-sea": 4.55,
  "dark-one-forgotten": 4.10,
  "the-frugal-wizard-s-handbook-for-surviving-medieval-england": 3.86,
  "yumi-and-the-nightmare-painter": 4.66,
  "the-sunlit-man": 4.53,
  "defiant": 4.32,
  "hyperthief": 4.05,
  "long-chills-case-dough": 3.95,
  "dragonsteel-prime": 4.40,
  "the-most-boring-book-ever": 4.50
};

let content = fs.readFileSync('src/data/books.ts', 'utf8');

content = content.replace(/(id:\s*['"]([^'"]+)['"][\s\S]*?(?:goodreadsRating:\s*[\d.]+(?:,\s*)?)?)(links:\s*\{)/g, (match, prefix, id, suffix) => {
  if (ratings[id] !== undefined) {
    let cleanPrefix = prefix.replace(/\s*goodreadsRating:\s*[\d.]+,?\s*$/m, '\n');
    if (!cleanPrefix.endsWith(',\n    ') && !cleanPrefix.endsWith(',\n  ')) {
      cleanPrefix += ',\n    ';
    }
    return cleanPrefix + `goodreadsRating: ${ratings[id]},\n    ` + suffix;
  }
  return prefix + suffix;
});

fs.writeFileSync('src/data/books.ts', content);
console.log('Ratings successfully injected!');
