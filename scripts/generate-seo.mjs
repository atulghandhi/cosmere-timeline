/**
 * Generates SEO content into index.html between the SEO markers:
 * - JSON-LD structured data (WebSite, ItemList of Books, FAQPage)
 * - A <noscript> book index so non-JS crawlers (search engines, LLM bots)
 *   see the full catalog in raw HTML.
 *
 * Runs automatically before every build (npm "prebuild" script), so the
 * generated block always matches src/data/books.ts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://cosmere-timeline.vercel.app';

const booksSrc = readFileSync(join(root, 'src/data/books.ts'), 'utf8');
const match = booksSrc.match(/export const books: Book\[\] = (\[[\s\S]+\]);/);
if (!match) throw new Error('Could not parse books array from src/data/books.ts');
const books = eval(match[1]);

const released = books.filter((b) => b.isReleased);
const upcoming = books.filter((b) => !b.isReleased);
const latest = released.reduce((a, b) => (b.year >= a.year ? b : a));
const nextDated = upcoming.filter((b) => !b.tbd).sort((a, b) => a.year - b.year)[0];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- JSON-LD ----------
const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cosmere & Beyond — Brandon Sanderson Book Timeline',
  url: SITE_URL,
  description:
    'Interactive timeline of every Brandon Sanderson book: release dates, recommended reading order, Goodreads ratings, and all announced upcoming books.',
  about: {
    '@type': 'Person',
    name: 'Brandon Sanderson',
    url: 'https://www.brandonsanderson.com',
    jobTitle: 'Author',
  },
};

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Every Brandon Sanderson book in release order',
  numberOfItems: books.length,
  itemListElement: books.map((b, i) => {
    const book = {
      '@type': 'Book',
      name: b.title,
      author: { '@type': 'Person', name: b.author },
      description: b.description,
      bookFormat: 'https://schema.org/Hardcover',
      inLanguage: 'en',
    };
    if (b.isReleased) book.datePublished = String(b.year);
    if (b.series && b.series !== 'Standalone') book.isPartOf = { '@type': 'BookSeries', name: b.series };
    if (b.goodreadsRating != null) {
      book.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: b.goodreadsRating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1000,
      };
    }
    const sameAs = [b.links?.goodreads, b.links?.coppermind].filter(
      (u) => u && !u.includes('/search')
    );
    if (sameAs.length) book.sameAs = sameAs;
    return { '@type': 'ListItem', position: i + 1, item: book };
  }),
};

const releaseAnswer = (b) => {
  if (b.tbd) {
    return `${b.title} has been announced by Brandon Sanderson but has no confirmed release date yet. ${b.description}`;
  }
  return `${b.title} is expected in ${b.year}. ${b.description}`;
};

const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which Brandon Sanderson book should I start with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most readers should start with Mistborn: The Final Empire — it is a complete story, the first step of the recommended Cosmere reading path, and the best introduction to Sanderson’s style. The Stormlight Archive (starting with The Way of Kings) is the deeper epic once you’re hooked, and Tress of the Emerald Sea or Warbreaker are great standalone entry points.',
      },
    },
    {
      '@type': 'Question',
      name: 'What order should I read the Cosmere books in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A widely recommended path: Mistborn Era 1 (The Final Empire, The Well of Ascension, The Hero of Ages), then Stormlight begins (The Way of Kings, Warbreaker, Words of Radiance), then Cosmere standalones (Elantris, Arcanum Unbounded), Stormlight deepens (Oathbringer, Dawnshard, White Sand, Rhythm of War), Mistborn Era 2 (The Alloy of Law through The Lost Metal), and finally the Secret Projects and Wind and Truth. The site’s “Show Reading Path” mode walks this order book by book.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many books has Brandon Sanderson published?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `This timeline tracks ${released.length} published Brandon Sanderson works (novels, novellas, graphic novels, and collections) plus ${upcoming.length} announced upcoming works. His most recent release is ${latest.title} (${latest.year}).`,
      },
    },
    {
      '@type': 'Question',
      name: 'What is the next Brandon Sanderson book?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: nextDated
          ? `The next scheduled Brandon Sanderson release is ${nextDated.title} (${nextDated.year}). ${nextDated.description}`
          : 'See the timeline for all announced upcoming Brandon Sanderson books.',
      },
    },
    ...upcoming.map((b) => ({
      '@type': 'Question',
      name: `When will ${b.title} be released?`,
      acceptedAnswer: { '@type': 'Answer', text: releaseAnswer(b) },
    })),
  ],
};

const jsonLd = [website, itemList, faq]
  .map((obj) => `    <script type="application/ld+json">${JSON.stringify(obj)}</script>`)
  .join('\n');

// ---------- <noscript> crawlable index ----------
const bookLine = (b) => {
  const status = b.isReleased
    ? `released ${b.year}`
    : b.tbd
      ? 'announced, release date TBD'
      : `expected ${b.year}`;
  const rating = b.goodreadsRating != null ? ` Goodreads rating: ${b.goodreadsRating}/5.` : '';
  const series = b.series && b.series !== 'Standalone' ? ` (${b.series}${b.seriesNumber != null ? ` #${b.seriesNumber}` : ''})` : '';
  return `        <li><h3>${esc(b.title)}${esc(series)} — ${status}</h3><p>${esc(b.description)}${esc(rating)}</p></li>`;
};

const noscript = `    <noscript>
      <main>
        <h1>Brandon Sanderson Books in Order — Complete Interactive Timeline</h1>
        <p>
          Every Brandon Sanderson book on one timeline: the Cosmere (Mistborn, The Stormlight
          Archive, Elantris, Warbreaker, the Secret Projects), the Cytoverse (Skyward, Riftwake),
          The Reckoners, Alcatraz, the Wheel of Time conclusions, and every announced upcoming
          release — including the Mistborn Ghostbloods trilogy, Stormlight Archive Book 6,
          Horneater, Blightfall, and The Fires of December. Release years, Goodreads ratings,
          recommended Cosmere reading order, and links to Coppermind, Goodreads, Amazon, and
          Audible for ${books.length} works.
        </p>
        <h2>All ${books.length} books by release date</h2>
        <ol>
${books.map(bookLine).join('\n')}
        </ol>
      </main>
    </noscript>`;

// ---------- inject into index.html ----------
const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const HEAD_START = '<!-- seo:jsonld:start -->';
const HEAD_END = '<!-- seo:jsonld:end -->';
const BODY_START = '<!-- seo:noscript:start -->';
const BODY_END = '<!-- seo:noscript:end -->';

const replaceBetween = (input, start, end, content) => {
  const s = input.indexOf(start);
  const e = input.indexOf(end);
  if (s === -1 || e === -1) throw new Error(`SEO markers ${start} not found in index.html`);
  return input.slice(0, s + start.length) + '\n' + content + '\n    ' + input.slice(e);
};

html = replaceBetween(html, HEAD_START, HEAD_END, jsonLd);
html = replaceBetween(html, BODY_START, BODY_END, noscript);
writeFileSync(htmlPath, html);
console.log(
  `SEO generated: ${books.length} books in JSON-LD, ${faq.mainEntity.length} FAQ entries, noscript index ${(noscript.length / 1024).toFixed(1)}KB`
);
