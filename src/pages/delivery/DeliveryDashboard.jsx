import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiTruck,
  HiCurrencyRupee,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/helpers";
import { orderApi } from "../../api/order.api";
import toast from "react-hot-toast";

const DELIVERY_STATUS_LABELS = {
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  ON_THE_WAY: "On the Way",
  DELIVERED: "Delivered",
};

const NEXT = {
  ASSIGNED: "PICKED_UP",
  PICKED_UP: "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED",
};

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, todayEarnings: 0 });
  const [otpMap, setOtpMap] = useState({});

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await orderApi.getAssignedOrders();
      const backendData = res.data.data;

      const today = new Date().toISOString().split("T")[0];

      const formatted = backendData.map((o) => ({
        id: o.orderId,
        restaurantName: o.restaurantName,
        customerAddress: "Pune, Hinjewadi phase 1",
        customerPhone: "9876543210",
        status: o.status,
        amount: Number(o.totalAmount),
        items: o.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
        assignedAt: o.createdAt,
        accepted: true,
      }));

      
      

      //Calculate today's stats
      const todayDeliveries = formatted.filter(
        (d) => d.assignedAt.split("T")[0] === today,
      );

      const todayEarnings = todayDeliveries
        .filter((d) => d.status === "DELIVERED")
        .reduce((sum, d) => sum + d.amount, 0);

      setDeliveries(formatted);

      console.log(deliveries);

      setStats({
        today: todayDeliveries.length,
        todayEarnings: todayEarnings,
      });
    } catch (err) {
      toast.error("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const accept = (id) => {
    setDeliveries((ds) =>
      ds.map((d) => (d.id === id ? { ...d, accepted: true } : d)),
    );
    toast.success("Delivery accepted! 🛵");
  };

  const reject = (id) => {
    setDeliveries((ds) => ds.filter((d) => d.id !== id));
    toast("Delivery rejected", { icon: "❌" });
  };

  const updateStatus = async (id, status) => {
    try {
      await orderApi.updateDeliveryStatus(id, status);

      setDeliveries((ds) =>
        ds.map((d) => (d.id === id ? { ...d, status } : d)),
      );

      toast.success(`Status: ${DELIVERY_STATUS_LABELS[status]}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
        Delivery Dashboard
      </h1>

      {/* Today's stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="card p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
              <HiTruck className="w-5 h-5 text-brand-500" />
            </div>
            <span className="text-stone-400 text-sm">Today's Deliveries</span>
          </div>
          <p className="font-display font-bold text-3xl text-stone-800 dark:text-stone-100">
            {stats.today}
          </p>
        </motion.div>

        <motion.div
          className="card p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <HiCurrencyRupee className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-stone-400 text-sm">Today's Earnings</span>
          </div>
          <p className="font-display font-bold text-3xl text-stone-800 dark:text-stone-100">
            {formatCurrency(stats.todayEarnings)}
          </p>
        </motion.div>
      </div>

      {/* Active deliveries */}
      <section>
        <h2 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-100 mb-4">
          Active Deliveries
        </h2>

        {loading ? (
          <div className="card p-5 skeleton h-40" />
        ) : deliveries.length === 0 ? (
          <EmptyState
            icon="🛵"
            title="No deliveries assigned"
            message="New orders will appear here"
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {deliveries.map((d) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-100">
                        {d.restaurantName}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5 font-mono">
                        Order #{d.id}
                      </p>
                    </div>
                    <span className="badge-brand text-xs">
                      {DELIVERY_STATUS_LABELS[d.status] || d.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400 mb-5">
                    <p className="flex items-start gap-2">
                      <span className="flex-shrink-0">📍</span>
                      <span>{d.customerAddress}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📞</span> {d.customerPhone}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🍴</span>
                      <span className="text-xs">{d.items}</span>
                    </p>
                    <p className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-100">
                      <span>💰</span> {formatCurrency(d.amount)}
                    </p>
                  </div>

                  {/* Action buttons */}
                  {!d.accepted ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => reject(d.id)}
                        className="flex-1 btn-secondary text-red-500 text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => accept(d.id)}
                        className="flex-1 btn-primary text-sm"
                      >
                        Accept 🛵
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Progress */}
                      <div className="flex items-center gap-1 mb-4 text-xs">
                        {[
                          "ASSIGNED",
                          "PICKED_UP",
                          "ON_THE_WAY",
                          "DELIVERED",
                        ].map((s, idx) => {
                          const steps = [
                            "ASSIGNED",
                            "PICKED_UP",
                            "ON_THE_WAY",
                            "DELIVERED",
                          ];
                          const active = steps.indexOf(d.status) >= idx;
                          return (
                            <div key={s} className="flex items-center flex-1">
                              <div
                                className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center
                                ${active ? "bg-brand-500 text-white" : "bg-stone-200 dark:bg-stone-700"}`}
                              >
                                {active && (
                                  <HiCheckCircle className="w-3 h-3" />
                                )}
                              </div>
                              {idx < 3 && (
                                <div
                                  className={`h-0.5 flex-1 ${active ? "bg-brand-500" : "bg-stone-200 dark:bg-stone-700"}`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {NEXT[d.status] && (
                        <button
                          onClick={() => updateStatus(d.id, NEXT[d.status])}
                          className="w-full btn-primary text-sm"
                        >
                          Mark as {DELIVERY_STATUS_LABELS[NEXT[d.status]]}
                        </button>
                      )}
                      {d.status === "DELIVERED" && (
                        <div className="text-center py-3">
                          <span className="text-2xl block mb-1">✅</span>
                          <p className="text-sm font-semibold text-emerald-600">
                            Delivery Complete!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
