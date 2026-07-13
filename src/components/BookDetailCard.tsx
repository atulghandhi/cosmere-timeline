import { motion } from 'motion/react';
import { Star, BookOpen, X, Info, CheckCircle, Bookmark, ShoppingCart, Headphones, LucideIcon } from 'lucide-react';
import { Book, UserBookStatus } from '../types';
import { getAffiliateUrl } from '../utils/affiliate';

interface BookDetailCardProps {
  book: Book;
  userStatus?: UserBookStatus;
  onStatusChange: (status: UserBookStatus) => void;
  onClose: () => void;
}

interface ExternalLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

function getExternalLinks(book: Book): ExternalLink[] {
  const links: ExternalLink[] = [];
  if (book.links.coppermind) {
    links.push({ href: book.links.coppermind, label: 'Coppermind Wiki', icon: BookOpen });
  }
  if (book.links.goodreads) {
    links.push({ href: book.links.goodreads, label: 'Goodreads', icon: Star });
  }
  if (book.links.amazon) {
    links.push({ href: getAffiliateUrl(book.links.amazon), label: 'Amazon', icon: ShoppingCart });
  }
  if (book.links.audible) {
    links.push({ href: getAffiliateUrl(book.links.audible), label: 'Audible', icon: Headphones });
  }
  return links;
}

export default function BookDetailCard({ book, userStatus, onStatusChange, onClose }: BookDetailCardProps) {
  const externalLinks = getExternalLinks(book);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, x: -12 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.92, x: -12 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
      className="flex-1 min-w-0 md:flex-none md:w-[380px] max-h-[420px] border-2 border-mint dark:border-mint/40 rounded-2xl bg-cream dark:bg-night shadow-flat-soft dark:shadow-flat-soft-dark flex flex-col overflow-hidden relative z-30"
    >
      <div className="bg-sage dark:bg-abyss border-b border-mint dark:border-mint/30 px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-mint dark:bg-mint/25 text-ink dark:text-mint whitespace-nowrap">
            {book.cosmere ? 'Cosmere Universe' : 'Standalone / Other'}
          </span>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
            {book.tbd ? 'TBD' : book.year}
          </span>
          {book.lengthType && (
            <span className="hidden min-[380px]:inline text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-cream dark:bg-night border border-mint/60 dark:border-mint/30 text-slate-600 dark:text-slate-400 whitespace-nowrap">
              {book.lengthType}
            </span>
          )}
        </div>

        <motion.button
          type="button"
          aria-label="Close details"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-1 rounded-md text-ink dark:text-sage hover:bg-coral/30 transition-colors cursor-pointer flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex-grow p-3 md:p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
        <div>
          <h3 className="font-display font-bold text-base md:text-lg text-ink dark:text-cream tracking-tight leading-tight">
            {book.title}
          </h3>
          {book.seriesNumber != null && (
            <p className="text-[10.5px] font-mono font-medium text-slate-600 dark:text-slate-400 mt-0.5">
              {book.series} #{book.seriesNumber}
              {book.subSeries && <span className="text-slate-500"> ({book.subSeries})</span>}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 py-1 px-2.5 bg-sage/55 dark:bg-abyss/70 rounded-lg border border-mint/50 dark:border-mint/25 self-start">
          <Star className="w-3.5 h-3.5 text-ink dark:text-sage fill-coral" />
          <span className="text-[11px] font-mono font-bold text-ink dark:text-sage">
            {book.goodreadsRating != null
              ? `${book.goodreadsRating} / 5.0`
              : book.isReleased
                ? 'Not yet rated'
                : 'Forthcoming'}
          </span>
          {book.goodreadsRating != null && (
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">(Goodreads average)</span>
          )}
        </div>

        <div className="flex gap-2 my-1">
          <button
            type="button"
            onClick={() => onStatusChange(userStatus === 'read' ? null : 'read')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-colors border-2 cursor-pointer ${
              userStatus === 'read'
                ? 'bg-coral border-coral text-ink'
                : 'bg-cream dark:bg-night border-mint dark:border-mint/40 text-slate-600 dark:text-slate-300 hover:border-coral dark:hover:border-coral'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {userStatus === 'read' ? 'Read' : 'Mark as Read'}
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(userStatus === 'tbr' ? null : 'tbr')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-colors border-2 cursor-pointer ${
              userStatus === 'tbr'
                ? 'bg-ink dark:bg-sage border-ink dark:border-sage text-sage dark:text-ink'
                : 'bg-cream dark:bg-night border-mint dark:border-mint/40 text-slate-600 dark:text-slate-300 hover:border-ink dark:hover:border-sage'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {userStatus === 'tbr' ? 'On TBR' : 'Add to TBR'}
          </button>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{book.description}</p>

        {!book.isReleased && (
          <div className="bg-coral/15 border border-coral/40 rounded-lg p-2 text-[10px] text-ink/90 dark:text-sage/90 flex gap-1.5 items-start">
            <span className="font-bold" aria-hidden>⚠️</span>
            <span>
              {book.tbd
                ? 'Announced but unscheduled — the position on the timeline is only a rough estimate.'
                : 'Upcoming release — dates and details are preliminary and may change.'}
            </span>
          </div>
        )}

        {externalLinks.length > 0 && (
          <div className="mt-auto pt-2 border-t border-mint/30 dark:border-mint/20 flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Info className="w-2.5 h-2.5 text-ink/60 dark:text-sage/60" /> Links & where to read
            </span>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-2 gap-1.5">
              {externalLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 bg-sage dark:bg-abyss border border-mint dark:border-mint/30 hover:bg-mint/40 dark:hover:bg-mint/15 rounded-lg text-[10px] font-medium text-ink dark:text-sage transition-colors"
                >
                  <Icon className="w-3 h-3 text-ink dark:text-sage" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
