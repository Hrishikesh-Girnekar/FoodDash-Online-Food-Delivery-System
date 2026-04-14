import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {

  HiArrowRight,
 
} from "react-icons/hi";
import { Clock, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import { CUISINES } from "../../utils/constants";
import { RestaurantCardSkeleton } from "../../components/common/Skeleton";
import { getApprovedRestaurants } from "../../api/restaurant.api";


const HERO_STATS = [
  { label: "Restaurants", value: "500+", icon: "🍽️" },
  { label: "Happy Customers", value: "50K+", icon: "😊" },
  { label: "Cities", value: "25+", icon: "🌆" },
];

const FEATURES = [
  {
    icon: Clock,
    title: "Fast Delivery",
    desc: "Get your food delivered in minutes with our optimized delivery system.",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    desc: "Track your order in real-time from restaurant to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Multiple safe and secure payment options including UPI.",
  },
  {
    icon: Sparkles,
    title: "Top Quality",
    desc: "Only highly rated restaurants with premium food quality.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  

  useEffect(() => {
    let retryTimeout;

    const fetchRestaurants = async () => {
      try {
        const res = await getApprovedRestaurants();

        setRestaurants(res.data.data);
        setLoading(false);
      } catch (err) {
        console.log("Retrying... backend might be asleep 😴");

        // Retry after 5 sec
        retryTimeout = setTimeout(fetchRestaurants, 5000);
      }
    };

    fetchRestaurants();

    return () => clearTimeout(retryTimeout);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 3000); // show after 3 sec

    return () => clearTimeout(timer);
  }, []);

  const filtered = restaurants.filter(
    (r) => activeCategory === "All" || r.cuisine === activeCategory,
  );

  return (
    <div className="page-enter">
      {/* ── Hero ──────────────────────────────────── */}
      <section className="bg-hero-gradient dark:bg-none dark:bg-gradient-to-br dark:from-stone-900 dark:to-stone-800 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge-brand text-sm mb-6 inline-flex">
              🎉 Free delivery on your first order
            </span>
          </motion.div>

          <motion.h1
            className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl
                       text-stone-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Food that makes
            <br />
            <span
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 
  bg-[length:200%_auto] bg-clip-text text-transparent 
  animate-[shine_3s_linear_infinite]"
            >
              you smile
            </span>
            {/* Paste this just before </motion.h1> closes, replacing 😄 */}
            <motion.span
              className="inline-block align-middle ml-2 relative"
              style={{ width: "1em", height: "1em", marginTop: "-0.1em" }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <style>{`
    @keyframes blink{0%,88%,100%{transform:scaleY(1)}92%{transform:scaleY(0.08)}}
    @keyframes blush{0%,100%{opacity:.55}50%{opacity:.9}}
    @keyframes sp1{0%,100%{opacity:0;transform:scale(.4) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(20deg)}}
    @keyframes sp2{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1) rotate(-15deg)}}
    @keyframes sp3{0%,60%{opacity:0;transform:scale(.3)}30%{opacity:1;transform:scale(.85) rotate(10deg)}}
    .ey-l{transform-origin:20px 23px;animation:blink 4.2s ease-in-out infinite}
    .ey-r{transform-origin:43px 23px;animation:blink 4.2s ease-in-out infinite .08s}
    .ch-l{animation:blush 2.2s ease-in-out infinite}
    .ch-r{animation:blush 2.2s ease-in-out infinite .6s}
    .sp1{animation:sp1 2.6s ease-in-out infinite}
    .sp2{animation:sp2 2.6s ease-in-out infinite .9s}
    .sp3{animation:sp3 2.6s ease-in-out infinite 1.6s}
  `}</style>
              <svg
                viewBox="0 0 66 66"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
              >
                {/* Glow aura */}
                <circle cx="33" cy="33" r="30" fill="#fb923c" opacity="0.18" />
                {/* Face */}
                <circle
                  cx="33"
                  cy="33"
                  r="26"
                  fill="#FFD93D"
                  stroke="#F59E0B"
                  strokeWidth="1.8"
                />
                {/* Shine */}
                <ellipse
                  cx="24"
                  cy="22"
                  rx="7"
                  ry="4"
                  fill="white"
                  opacity="0.22"
                  transform="rotate(-20 24 22)"
                />
                {/* Left eye */}
                <g className="ey-l">
                  <ellipse cx="20" cy="23" rx="3.8" ry="4.5" fill="#1c1917" />
                  <ellipse cx="21.5" cy="21.2" rx="1.3" ry="1.3" fill="white" />
                </g>
                {/* Right eye */}
                <g className="ey-r">
                  <ellipse cx="43" cy="23" rx="3.8" ry="4.5" fill="#1c1917" />
                  <ellipse cx="44.5" cy="21.2" rx="1.3" ry="1.3" fill="white" />
                </g>
                {/* Smile + teeth */}
                <path
                  d="M20 37 Q33 50 46 37"
                  stroke="#1c1917"
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M22 37.5 Q33 46 44 37.5"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                {/* Cheeks */}
                <ellipse
                  className="ch-l"
                  cx="13"
                  cy="40"
                  rx="7"
                  ry="5"
                  fill="#f472b6"
                  opacity="0.7"
                />
                <ellipse
                  className="ch-r"
                  cx="53"
                  cy="40"
                  rx="7"
                  ry="5"
                  fill="#f472b6"
                  opacity="0.7"
                />
                {/* Sparkles */}
                <g className="sp1" style={{ transformOrigin: "52px 10px" }}>
                  <path
                    d="M52 7L52.8 9.2L55 10L52.8 10.8L52 13L51.2 10.8L49 10L51.2 9.2Z"
                    fill="#fb923c"
                  />
                </g>
                <g className="sp2" style={{ transformOrigin: "7px 24px" }}>
                  <path
                    d="M7 21L7.6 23L9.6 23.6L7.6 24.2L7 26.2L6.4 24.2L4.4 23.6L6.4 23Z"
                    fill="#ec4899"
                  />
                </g>
                <g className="sp3" style={{ transformOrigin: "55px 53px" }}>
                  <path
                    d="M55 51L55.5 52.5L57 53L55.5 53.5L55 55L54.5 53.5L53 53L54.5 52.5Z"
                    fill="#fb923c"
                  />
                </g>
              </svg>
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-stone-500 dark:text-stone-400 text-lg mt-5 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover great restaurants near you and get your favourite meals
            delivered in minutes.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mt-8 flex gap-3 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-1 relative">
              <input
                type="text"
                className="input pl-12 py-3.5 bg-white dark:bg-stone-800 shadow-card"
                placeholder="Search restaurants, cuisines…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/restaurants?q=${query}`)
                }
              />
            </div>
            <button
              onClick={() => navigate(`/restaurants?q=${query}`)}
              className="btn-primary px-6 py-3.5 flex-shrink-0"
            >
              Search
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-10 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <span className="text-2xl block">{s.icon}</span>
                <p className="font-display font-bold text-2xl text-stone-800 dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100 mb-6">
          What are you craving?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CUISINES.slice(0, 10).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                ${
                  activeCategory === c
                    ? "bg-brand-500 text-white shadow-brand"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-brand-300"
                }
              `}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Restaurants ──────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
            Popular near you
          </h2>
          <Link
            to="/restaurants"
            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            View all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* 🔹 Always Loading until data comes */}
          {loading && (
            <>
              {/* ⏳ Show message after delay */}
              {showSlowMessage && (
                <div className="col-span-full text-center py-6">
                  <p className="text-stone-500 font-medium flex items-center justify-center gap-1">
                    Loading
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </p>

                  <p className="text-stone-400 text-sm mt-2">
                    Our server is waking up 😴
                  </p>
                  <p className="text-stone-400 text-sm mt-1">
                    Just a moment... good food takes time 🍕
                  </p>
                </div>
              )}
              {Array.from({ length: 4 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </>
          )}

          {/* 🔹 Success State */}
          {!loading &&
            filtered.map((r) => (
              <motion.div key={r.id} variants={item}>
                <RestaurantCard restaurant={r} />
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────── */}

      <section className="relative py-24 px-6 bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-black overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-stone-800 dark:text-white mb-4">
            Why choose <span className="text-orange-500">FoodDash?</span>
          </h2>

          <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto mb-16">
            Experience lightning-fast delivery, real-time tracking, and secure
            payments — all in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;

              const colorStyles = [
                "from-orange-100 to-orange-200/70 dark:from-orange-900/20 dark:to-orange-800/10",
                "from-purple-100 to-purple-200/70 dark:from-purple-900/20 dark:to-purple-800/10",
                "from-blue-100 to-blue-200/70 dark:from-blue-900/20 dark:to-blue-800/10",
                "from-green-100 to-green-200/70 dark:from-green-900/20 dark:to-green-800/10",
              ];

              const iconColors = [
                "text-orange-600",
                "text-purple-600",
                "text-blue-600",
                "text-green-600",
              ];

              return (
                <motion.div
                  key={f.title}
                  className={`group relative rounded-2xl 
              border border-stone-200/70 dark:border-stone-800
              bg-gradient-to-br ${colorStyles[i % 4]}
              backdrop-blur-xl p-6 text-center
              
              shadow-[0_4px_20px_rgba(0,0,0,0.06)]
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)]
              
              hover:border-orange-300/60
              transition-all duration-500`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* subtle glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-br from-white/30 to-transparent"></div>

                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-white dark:bg-stone-800 mb-4 shadow-inner"
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`w-6 h-6 ${iconColors[i % 4]}`} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg text-stone-800 dark:text-white mb-2">
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {f.desc}
                  </p>

                  {/* CTA */}
                  <div className="text-sm font-medium text-orange-500 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Learn more →
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── PREMIUM CTA (MATCHED THEME) ───────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#f6e7c9] to-[#edd2a4]">
        <motion.div
          className="relative max-w-4xl mx-auto rounded-[28px]
               bg-gradient-to-br from-orange-100 via-orange-50 to-pink-100
               border border-orange-200
               p-12 text-center
               shadow-[0_10px_40px_rgba(255,140,0,0.15)]"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          viewport={{ once: true }}
        >
          {/* 🔥 Soft Glow Background */}
          <div
            className="absolute inset-0 rounded-[28px]
                    bg-gradient-to-r from-orange-300/20 via-pink-300/20 to-orange-300/20
                    blur-2xl opacity-60"
          ></div>

          <div className="relative z-10">
            {/* Heading */}
            <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 text-gray-900">
              Hungry right now?
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 mb-10 text-lg md:text-xl">
              Sign up and get your first delivery free. No minimum order.
            </p>

            {/* CTA Button */}
            <Link
              to="/register"
              className="group inline-flex items-center gap-2
                   bg-gradient-to-r from-orange-500 to-pink-500
                   text-white font-semibold px-10 py-4 rounded-2xl
                   shadow-md hover:shadow-xl
                   hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
