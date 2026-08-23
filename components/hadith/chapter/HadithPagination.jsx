import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HadithPagination({ page, totalPages, goPage }) {
  const BASE_PAGINATION_CLASS =
    "p-2 glass rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-accent/30! transition-colors cursor-pointer";

  return (
    totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 mt-10">
        <button
          onClick={() => goPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className={BASE_PAGINATION_CLASS}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => {
            const isCurrent = i === page;
            const isNear = Math.abs(i - page) <= 2;
            const isEdge = i === 0 || i === totalPages - 1;

            if (!isNear && !isEdge) {
              if (i === page - 3 || i === page + 3) {
                return (
                  <span key={i} className="text-text-secondary text-xs px-1">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={i}
                onClick={() => goPage(i)}
                className={`size-8 rounded-lg text-xs font-jakarta font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-accent text-white shadow-lg shadow-accent/30"
                    : "glass text-text-secondary hover:text-accent hover:border-accent/30!"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => goPage(Math.min(totalPages - 1, page + 1))}
          disabled={page === totalPages - 1}
          className={BASE_PAGINATION_CLASS}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    )
  );
}
