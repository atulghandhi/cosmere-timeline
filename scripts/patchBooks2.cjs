const fs = require('fs');

const path = require('path');
const userBooksRaw = fs.readFileSync(path.join(__dirname, 'user_books.json'), 'utf8');
const userBooks = JSON.parse(userBooksRaw);

const booksTsStr = fs.readFileSync(path.join(__dirname, 'src/data/books.ts'), 'utf8');
const booksMatch = booksTsStr.match(/export const books:\s*Book\[\]\s*=\s*(\[[\s\S]+\]);/);
if (!booksMatch) {
  console.error("Could not parse books array!");
  process.exit(1);
}

let books = eval(booksMatch[1]);

// Map titles to user books
const userBookMap = new Map();
userBooks.forEach(ub => {
  let uTitle = ub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (uTitle === 'the-final-empire') uTitle = 'mistborn-1'; // hacky match
  if (uTitle === 'the-well-of-ascension') uTitle = 'mistborn-2';
  if (uTitle === 'the-hero-of-ages') uTitle = 'mistborn-3';
  if (uTitle === 'mistborn-the-final-empire') uTitle = 'mistborn-1';
  userBookMap.set(uTitle, ub);
  userBookMap.set(ub.name.toLowerCase().replace(/[^a-z0-9]+/g, ''), ub);
  userBookMap.set(ub.name.toLowerCase(), ub);
});

books.forEach(b => {
  let target = userBookMap.get(b.id);
  if (!target) target = userBookMap.get(b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  if (!target) target = userBookMap.get(b.title.toLowerCase().replace(/[^a-z0-9]+/g, ''));
  if (!target) target = userBookMap.get(b.title.toLowerCase());
  
  if (target) {
    b.description = target.description;
    
    // add links if they are not "n/a"
    b.links = {};
    if (target.amazon_link && target.amazon_link !== "n/a") b.links.amazon = target.amazon_link;
    if (target.goodreads_link && target.goodreads_link !== "n/a") b.links.goodreads = target.goodreads_link;
    if (target.audible_link && target.audible_link !== "n/a") b.links.audible = target.audible_link;
    if (target.coppermind_link && target.coppermind_link !== "n/a") b.links.coppermind = target.coppermind_link;
  }
  
  // ensure no em dashes based on user constraint ("avoid em-dashes in text")
  if (b.description) {
    b.description = b.description.replace(/—/g, '-');
  } else {
    // Write energetic description if it's missing (though it shouldn't be since we just assign default above if absent)
    b.description = `Get ready for an incredible ride with ${b.title}, one of Sanderson's masterful creations! You will love the magic, the mysteries, and the twists.`;
    
    // provide default search links
    const q = encodeURIComponent(b.title + " Brandon Sanderson");
    b.links = {
      amazon: `https://www.amazon.com/s?k=${q}`,
      goodreads: `https://www.goodreads.com/search?q=${q}`,
      audible: `https://www.audible.com/search?keywords=${q}`
    };
  }
});

const finalBooksTs = "import { Book } from '../types';\n\nexport const books: Book[] = " + JSON.stringify(books, null, 2) + ";\n";

fs.writeFileSync(path.join(__dirname, 'src/data/books.ts'), finalBooksTs.replace(/"([^"]+)":/g, '$1:'));
console.log('Books patched successfully with user JSON data.');
