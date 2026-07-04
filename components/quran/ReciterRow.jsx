"use client";

import { Star } from "lucide-react";

export default function ReciterRow({
  reciter,
  isSelected,
  isFavourite,
  onSelect,
  onToggleFavourite,
}) {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 mx-1 rounded-xl cursor-pointer transition-all duration-150 ${
        isSelected
          ? "bg-accent/20 text-accent"
          : "hover:bg-white/5 text-text-secondary hover:text-text-primary"
      }`}
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(reciter)}
    >
      {/* Active indicator dot */}
      <span
        className={`size-1.5 rounded-full shrink-0 transition-all ${
          isSelected ? "bg-accent" : "bg-transparent group-hover:bg-white/20"
        }`}
      />

      {/* Names */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-medium truncate leading-tight ${
            isSelected ? "text-accent" : "text-text-primary"
          }`}
        >
          {reciter.name}
        </p>
        <p
          className="text-[10px] text-text-secondary/70 truncate leading-tight"
          dir="rtl"
        >
          {reciter.nameArabic}
        </p>
      </div>

      {/* Favourite star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite(reciter.id);
        }}
        aria-label={
          isFavourite ? "Remove from favourites" : "Add to favourites"
        }
        className={`shrink-0 p-1 rounded-lg transition-all duration-150 ${
          isFavourite
            ? "text-amber-400 hover:text-amber-300"
            : "text-transparent group-hover:text-text-secondary/40 hover:text-amber-400!"
        } cursor-pointer`}
      >
        <Star size={12} fill={isFavourite ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
