import { motion } from 'motion/react';
import { Sword, BookOpen, Compass, Moon, Sun, Github } from 'lucide-react';
import { SERIES_FILTERS } from '../data/filters';

export const GITHUB_URL = 'https://github.com/atulghandhi/cosmere-timeline';

interface HeaderProps {
  currentFilter: string;
  onFilterChange: (filterId: string) => void;
  readingOrderEnabled: boolean;
  onReadingOrderToggle: () => void;
  filteredCount: number;
  totalCount: number;
  isDark: boolean;
  onThemeToggle: () => void;
}

export default function Header({
  currentFilter,
  onFilterChange,
  readingOrderEnabled,
  onReadingOrderToggle,
  filteredCount,
  totalCount,
  isDark,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="bg-cream dark:bg-abyss border-b-2 border-mint/80 dark:border-mint/25 sticky top-0 z-50 px-4 sm:px-8 py-3 md:py-4 transition-colors">
      <div className="max-w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto pr-24 md:pr-0">
          <div className="p-2 sm:p-2.5 bg-mint dark:bg-mint/25 border-2 border-sage dark:border-mint/30 rounded-xl shrink-0">
            <Sword className="w-5 h-5 sm:w-6 sm:h-6 text-ink dark:text-mint" />
          </div>
          <div>
            <h1 className="font-display font-medium text-lg sm:text-2xl tracking-tight text-ink dark:text-cream flex flex-wrap items-center gap-2">
              Cosmere & Beyond
              <span className="sr-only">— Brandon Sanderson Book Release Timeline</span>
              <span className="hidden sm:inline text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 bg-coral/20 border border-coral/55 rounded-md text-ink/90 dark:text-sage/90">
                Sanderson Universe
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-[10px] sm:text-xs mt-0.5">
              Every Brandon Sanderson book — release timeline, reading order, and upcoming works.
            </p>
          </div>
        </div>

        {/* Desktop controls: GitHub, theme, reading order, count */}
        <div className="hidden md:flex items-center gap-2.5 w-auto justify-end">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="flex items-center justify-center w-10 h-10 border-2 rounded-xl bg-sage hover:bg-mint border-mint dark:bg-night dark:hover:bg-mint/20 dark:border-mint/40 text-ink dark:text-sage transition-colors cursor-pointer"
          >
            <Github className="w-4 h-4" />
          </motion.a>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-10 h-10 border-2 rounded-xl bg-sage hover:bg-mint border-mint dark:bg-night dark:hover:bg-mint/20 dark:border-mint/40 text-ink dark:text-sage transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReadingOrderToggle}
            aria-pressed={readingOrderEnabled}
            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-colors cursor-pointer justify-center ${
              readingOrderEnabled
                ? 'bg-coral text-ink border-coral'
                : 'bg-sage hover:bg-mint text-ink border-mint dark:bg-night dark:hover:bg-mint/20 dark:text-sage dark:border-mint/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {readingOrderEnabled ? 'Guided Reading' : 'Show Reading Path'}
          </motion.button>

          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-sage dark:bg-night border-2 border-mint dark:border-mint/40 rounded-xl text-sm font-medium text-ink dark:text-sage shrink-0">
            <span className="font-mono text-xs font-bold">
              {filteredCount} / {totalCount} Books
            </span>
          </div>
        </div>
      </div>

      {/* Series filter chips (desktop only; mobile uses the floating menu) */}
      <div className="hidden md:block max-w-full mt-4 pt-4 border-t border-mint/40 dark:border-mint/20">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
            Explore series
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {SERIES_FILTERS.map((filter) => {
            const isSelected = currentFilter === filter.id;
            return (
              <motion.button
                key={filter.id}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onFilterChange(filter.id)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex-shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-coral/90 text-ink border-coral font-semibold'
                    : 'bg-sage hover:bg-mint text-ink border-mint dark:bg-night dark:hover:bg-mint/20 dark:text-sage dark:border-mint/40 hover:border-coral/55'
                }`}
              >
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend (desktop only) */}
      <div className="hidden md:flex max-w-full flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sage dark:bg-night inline-block border border-mint" /> Released
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cream dark:bg-abyss border border-dashed border-coral inline-block" /> Upcoming / Announced
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-mint inline-block border border-ink/40" /> Read
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-ink dark:bg-black/60 inline-block dark:border dark:border-mint/40" /> On TBR
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs">
          <span>Drag or scroll the timeline · Click a book for details · Esc to close</span>
        </div>
      </div>
    </header>
  );
}
