import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiHeart, HiClock, HiStar } from 'react-icons/hi'
import { formatCurrency } from '../../utils/helpers'
import { useWishlist } from '../../hooks/useWishlist'

export default function RestaurantCard({ restaurant }) {
  const { isWishlisted, toggle } = useWishlist()
  const wishlisted = isWishlisted(restaurant.id)
  const deliveryTime = "30-40 min"

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/restaurants/${restaurant.id}`} className="block group">
        <div className="card overflow-hidden hover:shadow-hover transition-shadow duration-300">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
              alt={restaurant.name}
              className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Wishlist button */}
            <button
              onClick={(e) => { e.preventDefault(); toggle(restaurant) }}
              className="absolute top-3 right-3 p-2 rounded-xl glass shadow-sm transition-transform hover:scale-110"
            >
              <HiHeart
                className={`w-5 h-5 transition-colors ${
                  wishlisted ? 'text-red-500 fill-red-500' : 'text-white'
                }`}
              />
            </button>

            {/* Open/Closed badge */}
            <div className={`
              absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold
              ${restaurant.isOpen
                ? 'bg-emerald-500 text-white'
                : 'bg-stone-800/80 text-stone-300'
              }
            `}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </div>

            {/* Discount badge */}
            {restaurant.discount && (
              <div className="absolute top-3 left-3 badge-brand text-xs font-bold px-2 py-1 rounded-lg">
                {restaurant.discount}% OFF
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-stone-800 dark:text-stone-100 text-base truncate">
              {restaurant.name}
            </h3>
            <p className="text-sm text-stone-500 mt-0.5">{restaurant.cuisine}</p>

            <div className="flex items-center gap-3 mt-3 text-sm text-stone-600 dark:text-stone-400">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-0.5 bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                  <HiStar className="w-3 h-3" />
                  {restaurant.rating}
                </span>
                {restaurant.totalReviews && (
                  <span className="text-xs text-stone-400">
                    ({(restaurant.totalReviews / 1000).toFixed(1)}k+)
                  </span>
                )}
              </div>

              <span className="text-stone-200 dark:text-stone-700">·</span>

              {/* Delivery time */}
              <div className="flex items-center gap-1">
                <HiClock className="w-3.5 h-3.5" />
                <span className="text-xs">{restaurant.deliveryTime}</span>
              </div>

              <span className="text-stone-200 dark:text-stone-700">·</span>

              {/* Cost */}
              <span className="text-xs">
                {formatCurrency(restaurant.costForTwo)} for two
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
