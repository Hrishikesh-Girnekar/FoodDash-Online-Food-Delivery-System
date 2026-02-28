import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function OrderSuccess() {
  const location = useLocation()
  const orderId  = location.state?.orderId || 'FD' + Date.now()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {/* Success animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Inner circle */}
          <div className="absolute inset-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <motion.svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-white"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            </motion.svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-display font-extrabold text-3xl text-stone-800 dark:text-stone-100">
            Order placed! 🎉
          </h1>
          <p className="text-stone-400 mt-3 leading-relaxed">
            Your order <span className="font-semibold text-stone-700 dark:text-stone-300">#{orderId}</span> has been
            received and is being prepared.
          </p>

          {/* Tracking steps */}
          <div className="mt-8 space-y-3 text-left">
            {[
              { label: 'Order confirmed',    done: true,  icon: '✅' },
              { label: 'Restaurant preparing', done: true,  icon: '👨‍🍳' },
              { label: 'Out for delivery',   done: false, icon: '🛵' },
              { label: 'Delivered',          done: false, icon: '🏠' },
            ].map(({ label, done, icon }, i) => (
              <motion.div
                key={label}
                className={`flex items-center gap-3 p-3 rounded-xl
                  ${done ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-stone-50 dark:bg-stone-800'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <span className="text-xl">{icon}</span>
                <span className={`text-sm font-medium ${done ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`}>
                  {label}
                </span>
                {done && <span className="ml-auto text-xs text-emerald-500 font-semibold">Done</span>}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <Link to="/customer/orders" className="flex-1 btn-primary text-center">
              Track Order
            </Link>
            <Link to="/restaurants" className="flex-1 btn-secondary text-center">
              Order More
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
