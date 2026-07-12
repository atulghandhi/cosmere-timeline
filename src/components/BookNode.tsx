import { memo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Bookmark } from 'lucide-react';
import { Book, UserBookStatus } from '../types';

interface BookNodeProps {
  book: Book;
  isSelected: boolean;
  readingOrderEnabled: boolean;
  userStatus?: UserBookStatus;
  onSelect: (bookId: string) => void;
}

function getNodeColors(isSelected: boolean, isReleased: boolean, userStatus?: UserBookStatus) {
  if (isSelected) {
    return { surface: 'bg-coral border-ink', title: 'text-ink', meta: 'text-ink/70' };
  }
  if (userStatus === 'read') {
    return { surface: 'bg-mint border-ink/40 hover:border-coral', title: 'text-ink', meta: 'text-slate-600' };
  }
  if (userStatus === 'tbr') {
    return { surface: 'bg-ink border-ink hover:border-coral', title: 'text-sage', meta: 'text-slate-300' };
  }
  return {
    surface: `${isReleased ? 'bg-sage' : 'bg-cream/60'} border-mint hover:border-coral`,
    title: 'text-ink',
    meta: 'text-slate-600',
  };
}

function BookNode({ book, isSelected, readingOrderEnabled, userStatus, onSelect }: BookNodeProps) {
  const colors = getNodeColors(isSelected, book.isReleased, userStatus);

  return (
    <motion.button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${book.title} (${book.year})`}
      animate={{ scale: isSelected ? 1.06 : 1 }}
      whileHover={{ scale: isSelected ? 1.08 : 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(book.id);
      }}
      className={`relative flex-shrink-0 w-36 h-36 scroll-ml-6 rounded-full border-2 ${
        book.isReleased ? 'border-solid' : 'border-dashed'
      } flex flex-col justify-center items-center text-center p-4 cursor-pointer select-none ${colors.surface} ${
        !book.isReleased && !isSelected ? 'opacity-80' : ''
      } ${isSelected ? 'shadow-flat z-20' : 'shadow-sm'}`}
    >
      {(userStatus === 'read' || userStatus === 'tbr') && (
        <span
          className="absolute top-1 left-2 bg-sage text-ink border border-ink rounded-full p-0.5 shadow-sm z-10"
          title={userStatus === 'read' ? 'Read' : 'On your TBR'}
        >
          {userStatus === 'read' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" fill="#2A3439" />
          )}
        </span>
      )}

      {readingOrderEnabled && book.recommendedOrderSeq != null && (
        <span className="absolute -top-1 -right-1 bg-coral text-ink border-2 border-ink rounded-full w-6 h-6 flex items-center justify-center font-mono font-bold text-[10px] shadow-sm">
          {book.recommendedOrderSeq}
        </span>
      )}

      <h4 className={`font-display font-bold text-[11px] leading-tight tracking-tight px-1 line-clamp-3 ${colors.title}`}>
        {book.title}
      </h4>

      <div className="mt-1 text-[8.5px] font-mono leading-none flex flex-col items-center">
        <span className={`italic font-medium truncate max-w-[100px] ${colors.meta}`}>
          {book.series}
        </span>
        {book.goodreadsRating != null && (
          <span className={`text-[9px] font-semibold flex items-center gap-0.5 mt-0.5 ${colors.title}`}>
            ★ {book.goodreadsRating}
          </span>
        )}
      </div>

      {!isSelected && <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-coral/60" />}
    </motion.button>
  );
}

export default memo(BookNode);
