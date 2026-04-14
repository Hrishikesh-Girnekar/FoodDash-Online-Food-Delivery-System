import { HiStar } from 'react-icons/hi'

export default function RatingStars({ rating = 0, size = 'sm', showCount, count = 0 }) {
  const sizeMap = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const iconSize = sizeMap[size] || sizeMap.sm

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <HiStar
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating) ? 'text-amber-400' : 'text-stone-200 dark:text-stone-700'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">{rating}</span>
      {showCount && count > 0 && (
        <span className="text-xs text-stone-400">({count.toLocaleString()})</span>
      )}
    </div>
  )
}

/* Interactive star picker for reviews */
export function StarPicker({ value = 0, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-125"
        >
          <HiStar
            className={`w-8 h-8 ${star <= value ? 'text-amber-400' : 'text-stone-300 dark:text-stone-600'}`}
          />
        </button>
      ))}
    </div>
  )
}
