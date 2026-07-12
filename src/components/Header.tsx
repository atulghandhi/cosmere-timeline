import { motion } from 'motion/react';
import { Sword, BookOpen, Compass } from 'lucide-react';
import { SERIES_FILTERS } from '../data/filters';

interface HeaderProps {
  currentFilter: string;
  onFilterChange: (filterId: string) => void;
  readingOrderEnabled: boolean;
  onReadingOrderToggle: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function Header({
  currentFilter,
  onFilterChange,
  readingOrderEnabled,
  onReadingOrderToggle,
  filteredCount,
  totalCount,
}: HeaderProps) {
  return (
    <header className="bg-cream border-b-2 border-mint/80 sticky top-0 z-50 px-4 sm:px-8 py-4">
      <div className="max-w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 sm:p-2.5 bg-mint border-2 border-sage rounded-xl shrink-0">
            <Sword className="w-5 h-5 sm:w-6 sm:h-6 text-ink" />
          </div>
          <div>
            <h1 className="font-display font-medium text-lg sm:text-2xl tracking-tight text-ink flex flex-wrap items-center gap-2">
              Cosmere & Beyond
              <span className="text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 bg-coral/20 border border-coral/55 rounded-md text-ink/90">
                Sanderson Universe
              </span>
            </h1>
            <p className="text-slate-600 text-[10px] sm:text-xs mt-0.5">
              Interactive timeline of releases, future works, and recommended reading paths.
            </p>
          </div>
        </div>

        {/* Reading-order toggle & book count */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReadingOrderToggle}
            aria-pressed={readingOrderEnabled}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer grow sm:grow-0 justify-center ${
              readingOrderEnabled
                ? 'bg-coral text-ink border-coral'
                : 'bg-sage hover:bg-mint text-ink border-mint'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink" />
            {readingOrderEnabled ? 'Guided Reading' : 'Show Reading Path'}
          </motion.button>

          <div className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-sage border-2 border-mint rounded-xl text-xs sm:text-sm font-medium text-ink shrink-0">
            <span className="font-mono text-[10px] sm:text-xs font-bold">
              {filteredCount} / {totalCount} Books
            </span>
          </div>
        </div>
      </div>

      {/* Series filter chips */}
      <div className="max-w-full mt-4 pt-4 border-t border-mint/40">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Explore series</span>
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
                    : 'bg-sage hover:bg-mint text-ink border-mint hover:border-coral/55'
                }`}
              >
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-full flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 mt-2 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sage inline-block border border-mint" /> Released
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cream border border-dashed border-coral inline-block" /> Upcoming / Announced
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-mint inline-block border border-ink/40" /> Read
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-ink inline-block" /> On TBR
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-slate-500">
          <span>Drag or scroll the timeline · Click a book for details · Esc to close</span>
        </div>
      </div>
    </header>
  );
}
