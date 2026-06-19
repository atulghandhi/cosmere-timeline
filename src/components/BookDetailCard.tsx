import { motion } from "motion/react";
import { Book, UserBookStatus } from "../types";
import { Star, BookOpen, X, Info, CheckCircle, Bookmark, ShoppingCart, Headset } from "lucide-react";
import { getAffiliateUrl } from "../utils/affiliate";

interface BookDetailCardProps {
  book: Book;
  userStatus?: UserBookStatus;
  onStatusChange?: (status: UserBookStatus) => void;
  onClose: () => void;
}

export default function BookDetailCard({ book, userStatus, onStatusChange, onClose }: BookDetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      className="flex-shrink-0 w-[290px] min-[380px]:w-[340px] sm:w-[380px] h-96 border-2 border-[#C0E1D2] rounded-2xl bg-[#F6F4E8] shadow-[4px_4px_0px_0px_rgba(42,52,57,0.15)] flex flex-col overflow-hidden relative z-30 mx-2"
    >
      {/* Connector Header line for the "connected node" visual */}
      <div className="bg-[#E5EEE4] border-b border-[#C0E1D2] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C0E1D2] text-[#2A3439]">
            {book.cosmere ? "Cosmere Universe" : "Standalone / Other"}
          </span>
          <span className="text-[10px] font-mono text-slate-600">
            {book.year}
          </span>
        </div>
        
        {/* Flat Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 rounded-md text-[#2A3439] hover:bg-[#DC9B9B]/30 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main content body */}
      <div className="flex-grow p-4 overflow-y-auto no-scrollbar flex flex-col gap-3">
        {/* Title */}
        <div>
          <h3 className="font-display font-bold text-lg text-[#2A3439] tracking-tight leading-tight">
            {book.title}
          </h3>
          {book.seriesNumber && (
            <p className="text-[10.5px] font-mono font-medium text-slate-600 mt-0.5">
              {book.seriesNumber}
              {book.subSeries && <span className="text-slate-500"> ({book.subSeries})</span>}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 py-1 px-2.5 bg-[#E5EEE4]/55 rounded-lg border border-[#C0E1D2]/50 self-start">
          <Star className="w-3.5 h-3.5 text-[#2A3439] fill-[#DC9B9B]" />
          <span className="text-[11px] font-mono font-bold text-[#2A3439]">
            {book.goodreadsRating ? `${book.goodreadsRating} / 5.0` : "Forthcoming"}
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            (Goodreads average)
          </span>
        </div>

        {/* User Personalization: Read and TBR Toggles */}
        {onStatusChange && (
          <div className="flex gap-2 my-1">
            <button
              onClick={() => onStatusChange(userStatus === 'read' ? null : 'read')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-colors border-2 ${
                userStatus === 'read'
                  ? 'bg-[#DC9B9B] border-[#DC9B9B] text-[#2A3439]'
                  : 'bg-[#F6F4E8] border-[#C0E1D2] text-slate-600 hover:border-[#DC9B9B]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {userStatus === 'read' ? 'Read' : 'Mark as Read'}
            </button>
            <button
              onClick={() => onStatusChange(userStatus === 'tbr' ? null : 'tbr')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-colors border-2 ${
                userStatus === 'tbr'
                  ? 'bg-[#2A3439] border-[#2A3439] text-[#E5EEE4]'
                  : 'bg-[#F6F4E8] border-[#C0E1D2] text-slate-600 hover:border-[#2A3439]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {userStatus === 'tbr' ? 'On TBR' : 'Add to TBR'}
            </button>
          </div>
        )}

        {/* Description text */}
        <div className="text-slate-700 text-xs leading-relaxed max-h-28 overflow-y-auto pr-1">
          <p>{book.description}</p>
        </div>

        {/* Future releases warning if applicable */}
        {!book.isReleased && (
          <div className="bg-[#DC9B9B]/15 border border-[#DC9B9B]/40 rounded-lg p-2 text-[10px] text-[#2A3439]/90 flex gap-1 items-start">
            <span className="font-bold">⚠️</span>
            <span>
              Future release indicator: dates and metadata are preliminary.
            </span>
          </div>
        )}

        {/* Dynamic Buttons Row */}
        <div className="mt-auto pt-2 border-t border-[#C0E1D2]/30 flex flex-col gap-1.5">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-2.5 h-2.5 text-[#2A3439]/60" /> External Reference Logs
          </span>
          
          <div className="grid grid-cols-2 gap-1.5">
            {book.links.coppermind && (
              <a
                href={book.links.coppermind}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 bg-[#E5EEE4] border border-[#C0E1D2] hover:bg-[#C0E1D2]/40 rounded-lg text-[10px] font-medium text-[#2A3439] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <BookOpen className="w-3 h-3 text-[#2A3439]" />
                Coppermind Wiki
              </a>
            )}

            {book.links.goodreads && (
              <a
                href={book.links.goodreads}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 bg-[#E5EEE4] border border-[#C0E1D2] hover:bg-[#C0E1D2]/40 rounded-lg text-[10px] font-medium text-[#2A3439] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Star className="w-3 h-3 text-[#2A3439]" />
                Goodreads page
              </a>
            )}

            {book.links.amazon && (
              <a
                href={getAffiliateUrl(book.links.amazon)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 bg-[#E5EEE4] border border-[#C0E1D2] hover:bg-[#C0E1D2]/40 rounded-lg text-[10px] font-medium text-[#2A3439] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingCart className="w-3 h-3 text-[#2A3439]" />
                Amazon Store
              </a>
            )}

            {book.links.audible && (
              <a
                href={getAffiliateUrl(book.links.audible)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 bg-[#E5EEE4] border border-[#C0E1D2] hover:bg-[#C0E1D2]/40 rounded-lg text-[10px] font-medium text-[#2A3439] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Headset className="w-3 h-3 text-[#2A3439]" />
                Audible
              </a>
            )}

            {book.links.goodreads && (
              <a
                href={book.links.goodreads}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 bg-[#E5EEE4] border border-[#C0E1D2] hover:bg-[#C0E1D2]/40 rounded-lg text-[10px] font-medium text-[#2A3439] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Bookmark className="w-3 h-3 text-[#2A3439]" />
                Goodreads
              </a>
            )}

            {book.links.coppermind && (
              <a
                href={book.links.coppermind}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1.5 bg-[#E5EEE4] border border-[#C0E1D2] hover:bg-[#C0E1D2]/40 rounded-lg text-[10px] font-medium text-[#2A3439] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <BookOpen className="w-3 h-3 text-[#2A3439]" />
                Coppermind
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
