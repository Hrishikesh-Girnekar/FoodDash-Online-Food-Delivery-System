import { motion } from 'framer-motion'

export default function EmptyState({
  icon    = '🍽️',
  title   = 'Nothing here',
  message = '',
  action,
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8' : 'py-20'}`}
    >
      {!compact && (
        <motion.span
          className="text-6xl mb-4 block"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          {icon}
        </motion.span>
      )}
      <h3 className="font-display font-semibold text-stone-700 dark:text-stone-300 text-lg">
        {title}
      </h3>
      {message && (
        <p className="text-stone-400 text-sm mt-1 max-w-xs">{message}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
