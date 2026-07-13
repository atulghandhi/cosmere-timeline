import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import MobileControls from './components/MobileControls';
import { books } from './data/books';
import { filterBooks } from './data/filters';
import { useUserBooks } from './hooks/useUserBooks';
import { useTheme } from './hooks/useTheme';
import { useMediaQuery } from './hooks/useMediaQuery';

export default function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [readingOrderEnabled, setReadingOrderEnabled] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const { bookStatuses, setStatus } = useUserBooks();
  const { isDark, toggleTheme } = useTheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const filteredBooks = useMemo(
    () => filterBooks(books, currentFilter, readingOrderEnabled),
    [currentFilter, readingOrderEnabled]
  );

  // Clear a selection that no longer survives the active filter.
  const selectedBookVisible = selectedBookId != null && filteredBooks.some((b) => b.id === selectedBookId);
  const visibleSelectedId = selectedBookVisible ? selectedBookId : null;

  const handleFilterChange = useCallback((filterId: string) => {
    setCurrentFilter(filterId);
    setSelectedBookId(null);
  }, []);

  const handleReadingOrderToggle = useCallback(() => {
    setReadingOrderEnabled((enabled) => !enabled);
    setSelectedBookId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-cream dark:bg-abyss text-ink dark:text-sage font-sans overflow-hidden transition-colors">
      <Header
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        readingOrderEnabled={readingOrderEnabled}
        onReadingOrderToggle={handleReadingOrderToggle}
        filteredCount={filteredBooks.length}
        totalCount={books.length}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      <MobileControls
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        readingOrderEnabled={readingOrderEnabled}
        onReadingOrderToggle={handleReadingOrderToggle}
        filteredCount={filteredBooks.length}
        totalCount={books.length}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      <main
        className="flex-1 min-h-0 flex flex-col relative bg-sage/30 dark:bg-night/30 pt-6 transition-colors"
        onClick={() => setSelectedBookId(null)}
      >
        <div className="hidden md:block absolute top-6 left-0 right-0 text-center px-4 pointer-events-none z-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={readingOrderEnabled ? 'reading' : 'chrono'}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest inline-flex bg-cream/80 dark:bg-night/80 backdrop-blur px-3 py-1 rounded-full border border-mint dark:border-mint/40"
            >
              {readingOrderEnabled ? 'Recommended Reading Order' : 'Chronological Release Timeline'}
            </motion.p>
          </AnimatePresence>
        </div>

        <Timeline
          books={filteredBooks}
          selectedBookId={visibleSelectedId}
          readingOrderEnabled={readingOrderEnabled}
          vertical={!isDesktop}
          bookStatuses={bookStatuses}
          onSelectBook={setSelectedBookId}
          onStatusChange={setStatus}
        />
      </main>
    </div>
  );
}
