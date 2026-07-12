const fs = require('fs');

const readingOrder = {
  "mistborn-1": 1,
  "mistborn-2": 2,
  "mistborn-3": 3,
  "the-way-of-kings": 4,
  "warbreaker": 5,
  "words-of-radiance": 6,
  "elantris": 7,
  "arcanum-unbounded": 8,
  "oathbringer": 9,
  "dawnshard": 10,
  "white-sand-omnibus": 11,
  "white-sand-volume-1": 11,
  "white-sand-volume-2": 11,
  "white-sand-volume-3": 11,
  "rhythm-of-war": 12,
  "the-alloy-of-law": 13,
  "shadows-of-self": 14,
  "the-bands-of-mourning": 15,
  "the-lost-metal": 16,
  "tress-of-the-emerald-sea": 17,
  "yumi-and-the-nightmare-painter": 18,
  "wind-and-truth": 19,
  "the-sunlit-man": 20,
  "isles-of-the-emberdark": 21
};

let content = fs.readFileSync('src/data/books.ts', 'utf8');

// First, lets clear any existing recommendedOrderSeq if they exist by accident
content = content.replace(/\s*recommendedOrderSeq:\s*\d+,?/g, '');

content = content.replace(/(id:\s*['"]([^'"]+)['"][\s\S]*?)(links:\s*\{)/g, (match, prefix, id, suffix) => {
  if (readingOrder[id] !== undefined) {
    let cleanPrefix = prefix;
    if (!cleanPrefix.endsWith(',\n    ') && !cleanPrefix.endsWith(',\n  ')) {
      cleanPrefix += ',\n    ';
    }
    return cleanPrefix + `recommendedOrderSeq: ${readingOrder[id]},\n    ` + suffix;
  }
  return prefix + suffix;
});

fs.writeFileSync('src/data/books.ts', content);
console.log('Reading order successfully injected!');
