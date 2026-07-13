import { Book } from '../types';

export interface SeriesFilter {
  id: string;
  label: string;
  test: (book: Book) => boolean;
}

const SECRET_PROJECT_IDS = new Set([
  'tress-of-the-emerald-sea',
  'yumi-and-the-nightmare-painter',
  'the-sunlit-man',
  'the-frugal-wizard-s-handbook-for-surviving-medieval-england',
]);

const bySeries = (series: string) => (book: Book) => book.series === series;

export const SERIES_FILTERS: SeriesFilter[] = [
  { id: 'all', label: 'All Works', test: () => true },
  { id: 'cosmere', label: 'Cosmere Only', test: (b) => b.cosmere === true },
  { id: 'non-cosmere', label: 'Non-Cosmere', test: (b) => b.cosmere === false },
  { id: 'stormlight', label: 'Stormlight Archive', test: bySeries('The Stormlight Archive') },
  { id: 'mistborn', label: 'Mistborn Saga', test: bySeries('Mistborn') },
  { id: 'secret-projects', label: 'Secret Projects', test: (b) => SECRET_PROJECT_IDS.has(b.id) },
  { id: 'elantris', label: 'Elantris', test: bySeries('Elantris') },
  { id: 'warbreaker', label: 'Warbreaker', test: (b) => b.id === 'warbreaker' },
  { id: 'white-sand', label: 'White Sand', test: bySeries('White Sand') },
  {
    id: 'skyward',
    label: 'Skyward (Cytoverse)',
    test: (b) => b.series === 'Skyward' || b.series === 'Riftwake' || b.id === 'defending-elysium',
  },
  { id: 'reckoners', label: 'The Reckoners', test: bySeries('The Reckoners') },
  { id: 'legion', label: 'Legion', test: bySeries('Legion') },
  { id: 'alcatraz', label: 'Alcatraz Smedry', test: bySeries('Alcatraz Versus the Evil Librarians') },
  { id: 'wheel-of-time', label: 'Wheel of Time', test: bySeries('The Wheel of Time') },
  { id: 'rithmatist', label: 'The Rithmatist', test: bySeries('The Rithmatist') },
  { id: 'dark-one', label: 'Dark One', test: bySeries('Dark One') },
  {
    id: 'hoid-stories',
    label: "Hoid's Stories",
    test: (b) => b.series === "Hoid's Storybook Collection" || b.series === "Hoid's Travails",
  },
  { id: 'curiosities', label: 'Curiosities', test: bySeries('Sanderson Curiosities') },
  { id: 'standalone', label: 'Standalones', test: bySeries('Standalone') },
];

export function filterBooks(books: Book[], filterId: string, readingOrder: boolean): Book[] {
  const filter = SERIES_FILTERS.find((f) => f.id === filterId) ?? SERIES_FILTERS[0];
  const result = books.filter(filter.test);

  if (readingOrder) {
    return result
      .filter((b) => b.recommendedOrderSeq != null)
      .sort((a, b) => (a.recommendedOrderSeq ?? 0) - (b.recommendedOrderSeq ?? 0));
  }
  return result.sort((a, b) => a.year - b.year);
}
