import { motion } from "motion/react";
import { Book, UserBookStatus } from "../types";
import { CheckCircle, Bookmark } from "lucide-react";

interface BookNodeProps {
  key?: string | number;
  book: Book;
  isSelected: boolean;
  readingOrderEnabled: boolean;
  userStatus?: UserBookStatus;
  onClick: () => void;
}

export default function BookNode({
  book,
  isSelected,
  readingOrderEnabled,
  userStatus,
  onClick
}: BookNodeProps) {
  // Simple flat color mapping from requested palette
  // #C0E1D2 (mint) #E5EEE4 (sage) #F6F4E8 (cream) #DC9B9B (coral)
  
  const baseBgClass = book.isReleased ? "bg-[#E5EEE4]" : "bg-[#F6F4E8]/60";
  const borderStyle = book.isReleased ? "border-solid" : "border-dashed";
  
  // Highlight selected nodes in rose/coral #DC9B9B, others in responsive light tints
  let finalBgClass = isSelected 
    ? "bg-[#DC9B9B] border-[#2A3439]" 
    : `${baseBgClass} border-[#C0E1D2] hover:border-[#DC9B9B]`;

  if (!isSelected && userStatus === 'read') {
    finalBgClass = "bg-[#C0E1D2] border-[#2A3439]/40 hover:border-[#DC9B9B]";
  } else if (!isSelected && userStatus === 'tbr') {
    finalBgClass = "bg-[#2A3439] border-[#2A3439] hover:border-[#2A3439]/80";
  }

  const titleColorClass = (!isSelected && userStatus === 'tbr') ? "text-[#E5EEE4]" : "text-[#2A3439]";
  const metaColorClass = (!isSelected && userStatus === 'tbr') ? "text-slate-300" : "text-slate-600";

  return (
    <motion.div
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative flex-shrink-0 w-36 h-36 rounded-full border-2 ${borderStyle} flex flex-col justify-center items-center text-center p-4 cursor-pointer select-none ${finalBgClass} ${
        !book.isReleased ? "opacity-75" : ""
      } ${
        isSelected 
          ? "shadow-[4px_4px_0px_0px_#2A3439] z-20 scale-[1.05]" 
          : "shadow-sm"
      }`}
    >
      {/* User Status Badge */}
      {userStatus === 'read' && (
        <div className="absolute top-1 left-2 bg-[#E5EEE4] text-[#2A3439] border border-[#2A3439] rounded-full p-0.5 shadow-sm z-10">
          <CheckCircle className="w-4 h-4" />
        </div>
      )}
      {userStatus === 'tbr' && (
        <div className="absolute top-1 left-2 bg-[#E5EEE4] text-[#2A3439] border border-[#2A3439] rounded-full p-0.5 shadow-sm z-10">
          <Bookmark className="w-4 h-4" fill="#2A3439" />
        </div>
      )}

      {/* Recommended Reading Order mini-badge */}
      {readingOrderEnabled && book.recommendedOrderSeq && (
        <div className="absolute -top-1 -right-1 bg-[#DC9B9B] text-[#2A3439] border-2 border-[#2A3439] rounded-full w-6 h-6 flex items-center justify-center font-mono font-bold text-[10px] shadow-sm">
          {book.recommendedOrderSeq}
        </div>
      )}

      {/* Title */}
      <h4 className={`font-display font-bold text-[11px] leading-tight tracking-tight px-1 line-clamp-3 ${titleColorClass}`}>
        {book.title}
      </h4>

      {/* Series Indicator */}
      <div className="mt-1 text-[8.5px] font-mono leading-none flex flex-col items-center">
        <span className={`italic font-medium truncate max-w-[100px] ${metaColorClass}`}>
          {book.series}
        </span>
        {book.goodreadsRating && (
          <span className="text-[9px] font-semibold text-[#2A3439]/90 flex items-center gap-0.5 mt-0.5">
            ★ {book.goodreadsRating}
          </span>
        )}
      </div>

      {/* Small indicator that there's a connection / click for details if unselected */}
      {!isSelected && (
        <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#DC9B9B]/60" />
      )}
    </motion.div>
  );
}
