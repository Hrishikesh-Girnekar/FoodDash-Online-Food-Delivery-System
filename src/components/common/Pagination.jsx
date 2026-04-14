import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function Pagination({ currentPage, totalPages, pageNumbers, goTo, next, prev }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={prev}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {pageNumbers.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 text-stone-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`
              w-9 h-9 rounded-lg text-sm font-medium transition-all
              ${currentPage === p
                ? 'bg-brand-500 text-white shadow-brand'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }
            `}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={next}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
