import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiShoppingBag, HiHeart, HiClipboardList } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import RestaurantCard from '../../components/restaurant/RestaurantCard'
import { SAMPLE_RESTAURANTS } from '../../utils/constants'

const QUICK_LINKS = [
  { label: 'Browse Restaurants', to: '/restaurants',       icon: HiShoppingBag,  color: 'bg-brand-50 dark:bg-brand-900/20  text-brand-600' },
  { label: 'My Orders',          to: '/customer/orders',   icon: HiClipboardList, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
  { label: 'Wishlist',           to: '/customer/wishlist', icon: HiHeart,         color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600' },
]

export default function CustomerDashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 page-enter">
      {/* Welcome */}
      <motion.div
        className="rounded-3xl bg-gradient-to-r from-brand-500 to-orange-400 p-8 text-white shadow-brand"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-orange-100 text-sm font-medium">{greeting} 👋</p>
        <h1 className="font-display font-extrabold text-3xl mt-1">
          {user?.name?.split(' ')[0] || 'Foodie'}!
        </h1>
        <p className="text-orange-100 mt-2">What would you like to eat today?</p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 mt-5 bg-white text-brand-600 font-semibold
                     px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm"
        >
          Order now <HiArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ label, to, icon: Icon, color }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Link to={to} className={`card p-5 flex flex-col items-center gap-3 text-center hover:shadow-hover transition-shadow ${color}`}>
              <Icon className="w-8 h-8" />
              <span className="font-medium text-sm">{label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent / Recommended restaurants */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-stone-800 dark:text-stone-100">
            Recommended for you
          </h2>
          <Link to="/restaurants" className="text-sm text-brand-500 flex items-center gap-1 font-medium">
            See all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_RESTAURANTS.slice(0, 3).map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* Recent orders teaser */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-stone-800 dark:text-stone-100">Recent Orders</h2>
          <Link to="/customer/orders" className="text-sm text-brand-500 font-medium">View all</Link>
        </div>
        <div className="text-center py-8 text-stone-400">
          <HiClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No orders yet. Start exploring!</p>
        </div>
      </section>
    </div>
  )
}
