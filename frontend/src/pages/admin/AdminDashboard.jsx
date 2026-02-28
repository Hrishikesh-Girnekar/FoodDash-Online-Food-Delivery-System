import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiUsers,
  HiOfficeBuilding,
  HiShoppingCart,
  HiCurrencyRupee,
  HiTrendingUp,
  HiClock,
} from "react-icons/hi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCardSkeleton } from "../../components/common/Skeleton";
import { formatCurrency } from "../../utils/helpers";
import { adminApi } from "../../api/admin.api";
import toast from "react-hot-toast";

const STAT_COLORS = [
  {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-500",
    ring: "ring-blue-100 dark:ring-blue-900/30",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "text-emerald-500",
    ring: "ring-emerald-100",
  },
  {
    bg: "bg-brand-50 dark:bg-brand-900/20",
    icon: "text-brand-500",
    ring: "ring-brand-100",
  },
  {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-500",
    ring: "ring-purple-100",
  },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 125000, orders: 420 },
  { month: "Feb", revenue: 148000, orders: 510 },
  { month: "Mar", revenue: 162000, orders: 560 },
  { month: "Apr", revenue: 155000, orders: 530 },
  { month: "May", revenue: 190000, orders: 650 },
  { month: "Jun", revenue: 210000, orders: 720 },
];

const CUISINE_DATA = [
  { name: "Indian", value: 35, color: "#f97316" },
  { name: "Chinese", value: 20, color: "#3b82f6" },
  { name: "Fast Food", value: 25, color: "#ec4899" },
  { name: "Italian", value: 12, color: "#10b981" },
  { name: "Others", value: 8, color: "#8b5cf6" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setStats({
  //       totalUsers:       12450,
  //       activeRestaurants: 387,
  //       totalOrders:      89234,
  //       totalRevenue:     4250000,
  //       pendingApprovals: 14,
  //       activeDeliveries: 42,
  //     })
  //     setLoading(false)
  //   }, 700)
  // }, [])

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await adminApi.getDashboardStats();
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const STAT_CARDS = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          icon: HiUsers,
          change: "+12%",
        },
        {
          label: "Restaurants",
          value: stats.activeRestaurants,
          icon: HiOfficeBuilding,
          change: "+5%",
        },
        {
          label: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          icon: HiShoppingCart,
          change: "+18%",
        },
        {
          label: "Total Revenue",
          value: formatCurrency(stats.totalRevenue),
          icon: HiCurrencyRupee,
          change: "+22%",
        },
      ]
    : [];

  return (
    <div className="space-y-8 page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          Admin Dashboard
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : STAT_CARDS.map(({ label, value, icon: Icon, change }, i) => (
              <motion.div
                key={label}
                className="card p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${STAT_COLORS[i].bg}`}>
                    <Icon className={`w-6 h-6 ${STAT_COLORS[i].icon}`} />
                  </div>
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <HiTrendingUp className="w-3 h-3" /> {change}
                  </span>
                </div>
                <p className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
                  {value}
                </p>
                <p className="text-stone-400 text-sm mt-1">{label}</p>
              </motion.div>
            ))}
      </div>

      {/* Alerts */}
      {stats && (
        <motion.div
          className="card p-5 flex items-center gap-4 border-l-4 border-amber-400 bg-amber-50/50 dark:bg-amber-900/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <HiClock className="w-6 h-6 text-amber-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
              {stats.pendingApprovals} restaurants pending approval
            </p>
            <p className="text-stone-400 text-xs mt-0.5">
              Review and approve restaurant applications
            </p>
          </div>
          <a
            href="/admin/approvals"
            className="ml-auto btn-primary text-sm flex-shrink-0"
          >
            Review Now
          </a>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-100 mb-6">
            Revenue & Orders
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v, n) => (n === "revenue" ? formatCurrency(v) : v)}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                fill="url(#revenueGrad)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cuisine distribution */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-100 mb-6">
            Cuisine Mix
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={CUISINE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {CUISINE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {CUISINE_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: d.color }}
                />
                <span className="text-stone-600 dark:text-stone-400 flex-1">
                  {d.name}
                </span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
