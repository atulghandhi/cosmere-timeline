import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Book, UserBookStatus } from '../types';
import BookNode from './BookNode';
import BookDetailCard from './BookDetailCard';
import { useDragScroll } from '../hooks/useDragScroll';
import { getReadingArc } from '../data/filters';

interface TimelineProps {
  books: Book[];
  selectedBookId: string | null;
  readingOrderEnabled: boolean;
  vertical: boolean;
  bookStatuses: Record<string, UserBookStatus>;
  onSelectBook: (bookId: string | null) => void;
  onStatusChange: (bookId: string, status: UserBookStatus) => void;
}

const itemSpring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 } as const;

/** X-position (px) of the vertical track on mobile: left padding + half node width. */
const V_TRACK_X = 72;

function getMarkerLabel(book: Book, readingOrderEnabled: boolean): string {
  if (readingOrderEnabled) return getReadingArc(book.recommendedOrderSeq);
  return book.tbd ? 'TBD' : String(book.year);
}

function TimelineMarker({ label, vertical }: { label: string; vertical: boolean }) {
  const pill = (
    <span className="font-mono text-[10.5px] font-bold text-ink dark:text-sage bg-cream dark:bg-night border-2 border-mint dark:border-mint/40 px-3 py-1 rounded-full shadow-flat-sm dark:shadow-flat-sm-dark select-none whitespace-nowrap">
      {label}
    </span>
  );

  if (vertical) {
    return (
      <div className="relative h-9 w-full flex items-center" style={{ paddingLeft: V_TRACK_X }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-coral"
          style={{ left: V_TRACK_X - 4 }}
        />
        <div className="-translate-x-1/2 relative z-20">{pill}</div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 flex items-center justify-center relative h-full w-24 mr-12">
      {/* Stem, dot on the track, and the label pill above it */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-coral top-1/2 -translate-y-[80px] h-[80px]" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-coral" />
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[96px] z-20">{pill}</div>
    </div>
  );
}

export default function Timeline({
  books,
  selectedBookId,
  readingOrderEnabled,
  vertical,
  bookStatuses,
  onSelectBook,
  onStatusChange,
}: TimelineProps) {
  const { ref, isDragging, handlers } = useDragScroll<HTMLDivElement>();

  const handleNodeSelect = useCallback(
    (bookId: string) => onSelectBook(selectedBookId === bookId ? null : bookId),
    [onSelectBook, selectedBookId]
  );

  // On load (and when the visible list changes) start at the most recent
  // released book, centered and unselected, so the user can scroll forward
  // to upcoming books or back through the catalog. In reading-order mode
  // the list starts at Part 1 instead.
  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (readingOrderEnabled) {
      container.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }
    let latest: Book | undefined;
    for (const book of books) {
      if (book.isReleased) latest = book;
    }
    if (!latest) {
      container.scrollTo({ left: 0, top: 0, behavior: 'auto' });
      return;
    }
    const item = container.querySelector<HTMLElement>(`[data-book-id="${CSS.escape(latest.id)}"]`);
    if (!item) return;
    if (vertical) {
      container.scrollTop = item.offsetTop + item.offsetHeight / 2 - container.clientHeight / 2;
    } else {
      container.scrollLeft = item.offsetLeft + item.offsetWidth / 2 - container.clientWidth / 2;
    }
  }, [books, readingOrderEnabled, vertical, ref]);

  // Keep the selected node (and its detail card) in view. On desktop the
  // node + card block is centered horizontally; on mobile the node scrolls
  // to a comfortable vertical position with the card alongside it. Targets
  // are computed from offsets (unaffected by in-flight layout transforms)
  // and applied with scrollTo, which sibling animations cannot cancel the
  // way they cancel a smooth scrollIntoView.
  useEffect(() => {
    if (!selectedBookId) return;
    const container = ref.current;
    if (!container) return;
    const timer = window.setTimeout(() => {
      const item = container.querySelector<HTMLElement>(
        `[data-book-id="${CSS.escape(selectedBookId)}"]`
      );
      if (!item) return;
      if (vertical) {
        const top = item.offsetTop + item.offsetHeight / 2 - container.clientHeight / 2;
        container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      } else {
        const left = item.offsetLeft + item.offsetWidth / 2 - container.clientWidth / 2;
        container.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [selectedBookId, vertical, ref]);

  // Keyboard navigation: arrows step between books (starting from the one
  // nearest the viewport center when nothing is selected), Escape closes.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectBook(null);
        return;
      }
      const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
      const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
      if ((!forward && !backward) || books.length === 0) return;
      e.preventDefault();

      let index = selectedBookId ? books.findIndex((b) => b.id === selectedBookId) : -1;
      if (index === -1) {
        // Start from the book closest to the middle of the viewport.
        const container = ref.current;
        if (container) {
          const mid = vertical
            ? container.scrollTop + container.clientHeight / 2
            : container.scrollLeft + container.clientWidth / 2;
          let best = Infinity;
          books.forEach((book, i) => {
            const item = container.querySelector<HTMLElement>(
              `[data-book-id="${CSS.escape(book.id)}"]`
            );
            if (!item) return;
            const center = vertical
              ? item.offsetTop + item.offsetHeight / 2
              : item.offsetLeft + item.offsetWidth / 2;
            const dist = Math.abs(center - mid);
            if (dist < best) {
              best = dist;
              index = i;
            }
          });
        }
        if (index === -1) index = 0;
        onSelectBook(books[index].id);
        return;
      }
      const next = Math.min(books.length - 1, Math.max(0, index + (forward ? 1 : -1)));
      if (next !== index) onSelectBook(books[next].id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSelectBook, selectedBookId, books, vertical, ref]);

  return (
    <div
      ref={ref}
      {...handlers}
      className={`flex-1 min-h-0 w-full custom-scrollbar relative ${
        vertical
          ? 'overflow-y-auto overflow-x-hidden'
          : 'overflow-x-auto overflow-y-hidden flex items-center'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div
        className={
          vertical
            ? 'relative flex flex-col w-full min-h-full py-14 gap-6'
            : 'relative flex items-center px-24 md:px-48 h-full min-h-[480px] min-w-max'
        }
      >
        {/* Track line */}
        <div
          className={
            vertical
              ? 'absolute top-0 bottom-0 w-[3px] bg-coral pointer-events-none'
              : 'absolute left-0 right-0 top-1/2 h-[3px] bg-coral -translate-y-1/2 pointer-events-none'
          }
          style={vertical ? { left: V_TRACK_X - 1.5 } : undefined}
        />

        {books.length === 0 && (
          <p className="font-mono text-sm text-slate-500 dark:text-slate-400 relative z-10 bg-cream/80 dark:bg-night/80 px-4 py-2 rounded-full border border-mint dark:border-mint/40 self-center mx-auto">
            No books match this filter.
          </p>
        )}

        <AnimatePresence mode="popLayout" initial={false}>
          {books.map((book, index) => {
            const isSelected = selectedBookId === book.id;
            const previous = books[index - 1];
            const markerLabel = getMarkerLabel(book, readingOrderEnabled);
            const showMarker =
              index === 0 || markerLabel !== getMarkerLabel(previous, readingOrderEnabled);

            return (
              <motion.div
                key={book.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={itemSpring}
                data-book-id={book.id}
                className={`flex-shrink-0 relative ${
                  vertical
                    ? 'flex flex-col w-full'
                    : 'flex items-center h-full mr-12 last:mr-0'
                } ${isSelected ? 'z-20' : 'z-10'}`}
              >
                {showMarker && <TimelineMarker label={markerLabel} vertical={vertical} />}

                <div className={vertical ? 'flex items-center w-full pl-4 pr-3 py-2' : 'contents'}>
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
                        className={`flex items-center relative z-20 ${
                          vertical ? 'flex-1 min-w-0' : 'flex-shrink-0'
                        }`}
                      >
                        {/* Connector from node to card */}
                        <div
                          className={`h-[3px] bg-coral flex-shrink-0 flex items-center justify-center ${
                            vertical ? 'w-4' : 'w-8'
                          }`}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-mint border-2 border-ink dark:border-sage" />
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
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
