import { useState, useEffect } from "react";
import {
  formatCurrency,
  formatDateTime,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "../../utils/helpers";
import Table from "../../components/common/Table";
import toast from "react-hot-toast";
import {orderApi} from "../../api/order.api";

const NEXT_STATUS = {
  PLACED: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  // OUT_FOR_DELIVERY: "DELIVERED",
};

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderApi.getOwnerOrders();
      const backendOrders = res.data.data;
      console.log(backendOrders);
      

      const formatted = backendOrders.map((order) => ({
        id: order.orderId,
        customer: order.restaurantName,
        items: order.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
        status: order.status,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
      }));

      setOrders(formatted);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusHandler = async (id, status) => {
    try {
      await orderApi.updateOrderStatus(id, status);

      setOrders((os) =>
        os.map((o) => (o.id === id ? { ...o, status } : o))
      );

      toast.success(`Status updated to ${ORDER_STATUS_LABELS[status]}`);
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
    }
  };

  const displayed =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (v) => <span className="font-mono text-xs">#{v}</span>,
    },
    { key: "customer", label: "Restaurant" },
    {
      key: "items",
      label: "Items",
      render: (v) => (
        <span className="text-xs text-stone-500 line-clamp-1">{v}</span>
      ),
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (v) => <span className="font-bold">{formatCurrency(v)}</span>,
    },
    {
      key: "createdAt",
      label: "Time",
      render: (v) => formatDateTime(v),
    },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span
          className={`badge badge-${ORDER_STATUS_COLORS[v] || "info"} text-xs`}
        >
          {ORDER_STATUS_LABELS[v] || v}
        </span>
      ),
    },
    {
      key: "id",
      label: "Action",
      render: (id, row) => {
        const next = NEXT_STATUS[row.status];
        if (!next) return <span className="text-xs text-stone-300">—</span>;

        return (
          <button
            onClick={() => updateStatusHandler(id, next)}
            className="btn-primary text-xs py-1.5 px-3"
          >
            → {ORDER_STATUS_LABELS[next]}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 page-enter">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
        Orders
      </h1>

      <div className="flex gap-2 flex-wrap">
        {[
          "ALL",
          "PLACED",
          "ACCEPTED",
          "PREPARING",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all
              ${
                filter === s
                  ? "bg-brand-500 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
              }`}
          >
            {s === "ALL" ? "All" : ORDER_STATUS_LABELS[s]}
            <span className="ml-1.5 opacity-70">
              (
              {s === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === s).length}
              )
            </span>
          </button>
        ))}
      </div>

      <Table
        columns={columns}
        rows={displayed}
        loading={loading}
        emptyTitle="No orders"
        emptyMessage="Orders will appear here as customers place them"
      />
    </div>
  );
}
