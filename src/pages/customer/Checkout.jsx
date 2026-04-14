
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
import { paymentApi } from "../../api/Payment.api"; 
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "UPI",  label: "UPI",               icon: HiDeviceMobile },
  { id: "CARD", label: "Debit / Credit Card", icon: HiCreditCard  },
  { id: "CASH", label: "Cash on Delivery",    icon: HiCash        },
];

// Payment methods that require Razorpay online flow
const ONLINE_METHODS = ["UPI", "CARD"];

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY SCRIPT LOADER
// Dynamically injects the Razorpay checkout.js script only when needed.
// Safe to call multiple times — checks if already loaded.
// ─────────────────────────────────────────────────────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    // Already loaded — resolve immediately
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.id  = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const {
    items,
    subtotal,
    deliveryFee,
    taxes,
    total,          // ← used as the Razorpay payment amount
    clearCart,
    restaurantId,
  } = useCart();

  const { user } = useAuth();
  const navigate  = useNavigate();

  // ── Local state ──────────────────────────────────────────────────────────
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [paymentMethod, setPayment] = useState("UPI");
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!address.line1.trim())   e.line1   = "Address is required";
    if (!address.city.trim())    e.city    = "City is required";
    if (!address.pincode.trim()) e.pincode = "Pincode is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RAZORPAY ONLINE PAYMENT FLOW
  // Step 1 → Create Razorpay order on your Spring Boot backend
  // Step 2 → Open Razorpay checkout modal
  // Step 3 → On success, verify signature on backend
  // Step 4 → Place the food order
  // ─────────────────────────────────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    // Load Razorpay script first
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Payment service unavailable. Please try again.");
      return false; // signal failure to caller
    }

    // Step 1: Ask your Spring Boot backend to create a Razorpay order.
    //         Backend calls razorpayClient.orders.create({ amount: total*100 })
    //         and returns { orderId, amount, currency, keyId }
    let orderData;
    try {
      orderData = await paymentApi.createOrder({
        amount: Math.round(total), // in rupees — backend multiplies ×100 for paise
      });
    } catch (err) {
      toast.error("Could not initiate payment. Please try again.");
      return false;
    }

    const { orderId, amount, currency, keyId } = orderData;

    // Step 2: Open the Razorpay checkout modal.
    //         Returns a Promise that resolves to the Razorpay response on
    //         success, or rejects/null on failure/dismissal.
    const razorpayResponse = await openRazorpayModal({
      keyId,
      orderId,
      amount,
      currency,
      user,
    });

    if (!razorpayResponse) {
      // User closed the modal or payment failed — do NOT place the order
      return false;
    }

    // Step 3: Send all three Razorpay values to your backend for
    //         HMAC-SHA256 signature verification. This is the security step.
    //         Only if the signature matches will the backend mark the payment as PAID.
    try {
      await paymentApi.verifyPayment({
        razorpayOrderId:   razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
      });
    } catch (err) {
      // Signature mismatch — possible tampering. Don't place order.
      toast.error("Payment verification failed. Please contact support.");
      return false;
    }

    // Step 4: Verification passed — return payment details so we can
    //         attach them to the food order payload
    return {
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpayOrderId:   razorpayResponse.razorpay_order_id,
    };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RAZORPAY MODAL — wraps the callback-based Razorpay SDK in a Promise
  // ─────────────────────────────────────────────────────────────────────────
  const openRazorpayModal = ({ keyId, orderId, amount, currency, user }) =>
    new Promise((resolve) => {
      const options = {
        key:      keyId,
        amount,                     // in paise (backend already multiplied)
        currency: currency || "INR",
        name:     "FoodApp",        // ← change to your app name
        description: "Food Order Payment",
        order_id: orderId,

        // Pre-fill user info in the checkout form
        prefill: {
          name:    user?.name    || "",
          email:   user?.email   || "",
          contact: user?.phone   || "",
        },

        theme: { color: "#f97316" }, // ← match your brand color (brand-500)

        // ── SUCCESS: Razorpay calls this with payment proof ──────────────
        handler: (response) => {
          // response contains:
          //   razorpay_payment_id → the actual payment
          //   razorpay_order_id   → the Razorpay order
          //   razorpay_signature  → HMAC proof to verify on backend
          resolve(response);
        },

        // ── MODAL CLOSED by user (without paying) ───────────────────────
        modal: {
          ondismiss: () => {
            toast("Payment cancelled", { icon: "ℹ️" });
            resolve(null); // null = no payment
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // ── PAYMENT FAILED (e.g. card declined, bank down) ──────────────────
      rzp.on("payment.failed", (response) => {
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
        resolve(null); // null = treat as no payment
      });

      rzp.open();
    });

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN PLACE ORDER HANDLER
  // Branches based on payment method:
  //   CASH → place order directly (existing flow)
  //   UPI / CARD → Razorpay flow first, then place order
  // ─────────────────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // ── ONLINE PAYMENT (UPI / CARD) ──────────────────────────────────────
      if (ONLINE_METHODS.includes(paymentMethod)) {
        const paymentResult = await handleOnlinePayment();

        // Payment was not completed (user cancelled or failed)
        if (!paymentResult) {
          setLoading(false);
          return;
        }

        // Payment verified ✅ — now place the food order.
        // We attach the Razorpay payment proof so your backend
        // can cross-reference and not require a re-verification.
        const payload = {
          restaurantId,
          items: items.map((i) => ({
            menuItemId: i.id,
            quantity:   i.quantity,
          })),
          paymentMethod,
          paymentStatus:     "PAID",
          razorpayPaymentId: paymentResult.razorpayPaymentId,
          razorpayOrderId:   paymentResult.razorpayOrderId,
          deliveryAddress:   address,
        };

        const data = await orderApi.placeOrder(payload);
        clearCart();
        navigate("/customer/order-success", {
          state: { orderId: data.data },
        });

      // ── CASH ON DELIVERY ────────────────────────────────────────────────
      } else {
        const payload = {
          restaurantId,
          items: items.map((i) => ({
            menuItemId: i.id,
            quantity:   i.quantity,
          })),
          paymentMethod,
          paymentStatus:   "PENDING",  // paid at door
          deliveryAddress: address,
        };

        const data = await orderApi.placeOrder(payload);
        clearCart();
        navigate("/customer/order-success", {
          state: { orderId: data.data },
        });
      }

    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // ── Guard: redirect if cart is empty ─────────────────────────────────────
  if (items.length === 0) {
    navigate("/restaurants");
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-enter max-w-3xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Left: Address + Payment ─────────────────────────────────── */}
        <div className="md:col-span-2 space-y-6">

          {/* Address */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2 text-stone-800 dark:text-stone-100">
              <HiLocationMarker className="w-5 h-5 text-brand-500" />
              Delivery Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Street address *</label>
                <input
                  className={`input ${errors.line1 ? "border-red-400" : ""}`}
                  placeholder="House/Flat no, Street name"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
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
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
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
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="label">Landmark (optional)</label>
                <input
                  className="input"
                  placeholder="Near park, Behind mall…"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-lg mb-5 flex items-center gap-2 text-stone-800 dark:text-stone-100">
              <HiCreditCard className="w-5 h-5 text-brand-500" />
              Payment Method
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
                  {/* Show "Powered by Razorpay" badge for online methods */}
                  {ONLINE_METHODS.includes(id) && (
                    <span className="ml-auto text-[10px] font-medium text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-full">
                      Razorpay
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Order Summary ────────────────────────────────────── */}
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

            {/* Dynamic button label based on payment method */}
            <Button
              onClick={placeOrder}
              loading={loading}
              className="w-full"
              size="lg"
            >
              {ONLINE_METHODS.includes(paymentMethod)
                ? `Pay ${formatCurrency(total)}`
                : "Place Order"}
            </Button>

            <p className="text-xs text-stone-400 text-center">
              {ONLINE_METHODS.includes(paymentMethod)
                ? "Secured by Razorpay · 256-bit SSL"
                : "By placing order you agree to our Terms of Service"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
