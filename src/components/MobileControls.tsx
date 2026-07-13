import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SlidersHorizontal, X, Moon, Sun, BookOpen } from 'lucide-react';
import { SERIES_FILTERS } from '../data/filters';

interface MobileControlsProps {
  currentFilter: string;
  onFilterChange: (filterId: string) => void;
  readingOrderEnabled: boolean;
  onReadingOrderToggle: () => void;
  filteredCount: number;
  totalCount: number;
  isDark: boolean;
  onThemeToggle: () => void;
}

const floatingButtonClass =
  'flex items-center justify-center w-11 h-11 rounded-full border-2 shadow-flat-sm dark:shadow-flat-sm-dark cursor-pointer transition-colors bg-cream border-mint text-ink hover:bg-mint dark:bg-night dark:border-mint/40 dark:text-sage dark:hover:bg-mint/20';

export default function MobileControls({
  currentFilter,
  onFilterChange,
  readingOrderEnabled,
  onReadingOrderToggle,
  filteredCount,
  totalCount,
  isDark,
  onThemeToggle,
}: MobileControlsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFilterSelect = (filterId: string) => {
    onFilterChange(filterId);
    setMenuOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Floating buttons: theme + filters, top right */}
      <div className="fixed top-3 right-3 z-[70] flex gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onThemeToggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={floatingButtonClass}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close filters' : 'Open filters'}
          aria-expanded={menuOpen}
          className={`${floatingButtonClass} ${menuOpen ? '!bg-coral !border-coral !text-ink' : ''}`}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop: tap outside to close */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/30 dark:bg-black/50"
            />

            {/* Filters panel, revealed from the bubble */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-16 right-3 left-3 z-[65] origin-top-right bg-cream dark:bg-night border-2 border-mint dark:border-mint/40 rounded-2xl shadow-flat dark:shadow-flat-dark p-4 flex flex-col gap-3 max-h-[75vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                  Explore series
                </span>
                <span className="font-mono text-[10px] font-bold text-ink dark:text-sage bg-sage dark:bg-abyss border border-mint dark:border-mint/40 px-2 py-1 rounded-lg">
                  {filteredCount} / {totalCount} Books
                </span>
              </div>

              <button
                type="button"
                onClick={onReadingOrderToggle}
                aria-pressed={readingOrderEnabled}
                className={`flex items-center gap-2 px-3 py-2 border-2 rounded-xl text-xs font-medium transition-colors cursor-pointer justify-center ${
                  readingOrderEnabled
                    ? 'bg-coral text-ink border-coral'
                    : 'bg-sage hover:bg-mint text-ink border-mint dark:bg-abyss dark:hover:bg-mint/20 dark:text-sage dark:border-mint/40'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {readingOrderEnabled ? 'Guided Reading (on)' : 'Show Reading Path'}
              </button>

              <div className="flex flex-wrap gap-2">
                {SERIES_FILTERS.map((filter) => {
                  const isSelected = currentFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleFilterSelect(filter.id)}
                      aria-pressed={isSelected}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-coral/90 text-ink border-coral font-semibold'
                          : 'bg-sage text-ink border-mint dark:bg-abyss dark:text-sage dark:border-mint/40'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-mint/40 dark:border-mint/20 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sage dark:bg-abyss inline-block border border-mint" /> Released
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cream dark:bg-abyss border border-dashed border-coral inline-block" /> Upcoming
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-mint inline-block border border-ink/40" /> Read
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-ink dark:bg-black/60 inline-block dark:border dark:border-mint/40" /> On TBR
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
