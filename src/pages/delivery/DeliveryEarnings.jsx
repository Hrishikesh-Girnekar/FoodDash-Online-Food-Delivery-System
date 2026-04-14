import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/helpers'
import { StatCardSkeleton } from '../../components/common/Skeleton'

const WEEKLY_DATA = [
  { day: 'Mon', earnings: 420, deliveries: 5 },
  { day: 'Tue', earnings: 630, deliveries: 7 },
  { day: 'Wed', earnings: 375, deliveries: 4 },
  { day: 'Thu', earnings: 840, deliveries: 9 },
  { day: 'Fri', earnings: 1050, deliveries: 11 },
  { day: 'Sat', earnings: 1260, deliveries: 14 },
  { day: 'Sun', earnings: 980, deliveries: 10 },
]

export default function DeliveryEarnings() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  const totalWeek    = WEEKLY_DATA.reduce((s, d) => s + d.earnings, 0)
  const totalDeliveries = WEEKLY_DATA.reduce((s, d) => s + d.deliveries, 0)
  const avgPerDelivery  = Math.round(totalWeek / totalDeliveries)

  return (
    <div className="space-y-8 page-enter">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">Earnings</h1>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'This Week', value: formatCurrency(totalWeek), icon: '💰' },
            { label: 'Deliveries', value: totalDeliveries, icon: '🛵' },
            { label: 'Avg Per Trip', value: formatCurrency(avgPerDelivery), icon: '📊' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card p-6">
              <span className="text-3xl block mb-3">{icon}</span>
              <p className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">{value}</p>
              <p className="text-stone-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-6 text-stone-800 dark:text-stone-100">
          This Week's Earnings
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={WEEKLY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="earnings" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payout history */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-4 text-stone-800 dark:text-stone-100">
          Daily Breakdown
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {WEEKLY_DATA.map((d) => (
            <div key={d.day} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-stone-800 dark:text-stone-100 text-sm">{d.day}</p>
                <p className="text-xs text-stone-400">{d.deliveries} deliveries</p>
              </div>
              <p className="font-bold text-emerald-600">{formatCurrency(d.earnings)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
