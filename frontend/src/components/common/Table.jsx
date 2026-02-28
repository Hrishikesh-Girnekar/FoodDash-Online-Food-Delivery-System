import { motion } from 'framer-motion'
import EmptyState from './EmptyState'
import { TableSkeleton } from './Skeleton'

/**
 * columns: [{ key, label, render?, className? }]
 * rows:    array of objects
 */
export default function Table({
  columns = [],
  rows    = [],
  loading = false,
  emptyTitle   = 'No data',
  emptyMessage = 'Nothing to show here yet.',
  onRowClick,
  className = '',
}) {
  if (loading) return <TableSkeleton rows={5} cols={columns.length} />

  return (
    <div className={`overflow-hidden rounded-2xl border border-stone-100 dark:border-stone-800 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-800/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide
                    text-stone-500 dark:text-stone-400
                    ${col.className || ''}
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} message={emptyMessage} compact />
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    bg-white dark:bg-stone-900
                    hover:bg-stone-50 dark:hover:bg-stone-800/60
                    transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-stone-700 dark:text-stone-300 ${col.className || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
