import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBell, HiCheck } from 'react-icons/hi'
import { useNotifications } from '../../context/NotificationContext'

const TYPE_ICONS = {
  order:    '🛍️',
  delivery: '🛵',
  review:   '⭐',
  promo:    '🎉',
  default:  '🔔',
}

export default function NotificationDropdown() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-stone-500 hover:bg-stone-100
                   dark:hover:bg-stone-800 dark:text-stone-400 transition-colors"
      >
        <HiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-500 rounded-full
                           ring-2 ring-white dark:ring-stone-900 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-80 card shadow-hover z-50 overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0,   y: -8,  scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800">
              <span className="font-semibold font-display text-stone-800 dark:text-stone-100">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 badge badge-brand text-xs">{unreadCount}</span>
                )}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-medium"
                >
                  <HiCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-stone-50 dark:divide-stone-800">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-stone-400 text-sm">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`
                      px-4 py-3 flex gap-3 cursor-pointer
                      hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors
                      ${!n.read ? 'bg-brand-50/60 dark:bg-brand-900/10' : ''}
                    `}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {TYPE_ICONS[n.type] || TYPE_ICONS.default}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-100 truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-xs text-stone-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
