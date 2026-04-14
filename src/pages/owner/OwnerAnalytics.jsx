import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '../../utils/helpers'

const DATA = [
  { month: 'Jul', revenue: 120000, orders: 420 },
  { month: 'Aug', revenue: 180000, orders: 600 },
  { month: 'Sep', revenue: 220000, orders: 750 },
  { month: 'Oct', revenue: 310000, orders: 980 },
  { month: 'Nov', revenue: 410000, orders: 1300 },
  { month: 'Dec', revenue: 520000, orders: 1650 },
]

export default function OwnerAnalytics() {
  return (
    <div className="space-y-8 page-enter">

      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          Restaurant Analytics
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Track your restaurant performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card p-5">
          <p className="text-sm text-stone-400">Total Revenue</p>
          <h2 className="text-xl font-bold text-orange-500 mt-2">
            ₹5.2L
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-stone-400">Total Orders</p>
          <h2 className="text-xl font-bold text-blue-500 mt-2">
            5,700+
          </h2>
        </div>

        <div className="card p-5">
          <p className="text-sm text-stone-400">Avg Order Value</p>
          <h2 className="text-xl font-bold text-green-500 mt-2">
            ₹310
          </h2>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-6 text-stone-800 dark:text-stone-100">
          Revenue & Orders (6 months)
        </h2>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />

            <Tooltip
              formatter={(v, n) => n === 'revenue' ? formatCurrency(v) : v}
            />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Bar Chart */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg mb-6 text-stone-800 dark:text-stone-100">
          Monthly Orders
        </h2>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />

            <Bar
              dataKey="orders"
              fill="#f97316"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}