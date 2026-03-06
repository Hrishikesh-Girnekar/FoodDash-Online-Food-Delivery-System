

import apiClient from './axiosInstance'; // ← replace with your actual axios instance

export const paymentApi = {
  /**
   
   * @param {{ amount: number }} payload
   * @returns {Promise<{ orderId: string, amount: number, currency: string, keyId: string }>}
   */
  createOrder: async (payload) => {
    const response = await apiClient.post("/payment/create-order", payload);
    return response.data.data ?? response.data;
  },

  /**
  
   * @param {{ razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }} payload
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  verifyPayment: async (payload) => {
    const response = await apiClient.post("/payment/verify", payload);
    const result = response.data.data ?? response.data;

    // Extra safety: if backend returned success:false, throw so caller handles it
    if (result.success === false) {
      throw new Error(result.message || "Payment verification failed");
    }

    return result;
  },
};