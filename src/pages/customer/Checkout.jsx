import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiLocationMarker,
  HiCreditCard,
  HiCash,
  HiDeviceMobile,
} from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../components/common/Button";
import { orderApi } from "../../api/order.api";
import toast from "react-hot-toast";
import axios from "axios";

const PAYMENT_METHODS = [
  { id: "UPI", label: "UPI", icon: HiDeviceMobile },
  { id: "CARD", label: "Debit/Credit Card", icon: HiCreditCard },
  { id: "CASH", label: "Cash on Delivery", icon: HiCash },
];

export default function Checkout() {
  const {
    items,
    subtotal,
    deliveryFee,
    taxes,
    total,
    clearCart,
    restaurantId,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    line1: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [paymentMethod, setPayment] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!address.line1.trim()) e.line1 = "Address is required";
    if (!address.city.trim()) e.city = "City is required";
    if (!address.pincode.trim()) e.pincode = "Pincode is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // const placeOrder = async () => {
  //   if (!validate()) return
  //   setLoading(true)
  //   try {
  //     const payload = {
  //       restaurantId,
  //       items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
  //       deliveryAddress: address,
  //       paymentMethod,
  //       totalAmount: total,
  //     }
  //     const { data } = await orderApi.place(payload)
  //     clearCart()
  //     navigate('/customer/order-success', { state: { orderId: data.id || 'FD' + Date.now() } })
  //   } catch {
  //     toast.error('Failed to place order. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("fooddash_token");

      const payload = {
        restaurantId,
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
      };

      const { data } = await axios.post(
        "http://localhost:8080/api/v1/orders/place",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      clearCart();

      navigate("/customer/order-success", {
        state: { orderId: data.data }, // IMPORTANT CHANGE
      });
    } catch (err) {
      console.log("Order error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/restaurants");
    return null;
  }

  return (
    <div className="page-enter max-w-3xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Address + Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Address */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2 text-stone-800 dark:text-stone-100">
              <HiLocationMarker className="w-5 h-5 text-brand-500" /> Delivery
              Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Street address *</label>
                <input
                  className={`input ${errors.line1 ? "border-red-400" : ""}`}
                  placeholder="House/Flat no, Street name"
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                />
                {errors.line1 && (
                  <p className="text-xs text-red-500 mt-1">{errors.line1}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input
                    className={`input ${errors.city ? "border-red-400" : ""}`}
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="label">Pincode *</label>
                  <input
                    className={`input ${errors.pincode ? "border-red-400" : ""}`}
                    placeholder="400001"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="label">Landmark (optional)</label>
                <input
                  className="input"
                  placeholder="Near park, Behind mall…"
                  value={address.landmark}
                  onChange={(e) =>
                    setAddress({ ...address, landmark: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2 text-stone-800 dark:text-stone-100">
              <HiCreditCard className="w-5 h-5 text-brand-500" /> Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      paymentMethod === id
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                        : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={paymentMethod === id}
                    onChange={() => setPayment(id)}
                    className="accent-brand-500"
                  />
                  <Icon className="w-5 h-5 text-stone-500" />
                  <span className="font-medium text-sm text-stone-700 dark:text-stone-300">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="card p-5 sticky top-24 space-y-4">
            <h2 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-sm divide-y divide-stone-100 dark:divide-stone-800">
              <div className="space-y-2 pb-3">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="flex justify-between text-stone-600 dark:text-stone-400"
                  >
                    <span className="truncate">
                      {i.name} × {i.quantity}
                    </span>
                    <span className="flex-shrink-0 ml-2">
                      {formatCurrency(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-3">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-stone-800 dark:text-stone-100 pt-3 text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={placeOrder}
              loading={loading}
              className="w-full"
              size="lg"
            >
              Place Order
            </Button>

            <p className="text-xs text-stone-400 text-center">
              By placing order you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
