export default function Spinner({ size = 'md', color = 'brand', fullScreen = false }) {
  const sizeMap = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  const colorMap = {
    brand:   'border-brand-200 border-t-brand-500',
    white:   'border-white/20 border-t-white',
    gray:    'border-stone-200 border-t-stone-500',
    current: 'border-current/20 border-t-current',
  }

  const spinner = (
    <div
      className={`
        rounded-full animate-spin
        ${sizeMap[size] || sizeMap.md}
        ${colorMap[color] || colorMap.brand}
      `}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin border-4 border-brand-200 border-t-brand-500" />
          <p className="text-sm font-medium text-stone-500">Loading…</p>
        </div>
      </div>
    )
  }

  return spinner
}
