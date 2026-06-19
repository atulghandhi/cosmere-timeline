import { motion } from "motion/react";
import { Sword, BookOpen, Compass } from "lucide-react";

interface HeaderProps {
  currentFilter: string;
  onFilterChange: (filter: any) => void;
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
  totalCount
}: HeaderProps) {
  const seriesList = [
    { id: "all", name: "All Works" },
    { id: "cosmere", name: "Cosmere Only" },
    { id: "non-cosmere", name: "Non-Cosmere" },
    { id: "The Stormlight Archive", name: "Stormlight Archive" },
    { id: "Mistborn", name: "Mistborn Saga" },
    { id: "Secret Projects", name: "Secret Projects" },
    { id: "Elantris", name: "Elantris" },
    { id: "Warbreaker", name: "Warbreaker" },
    { id: "Skyward", name: "Skyward (Cytoverse)" },
    { id: "The Reckoners", name: "The Reckoners" },
    { id: "Legion", name: "Legion" },
    { id: "Alcatraz Versus the Evil Librarians", name: "Alcatraz Smedry" },
    { id: "The Wheel of Time", name: "Wheel of Time" },
    { id: "The Rithmatist", name: "The Rithmatist" },
    { id: "Dark One", name: "Dark One" },
  ];

  return (
    <header className="bg-[#F6F4E8] border-b-2 border-[#C0E1D2]/80 sticky top-0 z-50 px-4 sm:px-8 py-4">
      <div className="max-w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 sm:p-2.5 bg-[#C0E1D2] border-2 border-[#E5EEE4] rounded-xl shrink-0">
            <Sword className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A3439]" />
          </div>
          <div>
            <h1 className="font-display font-medium text-lg sm:text-2xl tracking-tight text-[#2A3439] flex flex-wrap items-center gap-2">
              Cosmere & Beyond
              <span className="text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 bg-[#DC9B9B]/20 border border-[#DC9B9B]/55 rounded-md text-[#2A3439]/90">
                Sanderson Universe
              </span>
            </h1>
            <p className="text-slate-600 text-[10px] sm:text-xs mt-0.5">
              Interactive timeline of chronological releases, future works, and recommended paths.
            </p>
          </div>
        </div>

        {/* Universal controls: Reading order guide */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="btn-toggle-reading-order"
            onClick={onReadingOrderToggle}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer grow sm:grow-0 justify-center ${
              readingOrderEnabled
                ? "bg-[#DC9B9B] text-[#2A3439] border-[#DC9B9B]"
                : "bg-[#E5EEE4] hover:bg-[#C0E1D2] text-[#2A3439] border-[#C0E1D2]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A3439]" />
            {readingOrderEnabled ? "Guided Reading" : "Show Reading Path"}
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#E5EEE4] border-2 border-[#C0E1D2] rounded-xl text-xs sm:text-sm font-medium text-[#2A3439] shrink-0">
            <span className="font-mono text-[10px] sm:text-xs font-bold">{filteredCount} / {totalCount} Books</span>
          </div>
        </div>
      </div>

      {/* Grid Filtering Row */}
      <div className="max-w-full mt-4 pt-4 border-t border-[#C0E1D2]/40">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Explore series</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {seriesList.map((series) => {
            const isSelected = currentFilter === series.id;
            return (
              <motion.button
                key={series.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onFilterChange(series.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex-shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#DC9B9B]/90 text-[#2A3439] border-[#DC9B9B] font-semibold"
                    : "bg-[#E5EEE4] hover:bg-[#C0E1D2] text-[#2A3439] border-[#C0E1D2] hover:border-[#DC9B9B]/55"
                }`}
              >
                {series.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Guide Note */}
      <div className="max-w-full flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 mt-2 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C0E1D2] inline-block border border-[#DC9B9B]"></span> Released
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E5EEE4] border border-dashed border-[#DC9B9B] inline-block"></span> Unreleased Ghostbooks
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-slate-500">
          <span>Click outside nodes to clear selection</span>
        </div>
      </div>
    </header>
  );
}
