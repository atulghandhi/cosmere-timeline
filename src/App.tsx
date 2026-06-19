import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import BookNode from './components/BookNode';
import BookDetailCard from './components/BookDetailCard';
import { books } from './data/books';
import { useUserBooks } from './utils/useUserBooks';

export default function App() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [readingOrderEnabled, setReadingOrderEnabled] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  
  const { bookStatuses, setStatus } = useUserBooks();

  // Scroll logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollLeftStart = useRef(0);

  const filteredBooks = useMemo(() => {
    let result = books;
    if (currentFilter === "cosmere") {
      result = result.filter(b => b.cosmere === true);
    } else if (currentFilter === "non-cosmere") {
      result = result.filter(b => b.cosmere === false);
    } else if (currentFilter === "Secret Projects") {
      result = result.filter(b => ['Tress of the Emerald Sea', 'Yumi and the Nightmare Painter', 'The Sunlit Man', "The Frugal Wizard's Handbook for Surviving Medieval England"].includes(b.title));
    } else if (currentFilter !== "all") {
      result = result.filter(b => b.series === currentFilter);
    }
    
    if (readingOrderEnabled) {
      result = result.filter(b => b.recommendedOrderSeq).sort((a, b) => (a.recommendedOrderSeq || 0) - (b.recommendedOrderSeq || 0));
    } else {
      result = result.sort((a, b) => a.year - b.year);
    }
    return result;
  }, [currentFilter, readingOrderEnabled]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 2;
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F4E8] text-[#2A3439] font-sans overflow-hidden">
      <Header 
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        readingOrderEnabled={readingOrderEnabled}
        onReadingOrderToggle={() => setReadingOrderEnabled(!readingOrderEnabled)}
        filteredCount={filteredBooks.length}
        totalCount={books.length}
      />

      <main 
        className="flex-grow flex flex-col relative bg-[#E5EEE4]/30 py-6 overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={() => setSelectedBookId(null)}
      >
        <div className="absolute top-6 left-0 right-0 text-center px-4 pointer-events-none z-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={readingOrderEnabled ? 'reading' : 'chrono'}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest inline-flex bg-[#F6F4E8]/80 backdrop-blur px-3 py-1 rounded-full border border-[#C0E1D2]"
            >
              {readingOrderEnabled ? "Guided Reading Experience" : "Chronological Timeline Mode"}
            </motion.p>
          </AnimatePresence>
        </div>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="overflow-x-auto w-full no-scrollbar flex items-center h-[520px] relative"
        >
          <div className="relative flex items-center gap-12 px-64 md:px-[35%] h-full z-10 py-10 min-w-max">
            {/* Timeline horizontal track line */}
            <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-[#DC9B9B] -translate-y-1/2 pointer-events-none z-0" />

            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book, index) => {
                const isSelected = selectedBookId === book.id;
                
                const showYear = readingOrderEnabled 
                  ? (index === 0 || book.recommendedOrderSeq !== filteredBooks[index - 1].recommendedOrderSeq)
                  : (index === 0 || book.year !== filteredBooks[index - 1].year);

                const label = readingOrderEnabled ? `Part ${book.recommendedOrderSeq}` : book.year;
                
                return (
                  <React.Fragment key={book.id}>
                    {showYear && (
                      <div className="flex-shrink-0 flex items-center justify-center relative h-full w-24 z-10 transition-all">
                        {/* Stem for year */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-[#DC9B9B] top-1/2 -translate-y-[80px] h-[80px] z-0" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#DC9B9B]" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[96px] z-20">
                          <span className="font-mono text-[10.5px] font-bold text-[#2A3439] bg-[#F6F4E8] border-2 border-[#C0E1D2] px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#2A3439] select-none whitespace-nowrap">
                            {label}
                          </span>
                        </div>
                      </div>
                    )}

                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="flex-shrink-0 flex items-center justify-center relative h-full z-15"
                    >
                      <BookNode
                        book={book}
                        isSelected={isSelected}
                        readingOrderEnabled={readingOrderEnabled}
                        userStatus={bookStatuses[book.id]}
                        onClick={() => setSelectedBookId(isSelected ? null : book.id)}
                      />
                    </motion.div>
                    
                    {/* Detail Card rendered next to node if selected */}
                    {isSelected && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center flex-shrink-0 z-20 relative -ml-4"
                      >
                         <div className="w-8 h-[3px] bg-[#DC9B9B] relative z-20 flex-shrink-0 flex items-center justify-center">
                           <div className="w-2.5 h-2.5 rounded-full bg-[#C0E1D2] border-2 border-[#2A3439]" />
                         </div>
                         <BookDetailCard
                           book={book}
                           userStatus={bookStatuses[book.id]}
                           onStatusChange={(status) => setStatus(book.id, status)}
                           onClose={() => setSelectedBookId(null)}
                         />
                      </motion.div>
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
