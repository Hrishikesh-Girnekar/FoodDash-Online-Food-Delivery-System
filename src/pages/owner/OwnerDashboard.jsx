import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiShoppingCart, HiCurrencyRupee, HiStar, HiTrendingUp } from 'react-icons/hi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCardSkeleton } from '../../components/common/Skeleton'
import { formatCurrency } from '../../utils/helpers'
import { Link } from 'react-router-dom'

const DAILY_REVENUE = [
  { day: 'Mon', revenue: 12500 },
  { day: 'Tue', revenue: 18200 },
  { day: 'Wed', revenue: 14800 },
  { day: 'Thu', revenue: 22400 },
  { day: 'Fri', revenue: 28900 },
  { day: 'Sat', revenue: 35600 },
  { day: 'Sun', revenue: 31200 },
]

const RECENT_ORDERS = [
  { id: 2001, customer: 'Rahul M.', items: 'Butter Chicken, Naan x2', status: 'PREPARING',  amount: 499 },
  { id: 2002, customer: 'Priya S.', items: 'Paneer Tikka',            status: 'CONFIRMED',  amount: 279 },
  { id: 2003, customer: 'Vikram K.',items: 'Dal Makhani, Jeera Rice', status: 'DELIVERED',  amount: 398 },
]

const STATUS_COLOR = {
  CONFIRMED:  'badge-info',
  PREPARING:  'badge-brand',
  DELIVERED:  'badge-success',
  CANCELLED:  'badge-error',
}

export default function OwnerDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({ todayOrders: 42, todayRevenue: 18750, avgRating: 4.6, totalOrders: 1240 })
      setLoading(false)
    }, 700)
  }, [])

  const STAT_CARDS = stats ? [
    { label: "Today's Orders",   value: stats.todayOrders,                      icon: HiShoppingCart,   color: 'text-blue-500   bg-blue-50 dark:bg-blue-900/20'    },
    { label: "Today's Revenue",  value: formatCurrency(stats.todayRevenue),     icon: HiCurrencyRupee,  color: 'text-brand-500  bg-brand-50 dark:bg-brand-900/20'   },
    { label: 'Average Rating',   value: `${stats.avgRating} ★`,                 icon: HiStar,           color: 'text-amber-500  bg-amber-50 dark:bg-amber-900/20'   },
    { label: 'Total Orders',     value: stats.totalOrders.toLocaleString(),     icon: HiTrendingUp,     color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  ] : []

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">Restaurant Dashboard</h1>
        <p className="text-stone-400 text-sm mt-1">Manage your restaurant, menu, and orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STAT_CARDS.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                className="card p-6"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              >
                <div className={`inline-flex p-2.5 rounded-xl mb-4 ${color.split(' ').slice(1).join(' ')}`}>
                  <Icon className={`w-6 h-6 ${color.split(' ')[0]}`} />
                </div>
                <p className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">{value}</p>
                <p className="text-stone-400 text-sm mt-1">{label}</p>
              </motion.div>
            ))
        }
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-6 text-stone-800 dark:text-stone-100">
          Revenue This Week
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DAILY_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-100">Recent Orders</h2>
          <Link to="/owner/orders" className="text-sm text-brand-500 font-medium">View all</Link>
        </div>
        <div className="space-y-3">
          {RECENT_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800">
              <div className="flex-1">
                <p className="font-semibold text-sm text-stone-800 dark:text-stone-100">{order.customer}</p>
                <p className="text-xs text-stone-400 mt-0.5 truncate">{order.items}</p>
              </div>
              <span className={`badge ${STATUS_COLOR[order.status]} text-xs`}>{order.status}</span>
              <span className="font-bold text-sm text-stone-700 dark:text-stone-300">
                {formatCurrency(order.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
