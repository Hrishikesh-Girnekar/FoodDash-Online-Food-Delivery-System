import { motion } from 'framer-motion'
import { HiPlusSm, HiMinusSm } from 'react-icons/hi'
import { formatCurrency } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'

export default function MenuItemCard({ item, restaurantId, restaurantName }) {
  const { addItem, increaseQty, decreaseQty, getItemQty } = useCart()
  const qty = getItemQty(item.id)

  return (
    <motion.div
      className="card p-4 flex gap-4 group"
      whileHover={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Veg / Non-veg indicator */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`
            w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0
            ${item.isVeg
              ? 'border-emerald-500'
              : 'border-red-500'
            }
          `}>
            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </span>
          {item.isBestseller && (
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
              🔥 Bestseller
            </span>
          )}
        </div>

        <h4 className="font-semibold text-stone-800 dark:text-stone-100 text-sm leading-tight">
          {item.name}
        </h4>
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 mt-1">
          {formatCurrency(item.price)}
        </p>
        <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Image + Add button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {qty === 0 ? (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => addItem(item, restaurantId, restaurantName)}
            disabled={!item.available}
            className="
              text-brand-600 border-2 border-brand-500 font-bold text-sm
              px-4 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20
              transition-colors disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {item.available ? 'ADD' : 'Unavailable'}
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 border-2 border-brand-500 rounded-lg overflow-hidden">
            <button
              onClick={() => decreaseQty(item.id)}
              className="px-2 py-1 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            >
              <HiMinusSm className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-brand-600">{qty}</span>
            <button
              onClick={() => addItem(item, restaurantId, restaurantName)}
              className="px-2 py-1 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            >
              <HiPlusSm className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
