export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
      {...props}
    />
  )
}

export function RestaurantCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="w-full h-44" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export function MenuItemSkeleton() {
  return (
    <div className="card p-4 flex gap-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
