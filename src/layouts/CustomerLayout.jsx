import { Outlet } from 'react-router-dom'
import {
  HiHome, HiShoppingBag, HiUser, HiHeart,
  HiShoppingCart, HiClipboardList,
} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import NotificationDropdown from '../components/common/NotificationDropdown'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import CartDrawer from '../components/cart/CartDrawer'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'Home',         to: '/customer',          icon: HiHome,         exact: true },
  { label: 'Restaurants',  to: '/restaurants',       icon: HiShoppingBag              },
  { label: 'My Orders',    to: '/customer/orders',   icon: HiClipboardList            },
  { label: 'Wishlist',     to: '/customer/wishlist', icon: HiHeart                    },
  { label: 'Profile',      to: '/customer/profile',  icon: HiUser                     },
]

const BOTTOM_NAV = [
  { label: 'Home',    to: '/customer',          icon: HiHome      },
  { label: 'Explore', to: '/restaurants',       icon: HiShoppingBag },
  { label: 'Orders',  to: '/customer/orders',   icon: HiClipboardList },
  { label: 'Wishlist',to: '/customer/wishlist', icon: HiHeart     },
  { label: 'Profile', to: '/customer/profile',  icon: HiUser      },
]

export default function CustomerLayout() {
  const { totalItems } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar links={LINKS} title="Customer" icon="🧑‍🍳" />

      <div className="flex-1 flex flex-col min-w-0 md:ml-0 mt-14 md:mt-0">
        {/* Top bar */}
        <header className="hidden md:flex items-center justify-end gap-3 px-8 py-4
                           bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm
                           border-b border-stone-100 dark:border-stone-800 sticky top-0 z-20">
          <NotificationDropdown />
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-xl text-stone-500 hover:bg-stone-100
                       dark:hover:bg-stone-800 dark:text-stone-400 transition-colors"
          >
            <HiShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white
                           text-xs font-bold rounded-full flex items-center justify-center"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </motion.span>
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-stone-900
                      border-t border-stone-100 dark:border-stone-800 flex">
        {BOTTOM_NAV.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs
                          transition-colors
                          ${active ? 'text-brand-500' : 'text-stone-400 dark:text-stone-500'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 h-0.5 w-12 bg-brand-500 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
