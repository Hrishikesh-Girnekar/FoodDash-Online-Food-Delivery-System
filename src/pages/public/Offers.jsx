import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Copy, Timer, Gift, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const initialOffers = [
  {
    title: "50% OFF",
    desc: "On first order above ₹199",
    code: "WELCOME50",
    expiry: 3600,
    gradient: "from-orange-200 via-pink-100 to-white",
  },
  {
    title: "BUY 1 GET 1",
    desc: "On pizzas & burgers",
    code: "BOGO",
    expiry: 5400,
    gradient: "from-pink-200 via-orange-100 to-white",
  },
  {
    title: "FREE DELIVERY",
    desc: "Above ₹299",
    code: "FREEDEL",
    expiry: 7200,
    gradient: "from-yellow-200 via-orange-100 to-white",
  },
  {
    title: "30% OFF",
    desc: "Weekend special deals",
    code: "WEEKEND30",
    expiry: 4000,
    gradient: "from-purple-200 via-pink-100 to-white",
  },
  {
    title: "₹100 OFF",
    desc: "Orders above ₹499",
    code: "SAVE100",
    expiry: 6000,
    gradient: "from-green-200 via-emerald-100 to-white",
  },
  {
    title: "COMBO DEAL",
    desc: "Meals starting ₹149",
    code: "COMBO149",
    expiry: 5000,
    gradient: "from-blue-200 via-indigo-100 to-white",
  },
];

export default function Offers() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState({});
  const [timers, setTimers] = useState(initialOffers.map((o) => o.expiry));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => prev.map((t) => (t > 0 ? t - 1 : 0)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const fireConfetti = () => {
    for (let i = 0; i < 15; i++) {
      const el = document.createElement("div");
      el.className =
        "fixed w-2 h-2 bg-orange-400 rounded-full z-50 pointer-events-none";
      el.style.left = Math.random() * window.innerWidth + "px";
      el.style.top = "-10px";
      document.body.appendChild(el);

      el.animate(
        [
          { transform: "translateY(0px)", opacity: 1 },
          {
            transform: `translateY(${window.innerHeight}px)`,
            opacity: 0,
          },
        ],
        { duration: 1200 },
      );

      setTimeout(() => el.remove(), 1200);
    }
  };

  const handleReveal = (i) => {
    setRevealed((prev) => ({ ...prev, [i]: true }));
    fireConfetti();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <div
      className="min-h-screen px-6 py-16 
      bg-gradient-to-br from-orange-100 via-white to-orange-200
      dark:from-[#0f0f0f] dark:via-[#121212] dark:to-[#1a1a1a]"
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3">
          <Gift className="text-orange-500" />
          Exclusive Offers
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg flex items-center justify-center gap-2">
          <Sparkles size={18} className="text-orange-400" />
          Unlock colorful deals
        </p>
      </div>

      {/* Offers */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {initialOffers.map((offer, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-3xl shadow-xl 
            bg-gradient-to-br ${offer.gradient}
            dark:bg-white/5 backdrop-blur-xl 
            border border-orange-100 dark:border-white/10 
            relative overflow-hidden`}
          >
            {/* ✅ FIXED GLOW */}
            <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/20 blur-2xl"></div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm mb-4 text-gray-600 dark:text-gray-400">
              <Timer size={16} />
              {formatTime(timers[i])}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {offer.title}
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {offer.desc}
            </p>

            {/* Reveal */}
            {!revealed[i] ? (
              <div
                onClick={() => handleReveal(i)}
                className="mt-6 cursor-pointer bg-white/60 dark:bg-white/10 p-4 rounded-xl text-center border border-white/40 dark:border-white/10 hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Gift size={18} className="text-orange-500" />
                Tap to Reveal
              </div>
            ) : (
              <div className="mt-6 bg-white dark:bg-black p-4 rounded-xl text-center">
                <p className="font-bold text-lg text-orange-600">
                  {offer.code}
                </p>

                <button
                  onClick={() => copyCode(offer.code)}
                  className="flex items-center gap-2 mx-auto mt-2 text-sm text-orange-500"
                >
                  <Copy size={16} />
                  Copy Code
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/restaurants")}
              className="mt-6 w-full bg-orange-400 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              Order Now
              <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-24 max-w-5xl mx-auto rounded-3xl p-10 text-center shadow-2xl
        bg-gradient-to-r from-orange-400 via-pink-500 to-orange-500"
      >
        <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-2">
          <Sparkles />
          Up to 60% OFF on your favorite meals
        </h2>

        <p className="text-white/90 mb-6">
          No code needed. Just order and enjoy instant savings.
        </p>

        <button
          onClick={() => navigate("/restaurants")}
          className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition flex items-center gap-2 mx-auto"
        >
          Explore Restaurants
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
