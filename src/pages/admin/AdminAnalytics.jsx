import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '../../utils/helpers'

const MONTHLY = [
  { month: 'Jul', revenue: 310000, orders: 1020, users: 240 },
  { month: 'Aug', revenue: 380000, orders: 1240, users: 310 },
  { month: 'Sep', revenue: 420000, orders: 1380, users: 285 },
  { month: 'Oct', revenue: 510000, orders: 1650, users: 420 },
  { month: 'Nov', revenue: 630000, orders: 2100, users: 560 },
  { month: 'Dec', revenue: 780000, orders: 2560, users: 680 },
]

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">Analytics</h1>
        <p className="text-stone-400 text-sm mt-1">Platform performance overview</p>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-6 text-stone-800 dark:text-stone-100">
          Revenue & Orders (6 months)
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={MONTHLY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left"  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v, n) => n === 'revenue' ? formatCurrency(v) : v} />
            <Legend />
            <Line yAxisId="left"  type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="orders"  stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-6 text-stone-800 dark:text-stone-100">
          New Users per Month
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="users" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
