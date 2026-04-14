import { motion } from 'framer-motion'
import { useWishlist } from '../../hooks/useWishlist'
import RestaurantCard from '../../components/restaurant/RestaurantCard'
import EmptyState from '../../components/common/EmptyState'
import { Link } from 'react-router-dom'

export default function Wishlist() {
  const { wishlist } = useWishlist()

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          Wishlist ❤️
        </h1>
        <p className="text-stone-400 text-sm mt-1">{wishlist.length} saved restaurants</p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon="💔"
          title="Nothing saved yet"
          message="Tap the heart icon on any restaurant to save it here."
          action={
            <Link to="/restaurants" className="btn-primary">
              Browse Restaurants
            </Link>
          }
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {wishlist.map((r) => (
            <motion.div
              key={r.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <RestaurantCard restaurant={r} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
