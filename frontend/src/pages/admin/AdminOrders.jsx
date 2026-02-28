import { useEffect, useState } from "react";
import { orderApi } from "../../api/order.api";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await orderApi.getAllOrders();
      const partnersRes = await orderApi.getDeliveryPartners();

      setOrders(ordersRes);
      setPartners(partnersRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const assign = async (orderId, partnerId) => {
    try {
      await orderApi.assignDeliveryPartner(orderId, partnerId);
      toast.success("Delivery Partner Assigned");
      fetchData();
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assign Deliveries</h1>

      {orders
        .filter((o) => o.status === "OUT_FOR_DELIVERY")
        .map((order) => (
          <div key={order.orderId} className="card p-5 space-y-3">
            <div>
              <p className="font-semibold">
                Order #{order.orderId} — {order.restaurantName}
              </p>
              <p className="text-sm text-gray-500">
                Amount: ₹{order.totalAmount}
              </p>
            </div>

            <div className="flex gap-3">
              <select
                onChange={(e) => assign(order.orderId, e.target.value)}
                className="border px-3 py-2 rounded"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Delivery Partner
                </option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
    </div>
  );
}
