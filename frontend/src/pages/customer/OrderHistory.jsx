import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiClock, HiCheckCircle, HiXCircle, HiTruck,  } from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import {
  formatCurrency,
  formatDateTime,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../utils/helpers";
import Modal from "../../components/common/Modal";
import { StarPicker } from "../../components/restaurant/RatingStars";
import { orderApi } from "../../api/order.api";
import toast from "react-hot-toast";


const STATUS_ICON = {
  PENDING: HiClock,
  CONFIRMED: HiCheckCircle,
  PREPARING: HiClock,
  ASSIGNED: HiTruck,
  PICKED_UP: HiTruck,
  ON_THE_WAY:HiTruck,
  OUT_FOR_DELIVERY: HiTruck,
  DELIVERED: HiCheckCircle,
  CANCELLED: HiXCircle,
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({
    open: false,
    orderId: null,
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const submitReview = async () => {
    try {
      await orderApi.rate(review.orderId, {
        rating: review.rating,
        comment: review.comment,
      });
      toast.success("Review submitted! Thanks 🌟");
      setReview({ open: false, orderId: null, rating: 0, comment: "" });
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="page-enter space-y-6">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
        My Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 skeleton h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No orders yet"
          message="Start exploring restaurants and place your first order!"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const StatusIcon = STATUS_ICON[order.status] || HiClock;
            const colorKey = ORDER_STATUS_COLORS[order.status] || "info";

            return (
              <motion.div
                key={order.orderId}
                className="card p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-stone-800 dark:text-stone-100">
                        {order.restaurantName}
                      </h3>
                      <span
                        className={`badge badge-${colorKey} flex items-center gap-1`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 mb-3">
                      {formatDateTime(order.createdAt)}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                      {order.items.map((item) => (
                        <span
                          key={item.name}
                          className="bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md"
                        >
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-stone-800 dark:text-stone-100">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-xs text-stone-400">#{order.orderId}</p>

                    {order.status === "DELIVERED" && (
                      <button
                        onClick={() =>
                          setReview({
                            open: true,
                            orderId: order.orderId,
                            rating: 0,
                            comment: "",
                          })
                        }
                        className="mt-2 text-xs text-brand-500 hover:text-brand-600 font-medium"
                      >
                        Rate order
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar for active orders */}
                {["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"].includes(
                  order.status,
                ) && (
                  <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 justify-between text-xs text-stone-500 mb-2">
                      {[
                        "Confirmed",
                        "Preparing",
                        "Out for Delivery",
                        "Delivered",
                      ].map((step, idx) => {
                        const active =
                          [
                            "CONFIRMED",
                            "PREPARING",
                            "OUT_FOR_DELIVERY",
                            "DELIVERED",
                          ].indexOf(order.status) >= idx;
                        return (
                          <span
                            key={step}
                            className={`text-center ${active ? "text-brand-500 font-semibold" : ""}`}
                          >
                            {step}
                          </span>
                        );
                      })}
                    </div>
                    <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].indexOf(order.status) + 1) * 25}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        open={review.open}
        onClose={() => setReview({ ...review, open: false })}
        title="Rate your order"
        footer={
          <>
            <button
              onClick={() => setReview({ ...review, open: false })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={submitReview} className="btn-primary">
              Submit Review
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-stone-500 text-sm mb-4">
              How was your experience?
            </p>
            <StarPicker
              value={review.rating}
              onChange={(r) => setReview({ ...review, rating: r })}
            />
          </div>
          <div>
            <label className="label">Comment (optional)</label>
            <textarea
              className="input resize-none h-24"
              placeholder="Tell us about your experience…"
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
