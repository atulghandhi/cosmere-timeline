import { motion, AnimatePresence } from "motion/react";
import { Book } from "../types";
import { Star, BookOpen, X, Info, ShoppingCart, Headset } from "lucide-react";
import { getAffiliateUrl } from "../utils/affiliate";

interface BookDetailPopupProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookDetailPopup({ book, onClose }: BookDetailPopupProps) {
  if (!book) return null;

  return (
    <div className="absolute top-4 left-4 right-4 md:right-auto md:left-6 md:w-[450px] z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.9)] text-slate-100 flex flex-col gap-4 relative overflow-hidden"
        >
          {/* Accent decoration */}
          <div className={`absolute top-0 left-0 w-2 h-full ${
            book.cosmere ? "bg-amber-500" : "bg-sky-500"
          }`} />

          {/* Close button with bouncy feedback */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Series badge & metadata row */}
          <div className="pl-2 pr-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded ${
                book.cosmere 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" 
                  : "bg-sky-500/10 text-sky-400 border border-sky-500/30"
              }`}>
                {book.cosmere ? "Cosmere Universe" : "Standalone / Cytoverse"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {book.year}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                {book.lengthType}
              </span>
            </div>

            {/* Book Title */}
            <h3 className="font-display font-extrabold text-2xl text-slate-100 pr-4 mt-2 tracking-tight leading-8">
              {book.title}
            </h3>

            {/* Series Subheadings */}
            {book.seriesNumber && (
              <p className="text-amber-400/90 text-xs font-mono font-medium mt-1">
                {book.seriesNumber}
                {book.subSeries && <span className="text-slate-500"> ({book.subSeries})</span>}
              </p>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-yellow-400">
              <Star className="w-4.5 h-4.5 fill-yellow-400" />
            </div>
            <span className="text-sm font-mono font-bold text-slate-200">
              {book.goodreadsRating ? `${book.goodreadsRating} / 5.0` : "Unrated Future Release"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (Goodreads Average rating)
            </span>
          </div>

          {/* Description */}
          <div className="text-slate-300 text-sm leading-6 pr-2 max-h-48 overflow-y-auto font-sans relative">
            <p>{book.description}</p>
          </div>

          <hr className="border-slate-800 mt-auto" />

          {/* Dynamic Links Grid */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3 h-3" /> External reading & acquisition pages
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Coppermind link */}
              {book.links.coppermind && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={book.links.coppermind}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 rounded-xl text-xs font-medium text-slate-200 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Coppermind Wiki
                </motion.a>
              )}

              {/* Goodreads Link */}
              {book.links.goodreads && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={book.links.goodreads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 rounded-xl text-xs font-medium text-slate-200 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 text-emerald-400" />
                  Goodreads
                </motion.a>
              )}

              {/* Amazon Store Link */}
              {book.links.amazon && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={getAffiliateUrl(book.links.amazon)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-orange-500/50 hover:bg-slate-800/80 rounded-xl text-xs font-medium text-slate-200 transition-colorscol-span-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-orange-400" />
                  Amazon Store
                </motion.a>
              )}

              {/* Audible Audiobook Link */}
              {book.links.audible && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={getAffiliateUrl(book.links.audible)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 rounded-xl text-xs font-medium text-slate-200 transition-colors"
                >
                  <Headset className="w-3.5 h-3.5 text-indigo-400" />
                  Audible Narration
                </motion.a>
              )}
            </div>
          </div>

          {!book.isReleased && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5 text-xs text-amber-200/90 flex gap-1.5 items-start mt-2">
              <span className="font-bold">⚠️</span>
              <span>
                <strong>Future release indicator:</strong> This is a forthcoming / unreleased "ghostbook". Release dates are tentative and may be modified.
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
