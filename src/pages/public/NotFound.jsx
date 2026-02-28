import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient dark:bg-none dark:bg-surface-dark">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-8xl mb-6"
        >
          🍕
        </motion.div>
        <h1 className="font-display font-extrabold text-8xl text-brand-500">404</h1>
        <h2 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100 mt-4">
          Page not found
        </h2>
        <p className="text-stone-400 mt-3 max-w-sm mx-auto">
          Looks like this page was eaten! Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link to="/"            className="btn-primary">Go Home</Link>
          <Link to="/restaurants" className="btn-secondary">Browse Restaurants</Link>
        </div>
      </div>
    </div>
  )
}
