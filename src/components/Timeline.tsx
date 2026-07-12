import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Book, UserBookStatus } from '../types';
import BookNode from './BookNode';
import BookDetailCard from './BookDetailCard';
import { useDragScroll } from '../hooks/useDragScroll';

interface TimelineProps {
  books: Book[];
  selectedBookId: string | null;
  readingOrderEnabled: boolean;
  bookStatuses: Record<string, UserBookStatus>;
  onSelectBook: (bookId: string | null) => void;
  onStatusChange: (bookId: string, status: UserBookStatus) => void;
}

const itemSpring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 } as const;

function TimelineMarker({ label }: { label: string | number }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center relative h-full w-24 mr-12">
      {/* Stem, dot on the track, and the label pill above it */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-coral top-1/2 -translate-y-[80px] h-[80px]" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-coral" />
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[96px] z-20">
        <span className="font-mono text-[10.5px] font-bold text-ink bg-cream border-2 border-mint px-3 py-1 rounded-full shadow-flat-sm select-none whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function Timeline({
  books,
  selectedBookId,
  readingOrderEnabled,
  bookStatuses,
  onSelectBook,
  onStatusChange,
}: TimelineProps) {
  const { ref, isDragging, handlers } = useDragScroll<HTMLDivElement>();

  const handleNodeSelect = useCallback(
    (bookId: string) => onSelectBook(selectedBookId === bookId ? null : bookId),
    [onSelectBook, selectedBookId]
  );

  // Keep the selected node (and its detail card) in view. On narrow screens
  // the node + card block is wider than the viewport, so align the node to
  // the left edge instead of centering the whole block. The target is
  // computed from offsetLeft (unaffected by in-flight layout transforms) and
  // applied with scrollTo, which sibling animations cannot cancel the way
  // they cancel a smooth scrollIntoView.
  useEffect(() => {
    if (!selectedBookId) return;
    const container = ref.current;
    if (!container) return;
    const timer = window.setTimeout(() => {
      const item = container.querySelector<HTMLElement>(
        `[data-book-id="${CSS.escape(selectedBookId)}"]`
      );
      if (!item) return;
      const narrow = window.innerWidth < 640;
      const node = item.querySelector('button');
      const left = narrow
        ? item.offsetLeft + (node?.offsetLeft ?? 0) - 24
        : item.offsetLeft + item.offsetWidth / 2 - container.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [selectedBookId, ref]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSelectBook(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSelectBook]);

  return (
    <div
      ref={ref}
      {...handlers}
      className={`flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden custom-scrollbar flex items-center relative ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <div className="relative flex items-center px-24 md:px-48 h-full min-h-[480px] min-w-max">
        {/* Horizontal track line */}
        <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-coral -translate-y-1/2 pointer-events-none" />

        {books.length === 0 && (
          <p className="font-mono text-sm text-slate-500 relative z-10 bg-cream/80 px-4 py-2 rounded-full border border-mint">
            No books match this filter.
          </p>
        )}

        <AnimatePresence mode="popLayout" initial={false}>
          {books.map((book, index) => {
            const isSelected = selectedBookId === book.id;
            const previous = books[index - 1];
            const showMarker = readingOrderEnabled
              ? index === 0 || book.recommendedOrderSeq !== previous?.recommendedOrderSeq
              : index === 0 || book.year !== previous?.year;
            const markerLabel = readingOrderEnabled ? `Part ${book.recommendedOrderSeq}` : book.year;

            return (
              <motion.div
                key={book.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={itemSpring}
                data-book-id={book.id}
                className={`flex items-center flex-shrink-0 h-full mr-12 last:mr-0 relative ${
                  isSelected ? 'z-20' : 'z-10'
                }`}
              >
                {showMarker && <TimelineMarker label={markerLabel} />}

                <BookNode
                  book={book}
                  isSelected={isSelected}
                  readingOrderEnabled={readingOrderEnabled}
                  userStatus={bookStatuses[book.id]}
                  onSelect={handleNodeSelect}
                />

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center flex-shrink-0 relative z-20"
                    >
                      {/* Connector from node to card */}
                      <div className="w-8 h-[3px] bg-coral flex-shrink-0 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-mint border-2 border-ink" />
                      </div>
                      <BookDetailCard
                        book={book}
                        userStatus={bookStatuses[book.id]}
                        onStatusChange={(status) => onStatusChange(book.id, status)}
                        onClose={() => onSelectBook(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
