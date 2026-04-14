import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiX, HiTrash } from 'react-icons/hi'
import { HiPlusSm, HiMinusSm } from 'react-icons/hi'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/helpers'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'

export default function CartDrawer({ open, onClose }) {
  const {
    items, restaurantName,
    subtotal, deliveryFee, taxes, total,
    increaseQty, decreaseQty, removeItem, clearCart,
  } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-stone-900 z-50
                       shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="font-display font-bold text-lg text-stone-800 dark:text-stone-100">
                  Your Cart
                </h2>
                {restaurantName && (
                  <p className="text-xs text-stone-400 mt-0.5">{restaurantName}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <HiTrash className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <HiX className="w-5 h-5 text-stone-500" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <EmptyState
                  icon="🛒"
                  title="Cart is empty"
                  message="Add items from a restaurant to get started"
                />
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-stone-800 dark:text-stone-100 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-brand-600 font-semibold mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-brand-400 rounded-lg overflow-hidden">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="px-2 py-1.5 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                          >
                            <HiMinusSm className="w-3.5 h-3.5 text-brand-600" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-brand-600">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="px-2 py-1.5 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                          >
                            <HiPlusSm className="w-3.5 h-3.5 text-brand-600" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)}>
                          <HiTrash className="w-4 h-4 text-stone-300 hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Summary + Checkout */}
            {items.length > 0 && (
              <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Delivery fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Taxes (5%)</span>
                    <span>{formatCurrency(taxes)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-800 dark:text-stone-100 pt-2
                                  border-t border-stone-100 dark:border-stone-800">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link to="/customer/checkout" onClick={onClose}>
                  <Button className="w-full">
                    Proceed to Checkout · {formatCurrency(total)}
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
