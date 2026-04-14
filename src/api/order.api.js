
import api from "./axiosInstance"; // make sure this is your configured instance

export const orderApi = {
  // ================= CUSTOMER =================

  // Get logged-in user's orders
  getMyOrders: async () => {
    const res = await api.get("/orders");
    return res.data;
  },

  // Place order
  placeOrder: async (payload) => {
    const res = await api.post("/orders/place", payload);
    return res.data;
  },

  // Cancel my order
  cancelMyOrder: async (orderId) => {
    const res = await api.put(`/orders/${orderId}/cancel`);
    return res.data;
  },

  // Rate order (your existing)
  rate: async (orderId, payload) => {
    const res = await api.post(`/orders/${orderId}/rating`, payload);
    return res.data;
  },

  // ================= RESTAURANT OWNER =================

  // Get orders for owner
  getOwnerOrders: async () => {
    const res = await api.get("/orders/owner");
    return res;
  },

  // Update order status (Owner → only till OUT_FOR_DELIVERY)
  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(`/orders/${orderId}/status`, null, {
      params: { status },
    });
    return res.data;
  },

  // ================= DELIVERY PARTNER =================

  // Get assigned deliveries
  getAssignedOrders: async () => {
    const res = await api.get("/orders/delivery");
    return res;
  },

  // Update delivery flow (ASSIGNED → PICKED_UP → ON_THE_WAY → DELIVERED)
  updateDeliveryStatus: async (orderId, status) => {
    const res = await api.put(`/orders/delivery/${orderId}/status`, null, {
      params: { status },
    });
    return res;
  },

  // Optional: Direct mark delivered endpoint (if still using)
  markDelivered: async (orderId) => {
    const res = await api.put(`/orders/delivery/${orderId}/deliver`);
    return res.data;
  },

  // ================= ADMIN =================

  assignDeliveryPartner: async (orderId, partnerId) => {
    const res = await api.put(`/orders/admin/${orderId}/assign/${partnerId}`);
    return res.data;
  },

  getAllOrders: async () => {
    const res = await api.get("/orders/admin");
    return res.data;
  },

  getDeliveryPartners: async () => {
    const res = await api.get("/orders/admin/delivery-partners");
    return res.data;
  },
};

